const gql = require('graphql-tag')
const util = require('util');
const axios = require('axios')
const cache = require('./Cache')
import graphql from 'graphql-anywhere'
import Delv from './j-delv'
var fs = require('fs');
var _ = require('lodash');

let delv = new Delv('http://localhost:3005/graphql');
setTimeout(test, 1000)
// setTimeout(test2, 2000)
// setTimeout(test3, 3000)
const query = `{
  allActivityCatagories{
    nodes{
      name
      nodeId
      activitiesByType{
        nodes{
          nodeId
          name
          description
          eventsByEventType{
            nodes{
              nodeId
              id
              dateGroupsByEvent{
                nodes{
                  nodeId
                  price
                  openRegistration
                  closeRegistration
                }
              }
            }
          }
          activityCatagoryByType{
            nodeId
            name
          }
        }
      }
    }
  }
}`

const query2 = `{
  allActivityCatagories{
    nodes{
      id
      nodeId
    }
  }
}`

const query3 = `{
  allActivityCatagories{
    nodes{
      name
      id
      nodeId
      description
      activitiesByType{
        nodes{
          nodeId
          name
          description
          eventsByEventType{
            nodes{
              nodeId
              id
              dateGroupsByEvent{
                nodes{
                  nodeId
                  price
                  openRegistration
                  closeRegistration
                }
              }
            }
          }
          activityCatagoryByType{
            nodeId
            name
          }
        }
      }
    }
  }
}`

let types = []

const resolver = (fieldName, root, args, context, info) => {
    if(!info.isLeaf && fieldName != 'nodes'){
        types.push(cache.guessChildType(cache.fields.get(fieldName))
    }
    return {}
}
function test(){
    graphql(resolver, gql `${query}`, null)
    console.log(types)

}


//
// function test() {
//     delv.query(query, {
//         networkPolicy: 'cache-first',
//         resolve: (data) => {
//             const resolver = cache.resolver
//             fs.writeFile('query.json', JSON.stringify(data), 'utf8', (error) => {
//                 if (error) {
//                     console.log(error)
//                 }
//             });
//             const cacheResult = graphql(resolver, gql `${query}`, null)
//             console.log(_.isEqual(data, cacheResult))
//             fs.writeFile('example.json', JSON.stringify(cacheResult), 'utf8', (error) => {
//                 if (error) {
//                     console.log(error)
//                 }
//             });
//         }
//     })
// }
//
// function test2() {
//     delv.query(
//         query3, {
//             networkPolicy: 'cache-first',
//             resolve: (data) => {
//                 const resolver = cache.resolver
//                 fs.writeFile('query.json', JSON.stringify(data), 'utf8', (error) => {
//                     if (error) {
//                         console.log(error)
//                     }
//                 });
//                 const cacheResult = graphql(resolver, gql `${query3}`, null)
//                 console.log(_.isEqual(data, cacheResult))
//                 fs.writeFile('example.json', JSON.stringify(cacheResult), 'utf8', (error) => {
//                     if (error) {
//                         console.log(error)
//                     }
//                 });
//             }
//         })
// }
//
// function test3() {
//     delv.query(
//         query2,
//         {
//             networkPolicy: 'cache-first',
//             resolve: (data) => {
//                 const resolver = cache.resolver
//                 fs.writeFile('query.json', JSON.stringify(data), 'utf8', (error) => {
//                     if (error) {
//                         console.log(error)
//                     }
//                 });
//                 const cacheResult = graphql(resolver, gql `${query2}`, null)
//                 console.log(_.isEqual(data, cacheResult))
//                 fs.writeFile('example.json', JSON.stringify(cacheResult), 'utf8', (error) => {
//                     if (error) {
//                         console.log(error)
//                     }
//                 });
//             }
//         }
//     )
// }
