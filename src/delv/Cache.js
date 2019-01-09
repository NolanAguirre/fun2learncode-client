import graphql from 'graphql-anywhere'
import typeMap from './TypeMap'
import CacheEmitter from './CacheEmitter';
const gql = require('graphql-tag')
const util = require('util');
var _ = require('lodash');

let UID = 'nodeId'

class Cache {
    constructor() {
        this.cache = {};
        this.keyConflict = new Map();
        this.keyConflict.set('activityPrerequisitesByActivity', 'activityByActivity')
        this.keyConflict.set('activityByActivity', 'activityPrerequisitesByActivity')
        this.keyConflict.set('activityPrerequisitesByPrerequisite', 'activityByPrerequisite')
        this.keyConflict.set('activityByPrerequisite', 'activityPrerequisitesByPrerequisite')
    }

    resolver = (fieldName, root, args, context, info) => {
        if (info.isLeaf) {
            if (root.hasOwnProperty(fieldName)) {
                return root[fieldName];
            } else {
                throw new Error(`Some of the leaf data requested in the query is not in the cache ${fieldName}`)
            }
        }
        if (fieldName === 'nodes') {
            return Object.values(root)
        }

        let conflict = this.keyConflict.get(fieldName)
        let fieldType = typeMap.get(fieldName);
        if(fieldType.endsWith('Connection')){
            let childType = typeMap.guessChildType(fieldType);
            let rootAccessor = childType
            if(conflict){
                rootAccessor = fieldName
            }
            let ids = root[rootAccessor];
            if(ids instanceof Object){
                if(!Array.isArray(ids)){
                    ids = Object.keys(ids)
                }
                let intersection = this.filterCacheByIds(childType, ids);
                if(args){
                    return this.filterCache(intersection, args)
                }
                return intersection;
            }
            return this.cache[childType][ids]
        }else{
            if(this.cache[fieldType][this.cache[fieldName]]){
                return this.cache[fieldType][this.cache[fieldName]]
            }
            if(conflict){
                return this.cache[fieldType][root[fieldName]]
            }else{
                return this.cache[fieldType][root[fieldType]]
            }
        }

    }

    checkFilter = (filter, value) => {
        let match = true;
        for (let key in filter) {
            let filterValue = filter[key]
            if (key === 'lessThanOrEqualTo') {
                match = match && new Date(filterValue).getTime() >= new Date(value).getTime();
            } else if (key === 'greaterThanOrEqualTo') {
                match = match && new Date(filterValue).getTime() <= new Date(value).getTime();
            }
        }
        return match
    }

    filterCacheByIds = (type, ids) => {
        return _.pickBy(this.cache[type], function(value, key) {
            return ids.includes(key)
        });
    }

    filterCache = (set, args) => {
        let returnVal = set;
        if (args.condition) {
            returnVal = _.pickBy(returnVal, function(value, key) {
                let match = true;
                for (let k in args.condition) {
                    if (value[k] !== args.condition[k]) {
                        match = false;
                    }
                }
                return match;
            });
        }
        if (args.filter) {
            returnVal = _.pickBy(returnVal, function(value, key) {
                let match = true;
                for (let k in args.filter) {
                    if (value[k]) {
                        if (!this.checkFilter(args.filter[k], value[k])) {
                            match = false;
                        }
                    }
                }
                return match;
            })
        }
        return returnVal
    }

    merge = (oldObj, newObj) => {
        let customizer = customizer = (objValue, srcValue, key, object, source, stack) => {
            if (Array.isArray(objValue)) {
                return _.union(objValue, srcValue);
            }
        }
        return _.mergeWith(oldObj, newObj, customizer);
    }

    isLeaf = (obj) => {
        for (let key in obj) {
            if (obj[key] instanceof Object) {
                return false;
            }
        }
        return true;
    }

    getChildType = (obj) => {
        if (Array.isArray(obj)) {
            if (obj.length > 0) {
                return obj[0]['__typename']
            }
        } else {
            return typeMap.guessChildType(obj['__typename'])
        }
    }

