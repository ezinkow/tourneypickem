import React from 'react'
import banner from '../images/banner.jpg'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <div className="header" style={{ backgroundImage: `url(${banner})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
            <div className="navbar">
                <div className='container'>
                    <div className="col-1 navtext">
                        <Link to='/'><h5>Home</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/picksam'><h5>Todays Picks AM</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/pickspm'><h5>Todays Picks PM</h5></Link>
                    </div>
                    {/* <div className="col-1 navtext">
                        <Link to='/tomorrowsgames'><h5>On Deck</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/twodaysout'><h5>In The Hole</h5></Link>
                    </div> */}
                    <div className="col-1 navtext">
                        <Link to='/standings'><h5>Standings</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/picksdisplay'><h5>Group Picks</h5></Link>
                    </div>
                </div>
                <br />
            </div>
        </div>
    )
}