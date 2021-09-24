import React from 'react'

import {
    Link
} from "react-router-dom";

export default function Navbar() {

    return (
        <div className="container">
            <div className="row">
                <div className="navbar">
                    <div className="col-6">
                        <Link to='/'><h3>Home</h3></Link>
                    </div>
                    <div className="col-6">
                        <Link to='/post'><h3>New Post</h3></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}