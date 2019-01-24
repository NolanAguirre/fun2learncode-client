import React, { Component } from 'react'
import './Common.css'
import { ReactQuery } from '../../../delv/delv-react'
import Popup from "reactjs-popup"
import moment from 'moment';
import EventSystem from '../../EventSystem'
const GET_USER_DATA = `{
    getUserData{
        nodeId
        id
        firstName
        lastName
        email
        createdOn
        role
    }
}`

const GET_ACTIVITIES = `{
  allActivities {
   nodes {
     id
     nodeId
     name
     activityCatagoryByType{
       name
       id
       nodeId
     }
   }
 }
}`;

function Location (props) {
  return (<div className='location'>
    <div>
      <h3>{props.alias}</h3>
      <div>{props.street}, {props.city} {props.state}</div>
    </div>
    <div className='maps-container'>
        <iframe width='400' height='300' id={props.id} src='https://maps.google.com/maps?q=fun2learncode&t=&z=13&ie=UTF8&iwloc=&output=embed' frameBorder='0' scrolling='no' marginHeight='0' marginWidth='0' />
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

function EventDropDownInner(props) {
    const eventTypes = props.allActivities.nodes.map((element) => {return {name: element.name + " (" + element.activityCatagoryByType.name + ")",value: element.id}});
    return <DropDown name={props.name} value={props.value} options={eventTypes} onChange={props.onChange}></DropDown>
}

export {EventDropDownInner}

function EventDropDown(props){
    return <ReactQuery query={GET_ACTIVITIES}>
        <EventDropDownInner {...props}/>
    </ReactQuery>
}

export {EventDropDown}

function SecureRouteInner(props){
    if(props.getUserData && props.roles.includes(props.getUserData.role)){
        if(props.ignoreResult){
            return props.children
        }
        return React.Children.map(props.children, (child)=>React.cloneElement(child, {getUserData:props.getUserData}))
    }else if(props.unauthorized){
        return React.cloneElement(props.unauthorized, {getUserData:props.getUserData})
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
              <tr className='no-wrap-row'>
            <td>{localizeUTCTimestamp(date.start).format(props.startFormat || "ddd MMM DD")}</td>
            <td>{localizeUTCTimestamp(date.start).format(props.startFormat || "h:mm a") + "-" + localizeUTCTimestamp(date.end).format(props.startFormat || "h:mm a")}</td>
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
            children.push(<div className={props.fillerStyle || 'grid-filler'} key={children.length}></div>)
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
        if(this.state != nextState || this.props.items != nextProps.items){
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
        return this.props.items.map((element) => {
          const selected = this.state.selected.filter((el)=>{return el.id === element.id}).length === 1
          return React.cloneElement(this.props.children, {key:element.id, selected, onClick:()=>{this.toggle(element)}, item:element})
        })
    }
}

export { MultiSelect }

function Selectable(props){
    const className = props.selected?props.className.selected:props.className.base
    return React.cloneElement(props.children, {className, key:props.key, onClick:props.onClick, item:props.item})
}

export {Selectable}

class CustomProvider extends Component{
    constructor(props){
        super(props);
        this.propName = `${props.propName}Provider`
        this.state={[this.propName]:props.default|| {}}
    }
    componentDidMount = () => {
        EventSystem.on(this.propName, this.handleEvent);
    }
    componentWillUnmount = () => {
        EventSystem.removeListener(this.propName, this.handleEvent)
    }
    capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
    }
    emitEvent = (data) => {
        if(data !== this.state[this.propName]){
            EventSystem.emit(this.propName, data)
        }
    }
    handleEvent = (args) => {
        this.setState({[this.propName]:args})
    }
    render = () => {
        return React.cloneElement(this.props.children, {[this.propName]:this.state[this.propName], [`emit${this.capitalize(this.propName)}`]:this.emitEvent});
    }
}

export { CustomProvider }

class BasicPopup extends Component{
	constructor(props){
		super(props)
		this.state = {
			showPopup:false
		}
	}
	showPopup = () => {
		this.setState({showPopup:true})
	}
	clearPopupState = () => {
		this.setState({showPopup:false})
	}
	render = () => {
		return <React.Fragment>
			<Popup open={this.state.showPopup} closeOnDocumentClick onClose={this.clearPopupState}>
                {this.props.children[0]}
			</Popup>
            <div className={this.props.buttonClassName || ''} onClick={this.showPopup}>{this.props.children[1]}</div>
		</React.Fragment>
	}
}

export { BasicPopup }
