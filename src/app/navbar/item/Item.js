import React from 'react';
import './Item.css'
import { Link } from "react-router-dom";

function Item(props) {
    return <Link to={`/${props.route}`}><div className="nav-bar-item">{props.name}</div></Link>

}

export default Item;
