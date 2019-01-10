import React, { Component } from 'react'
import './Common.css'
import { ReactQuery } from '../../../delv/delv-react'
import gql from 'graphql-tag'
import moment from 'moment';

const GET_USER_DATA = `{
    getUserData{
        nodeId
        id
        firstName
        lastName
        role
    }
}`

function Location (props) {
  return (<div className='location'>
    <div>
      <h3>{props.alias}</h3>
      <div>{props.street}, {props.city} {props.state}</div>
    </div>
    <div><iframe width='400' height='300' id={props.id} src='https://maps.google.com/maps?q=fun2learncode&t=&z=13&ie=UTF8&iwloc=&output=embed' frameBorder='0' scrolling='no' marginHeight='0' marginWidth='0' />
    </div>
  </div>)
}
export { Location }

function DropDown (props) {
  return (
    <select name={props.name} value={props.value} onChange={props.onChange}>
      <option value={undefined}>None</option>
      {props.options.map((element) => {
        return <option key={element.value} value={element.value}>{element.name}</option>
      })}
    </select>)
}
export { DropDown }

function SecureRouteInner(props){
    if(props.queryResult.getUserData && props.roles.includes(props.queryResult.getUserData.role)){
        if(props.ignoreResult){
            return props.children
        }
        return React.Children.map(props.children, (child)=>React.cloneElement(child, {queryResult:props.queryResult}))
    }else if(props.unauthorized){
        return React.cloneElement(props.unauthorized, {queryResult:props.queryResult})
    }
    return <div>please login</div>
}

function SecureRoute(props){
    return <ReactQuery query={GET_USER_DATA}>
        <SecureRouteInner ignoreResult={props.ignoreResult} roles={props.roles} unauthorized={props.unauthorized}>{props.children}</SecureRouteInner>
    </ReactQuery>

}
export { SecureRoute }

function DatesTable(props){
    function localizeUTCTimestamp(timestamp){
        return moment(moment.utc(timestamp)).local()
    }
    let dates = props.dates.nodes.map((date) => date.dateIntervalByDateInterval).sort((a,b)=>{return moment(a.start).unix() - moment(b.start).unix()})
    return<table className={props.className || ""}>
      <tbody>
        {dates.map((date, index) => {
          return <React.Fragment key={index}>
              <tr>
            <td>{localizeUTCTimestamp(date.start).format(props.startFormat || "ddd MMM DD")}</td>
            <td>{localizeUTCTimestamp(date.start).format(props.startFormat || "h:MM a") + "-" + localizeUTCTimestamp(date.end).format(props.startFormat || "h:MM a")}</td>
          </tr>
        </React.Fragment>
        })}
      </tbody>
    </table>
}

export {DatesTable}

function GridView (props){
    let itemsPerRow = props.itemsPerRow || 4
    let items = props.children.slice();
    let formatted = [];
    while(items.length){
        let children = items.splice(0,itemsPerRow)
        while(children.length < itemsPerRow){
            children.push(<div className={props.childStyle || 'grid-filler'} key={children.length}></div>)
        }
        formatted.push(<div className={props.rowStyle || "grid-view-row"} key={items.length}>{children}</div>)
    }
    return <div className={props.className || ""}>
        {formatted}
    </div>
}

export {GridView}


class MultiSelect extends Component {
    constructor(props){
        super(props)
        this.state = {selected:[]}
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state != nextState || this.props.queryResult != nextProps.queryResult){
            return true
        }
        return false
    }

    toggle = async (newItem) =>{ // if props selected students returns false or nothing it updates
        if(!this.props.isValidChoice || await this.props.isValidChoice(newItem)){
            if(this.state.selected.includes(newItem)){
                const newSelected= this.state.selected.filter((item)=>{return item.id!==newItem.id})
                if(this.props.multiSelect){
                    this.props.setSelected(newSelected)
                }else{
                    this.props.setSelected(null)
                }
                this.setState({selected:newSelected})
            }else{
                if(this.props.multiSelect){
                    this.props.setSelected([...this.state.selected, newItem])
                    this.setState({selected:[...this.state.selected, newItem]})
                }else{
                    this.props.setSelected(newItem)
                    this.setState({selected:[newItem]})
                }
            }
        }
    }

    render(){
        console.log(this.state.selected)
        return this.props.formatter(this.props.queryResult).map((element) => {
          const selected = this.state.selected.filter((el)=>{return el.id === element.id}).length === 1
          return React.cloneElement(this.props.children, {key:element.id, selected, onClick:this.toggle, item:element})
        })
    }
}

export { MultiSelect }
