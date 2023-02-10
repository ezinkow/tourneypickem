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
                    <div className="col-1 navtext">
                        <Link to='/'><p>Home</p></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/birkat'><p>Birkat Hamazon</p></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/comment'><p>Leave a Comment!</p></Link>
                    </div>
                    <div className="col-1 navtext">
                        <Link to='/comments'><p>Comments</p></Link>
                    </div>
                    <br />
                    <div className="col-3">
                    </div>
                    <div className="col-6">
                    <h3 className='mazel'>MAZEL TOV AMIR AND DANA!!!</h3>
                    </div>
                    <div className="col-3">
                    </div>
                </div>
            </div>
        </>
    )
}