import React from 'react'
import logo from '../images/logo.png'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <>
            <div className="header">
                <div className="navbar">
                    <div className="col-1 logoImg">
                        <img src={logo} alt='logo' className='logoImg' />
                    </div>
                    <div className="col-3 navtext">
                        <Link to='/'><h4>Home</h4></Link>
                    </div>
                    <div className="col-2 navtext">
                        <Link to='/birkat'><h4>Birkat Hamazon</h4></Link>
                    </div>
                    <div className="col-3 navtext">
                        <Link to='/comment'><h4>Leave a Comment!</h4></Link>
                    </div>
                    <div className="col-3 navtext">
                        <Link to='/comments'><h4>Comments</h4></Link>
                    </div>
                    <div className="col-3">
                    </div>
                    <h3 className='mazel'>MAZEL TOV AMIR AND DANA!!!</h3>
                    <div className="col-3">
                    </div>
                </div>
            </div>
        </>
    )
}