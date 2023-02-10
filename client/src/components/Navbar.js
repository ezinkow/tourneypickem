import React from 'react'
import logo from '../images/logo.png'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <div className="header">
            <div className="navbar">
                <div className="col-1 logoImg">
                    <img src={logo} alt='logo' className='logoImg' />
                </div>
                <div className="col-3 navtext">
                   <Link to='/birkat'><p>Birkat Hamazon</p></Link>
                </div>
                <div className="col-4 navtext">
                    <Link to='/comment'><p>Leave a Comment!</p></Link>
                </div>
                <div className="col-3 navtext">
                    <Link to='/comments'><p>Comments</p></Link>
                </div>
                <div className="col-1 logoImg">
                    <img src={logo} alt='logo' className='logoImg' />
                </div>
            </div>
        </div>
    )
}