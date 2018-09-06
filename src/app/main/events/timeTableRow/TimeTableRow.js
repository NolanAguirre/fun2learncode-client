import React from 'react';

function TimeTableRow(props){
    function formatHours(date){
        let temp = "";
        temp += (date.getHours() % 12 == 0)? 12 : date.getHours() % 12;
        temp += (date.getMinutes() < 10)? ":0" + date.getMinutes() : ":" + date.getMinutes();
        temp += (date.getHours() > 12)? " pm" : " am"
        return temp;
    }
    let startDate = new Date(props.data.startTime)
    return (<tr>
        <td>{startDate.toDateString()}</td>
        <td>{formatHours(startDate)}</td>
    </tr>);
}

export default TimeTableRow;
