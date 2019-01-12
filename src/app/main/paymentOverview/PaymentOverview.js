import React, { Component } from 'react'
import './PaymentOverview.css'

function PaymentOverviewRow(props){
    return <tr>
            <td>{props.student}</td>
            <td>{props.name}</td>
            <td>{props.price}$</td>
        </tr>
}


function PaymentOverview(props){
    const {dateGroup, addons, students} = props
    let rows = [];
    let total = 0;
    let rowCount =0;
    students.forEach((student) => {
        rowCount++;
        rows.push(<PaymentOverviewRow key={rowCount} type={'Event'} name={dateGroup.name} student={student.firstName + " " + student.lastName} price={dateGroup.price} />)
        total+= dateGroup.price
        addons.forEach((addon)=>{
            rowCount++;
            total+= addon.price
            rows.push(<PaymentOverviewRow key={rowCount} type={'Add-on'} name={addon.name} student={student.firstName + " " + student.lastName} price={addon.price} />)
        })
    })

    return <div className='payment-overview-container'>
        <h3>Payment Summery</h3>
             <table className='responsive-table custom-scrollbar'>
             <thead>
             <tr>
             <th>Student</th>
             <th>Item</th>
             <th>Price</th>
             </tr>
             </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        <span>Total: {total}$</span>
    </div>
}

export default PaymentOverview
