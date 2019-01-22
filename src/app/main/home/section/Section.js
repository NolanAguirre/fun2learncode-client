import React, {Component} from 'react';
import './Section.css';

function Section(props){
        return (
        <div className="styled-container column">
            <h2>{props.name}</h2>
            <div className="container">
                <div className="center-y">
                    <img className="home-section-image" alt="Activity picture" src="https://via.placeholder.com/300x150"></img>
                </div>
                <div className="section">{props.description}</div>
            </div>
        </div>);
}

export default Section;
