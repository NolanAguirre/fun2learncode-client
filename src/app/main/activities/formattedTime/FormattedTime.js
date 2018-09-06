import React from 'react';

function FormattedTime(props){
    return <div>{new Date(props.data.startTime).toDateString()}</div>;
}

export default FormattedTime;
