import React from 'react'
import banner from '../images/banner.jpg'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <div className="header" style={{
            backgroundImage: `url(${banner})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center'
        }}>
            <div className="navbar">
                <div className='container'>
                    <div className="col-1 navtext">
                        <Link to='/'><h5>Home</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/picks'><h5>Make Your Picks</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/mypicks'><h5>My Picks</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/scoreboard'><h5>Scoreboard</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/standings'><h5>Standings</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/picksdisplay'><h5>Group Picks</h5></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/signup'><h5>Sign Up Here</h5></Link>
                    </div>
                </div>
                <br />
            </div>
        </div>
    )
}