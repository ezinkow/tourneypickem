import React from 'react'

import {
    Link
} from "react-router-dom";

export default function HomeNavbar() {

    return (
        <div className="container homeNavBar">
            <div className="row">
                <div className="navbar">
                    <div className="col-4 navbar2">
                        <Link to='/'><h3>Home</h3></Link>
                    </div>
                    <div className="col-4 navbar2">
                    </div>
                    <div className="col-4 navbar2">
                        <Link to='/statement'><h3>New Ridiculous Shit She Said</h3></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}