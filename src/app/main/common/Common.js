import React, { Component } from 'react'
import './Common.css'
import { ReactQuery } from '../../../delv/delv-react'
import Popup from "reactjs-popup"
import moment from 'moment';
import EventSystem from '../../EventSystem'
import DateTime from 'react-datetime'
import xicon from '../../logos/x-icon.svg'

const GET_USER_DATA = `{
    getUserData{
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
     name
    categoryByCategory{
       name
       id
     }
   }
 }
}`;

const localize = (timestamp) =>  moment(moment.utc(timestamp)).local()

function Location (props) {
  return (<div className='center-text margin-bottom-10'>
      <h3>{props.alias}</h3>
      <span>{props.street}, {props.city}, {props.state}</span>
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
    const eventTypes = props.allActivities.nodes.map((element) => {return {name: element.name + " (" + element.categoryByCategory.name + ")",value: element.id}});
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

    let dates = props.dates.nodes.map((date) => date.dateIntervalByDateInterval).sort((a,b)=>{return moment(a.start).unix() - moment(b.start).unix()})
    return<table className={props.className || ""}>
      <tbody>
        {dates.map((date, index) => {
          return <React.Fragment key={index}>
              <tr className='no-wrap-row'>
            <td>{localize(date.start).format(props.startFormat || "ddd MMM Do")}</td>
            <td>{localize(date.start).format(props.startFormat || "h:mma") + "-" + localize(date.end).format(props.startFormat || "h:mma")}</td>
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
            children.push(<div className={`${props.fillerStyle} filler`|| 'grid-filler'} key={children.length}></div>)
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
        if(this.props.default){
            this.state = {selected:[this.props.default]}
        }else{
            this.state = {selected:[]}
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state != nextState || this.props.items != nextProps.items){
            return true
        }
        return false
    }

    toggle = async (newItem) =>{ // if props selected students returns false or nothing it updates
        if(this.state.selected.filter((item)=>{return item.id===newItem.id}).length === 1){
            if(this.props.alwaysSelect){
                const newSelected = this.state.selected.filter((item)=>{return item.id!==newItem.id})
                if(newSelected.length === 0){
                    return;
                }
                if(this.props.multiSelect){
                    this.props.setSelected(newSelected)
                }else{
                    this.props.setSelected(null)
                }
                this.setState({selected:newSelected})
            }else{
                const newSelected = this.state.selected.filter((item)=>{return item.id!==newItem.id})
                if(this.props.multiSelect){
                    this.props.setSelected(newSelected)
                }else{
                    this.props.setSelected(null)
                }
                this.setState({selected:newSelected})
            }
        }else{
            if(!this.props.isValidChoice || await this.props.isValidChoice(newItem)){
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
        const recentValue = EventSystem.recentValues.get(this.propName);
        if(recentValue){
            this.state = {[this.propName]:recentValue}
        }else{
            this.state={[this.propName]:props.defaultVal|| {}}
        }
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
        const {propName, children, defaultVal, ...otherProps} = this.props
        return React.cloneElement(this.props.children, {[this.propName]:this.state[this.propName], [`emit${this.capitalize(this.propName)}`]:this.emitEvent, ...otherProps});
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
			<Popup className={this.props.className || 'popup'} closeOnDocumentClick={false} open={this.state.showPopup} onClose={this.clearPopupState}>
                <div className='popup-inner'>
                    <div className='close-popup'>
                        <img onClick={this.clearPopupState} src={xicon}/>
                    </div>
                    {this.props.children[0]}
                </div>
			</Popup>
            <div className={this.props.buttonClassName || ''} onClick={this.showPopup}>{this.props.children[1]}</div>
		</React.Fragment>
	}
}
export { BasicPopup }

function ArchiveOption(props){
    return <div className={props.className} onClick={()=>props.onClick(props.item)}>
        {props.item.name}
    </div>
}

class ArchiveOptions extends Component{
    constructor(props){
        super(props);
        this.state = {
            archive: 'archive: false,'
        }
        this.options = [
            {
                id:1,
                name:'Active',
                archive:'archive: false,'
            },{
                id:2,
                name:'Archive',
                archive:'archive: true,'
            }
        ]
    }

    componentDidMount = () => {
        this.setSelectedOption(this.options[0])
    }

    setSelectedOption = (option) => {
        this.setState({archive:option.archive});
    }

    render = () => {
        return <React.Fragment>
            <div className='margin-top-10'>
                <h4 className='no-margin center-text'>{this.props.label}</h4>
                <div className={this.props.className || 'archive-options-container'}>
                    <MultiSelect items={this.options} setSelected={this.setSelectedOption} default={this.options[0]} alwaysSelect>
                        <Selectable className={{selected:'selected-archive-option-btn archive-option-btn', base: 'archive-option-btn'}}>
                            <ArchiveOption />
                        </Selectable>
                    </MultiSelect>
                </div>
            </div>
            {React.cloneElement(this.props.children, {query:this.props.query(this.state.archive)})}
        </React.Fragment>
    }
}


export { ArchiveOptions }

class TimeRangeSelector extends Component{
    constructor(props){
        super(props)
        this.state = {
            start:moment().add(1, 'months'),
            past: 2
        }
    }
    handleTimeChange = (key, value) => {
        this.setState({[key]: value})
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox'
            ? target.checked
            : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    render = () => {
        return <React.Fragment>
        <div className='time-range-selector'>
            Start &nbsp;
            <DateTime className="time-range-time" dateFormat="MMMM YYYY" timeFormat={false} value={this.state.start} onChange={(time) =>{this.handleTimeChange("start", time)}}/> &nbsp;
            Past &nbsp; <input className="time-range-month" name={"past"} value={this.state.past} onChange={this.handleChange}/>&nbsp; Months
        </div>
        {React.cloneElement(this.props.children, {query:this.props.query(moment(this.state.start).subtract(this.state.past, 'months').endOf('month').toISOString(),
            moment(this.state.start).endOf('month').toISOString())})}
    </React.Fragment>
    }
}


export { TimeRangeSelector }

function RoutePopup (WrappedComponent){
    return class extends Component {
        constructor(props){
            super(props);
            this.state = {}
        }
        openPopup = (component) => {
            this.setState({showPopup:true, popupInner:component})
        }
        closePopup = () => {
            this.setState({showPopup:false})
        }
        preventClose = () => {
            this.preventClose = true
        }
        allowClose = () => {}
        render = () => {
            const popupProps = {
                open:this.openPopup,
                close:this.closePopup
            }
            return <React.Fragment>
            <Popup className={'popup'} open={this.state.showPopup} onClose={this.closePopup}>
                <div className="popup-inner">
                    <div className='close-popup'>
                        <img onClick={this.closePopup} src={xicon}/>
                    </div>
                    {this.state.popupInner}
                </div>
			</Popup>
            <WrappedComponent popup={popupProps} {...this.props}/>
            </React.Fragment>
        }
    }
}
export {RoutePopup}
