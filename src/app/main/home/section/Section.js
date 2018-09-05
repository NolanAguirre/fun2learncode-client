import React, {Component} from 'react';
import './Section.css';
function Section(props){
        return (
        <div className="home-section">
            <h3>{props.name}</h3>
            <div className="home-section-info">
                <img className="home-section-image" alt="Activity picture" src="https://via.placeholder.com/300x150"></img>
                <div className="home-section-text"><p>{props.description}</p>
                </div>
            </div>
        </div>);
}

export default Section;
