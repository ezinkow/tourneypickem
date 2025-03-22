import React from 'react'
import banner from '../images/banner.png'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <div className="header" style={{ backgroundImage: `url(${banner})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <div className="navbar">
                <div className='container navitext'>
                    <div className="col-1 navtext">
                        <Link to='/'><h5>Home</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/pickstoday'><h5>Todays Picks</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/pickstomorrow'><h5>Tomorrows Picks</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/standings'><h5>Standings</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/picksdisplay'><h5>Group Picks</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/gameresults'><h5>Game Results</h5></Link>
                    </div>
                </div>
                <br />
            </div>
        </div>
    )
}