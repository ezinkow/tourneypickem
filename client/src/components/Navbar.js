import React from 'react'
import logo from '../images/logo.png'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        // <div className="container navibar">
        <div className="header">
            <div className="navbar">
                <div className="col-1 logoImg">
                    <img src={logo} alt='logo' className='logoImg' />
                </div>
                <div className="col-3 navtext">
                   <Link to='/birkat'><h3>Birkat Hamazon</h3></Link>
                </div>
                <div className="col-4 navtext">
                    <Link to='/comment'><h3>Leave a Comment!</h3></Link>
                </div>
                <div className="col-3 navtext">
                    <Link to='/comments'><h3>Comments</h3></Link>
                </div>
                <div className="col-1 logoImg">
                    <img src={logo} alt='logo' className='logoImg' />
                </div>
            </div>
        </div>
        // </div>
    )
}