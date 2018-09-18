import React, {Component} from 'react';

class EventLogs extends Component{
    render(){
        return (
            <div>
                {JSON.stringify(this.props)}
            </div>
        );
    }
}

export default EventLogs;
