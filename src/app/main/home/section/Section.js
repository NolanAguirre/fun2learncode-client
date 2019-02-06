import React, {Component} from 'react';
import './Section.css';

function Section(props){
        return (
        <div className="grid-item-container home-class-structure-container">
            <h2 className='center-text'>{props.name}</h2>
            <div className="container column">
                <div className="home-section">{props.description}</div>
            </div>
        </div>);
}

export default Section;
