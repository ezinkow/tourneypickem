import React from 'react'
import banner from '../images/banner.jpg'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <div className="header" style={{backgroundImage:`url(${banner})`, backgroundRepeat:'no-repeat', backgroundSize:'cover'}}>
            <div className="navbar">
                <div className='container'>
                    <div className="col-3 navtext">
                        <Link to='/'><h3>Home</h3></Link>
                    </div>
                    <div className="col-3 navtext">
                        <Link to='/todayspicks'><h3>Todays Picks</h3></Link>
                    </div>   
                    <div className="col-3 navtext">
                        <Link to='/tomorrowsgames'><h3>Tomorrows Games</h3></Link>
                    </div>   
                    <div className="col-3 navtext">
                        <Link to='/twodaysout'><h3>In Two Days Games</h3></Link>
                    </div>   
                </div>
                <br />
            </div>
        </div>
    )
}