    formatObject = (object, isRoot, parentObject) => {
        if (object['__typename'].endsWith('Payload') || object['__typename'] === 'query') {
            for (let key in object) {
                let value = object[key]
                if (key !== '__typename') {
                    if (value instanceof Object) {
                        this.formatObject(value)
                    }
                }
            }
            return;
        }

        if (this.isLeaf(object)) {
            if (isRoot) {
                this.cache[isRoot] = object[UID]
            }
            let clone = _.cloneDeep(object)
            if(parentObject){
                    let temp = clone[parentObject.type]
                    if(temp){
                        if(Array.isArray(temp)){
                            clone[parentObject.type] = [...temp, parentObject.uid]
                        }else{
                            clone[parentObject.type] = [temp, parentObject.uid]
                        }
                    }else{
                        clone[parentObject.type] = parentObject.uid
                    }
                }
            this.updateCacheValue(clone)
            return object[UID]
        }

        if (object['__typename'].endsWith('Connection')) {
            if (parentObject) {
                parentObject['uid'] = parentObject['uid'][0]
            }
            if (object.nodes) {
                return object.nodes.map((obj) => {
                    this.formatObject(obj, false, parentObject)
                    return obj[UID]
                })
            } else if (object.edges) {
                return object.edges.map((obj) => {
                    this.formatObject(obj.node, false, parentObject)
                    return obj.node[UID]
                })
            }
        }
        let clone = _.cloneDeep(object);
        if(parentObject){
                let temp = clone[parentObject.type]
                if(temp){
                    if(Array.isArray(temp)){
                        clone[parentObject.type] = [...temp, parentObject.uid]
                    }else{
                        clone[parentObject.type] = [temp, parentObject.uid]
                    }
                }else{
                    clone[parentObject.type] = parentObject.uid
                }
            }
        let type = clone['__typename']
        for(let key in object){
            if(key === '__typename'){
                continue
            }
            let value = object[key];
            if(value instanceof Object){
                let conflict = this.keyConflict.get(key);
                if(conflict){
                    clone[key] = this.formatObject(value, false, {type:conflict, uid:[clone[UID]]})
                }else{
                    clone[this.getChildType(value)] = this.formatObject(value, false, {type:type, uid:[clone[UID]]})
                    delete clone[key]
                }
            }
        }
        this.updateCacheValue(clone)
        return clone[UID]
    }

    updateCacheValue = (obj) => {
        let typename = obj['__typename']
        if (!this.cache[typename]) {
            this.cache[typename] = {}
        }
        let cacheVal = this.cache[typename][obj[UID]]
        if (cacheVal) {
            if (!_.isEqual(cacheVal, obj)) {
                CacheEmitter.changeType(typename)
                this.cache[typename][obj[UID]] = this.merge(cacheVal, obj)
            }
        } else {
            CacheEmitter.changeType(typename)
            this.cache[typename][obj[UID]] = obj;
        }
    }



    removeObject = (obj) => {
        let objType = obj['__typename']
        let objUID = obj[UID]
        CacheEmitter.changeType(objType)
        delete this.cache[objType][objUID]
        for(let key in obj){
            let value = obj[key]
            if(value instanceof Object){
                let type = value['__typename']
                let uid = value[UID];
                let conflict = this.keyConflict.get(key)
                CacheEmitter.changeType(type)
                if(conflict){
                    this.cache[type][uid][conflict] = this.cache[type][uid][conflict].filter(id=>id!=objUID)
                }else{
                    this.cache[type][uid][objType]= this.cache[type][uid][objType].filter(id=>id!=objUID)
                }
            }
        }
    }

    remove = (queryResult) => {
        for(let key in queryResult){
            if(key === '__typename'){
                continue
            }
            let value = queryResult[key]
            if(value['__typename'].startsWith('Delete') || value['__typename'].startsWith('Remove') ){
                for(let k in value){
                    if(k === '__typename'){
                        continue
                    }
                    this.removeObject(value[k])
                }
            }else if(value['__typename'].startsWith('Create') || value['__typename'].startsWith('Make')){
                for(let k in value){
                    if(k === '__typename'){
                        continue
                    }
                    this.formatObject(value[k])
                }
            }
        }
        CacheEmitter.emitCacheUpdate();
    }

    processIntoCache = (queryResult) => {
        let result = _.cloneDeep(queryResult)
        for (let key in result) {
            if (key !== '__typename') {
                this.formatObject(result[key], key)
            }
        }
        //console.log('emitting cache update')
        //console.log(this.cache)
        CacheEmitter.emitCacheUpdate();
    }

    loadQuery = (query) => {
        try {
            return graphql(this.resolver, gql `${query}`, this.cache)
        } catch (error) {
            return {
                error: error.message
            }
        }
    }

    clearCache = () => {
        this.cache = {};
    }
}

export default new Cache();
