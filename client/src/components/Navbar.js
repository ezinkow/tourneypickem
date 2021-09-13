import React from 'react'
import apples from '../images/apples.png'

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
                        <img src={apples} alt='apples' className='applesImg'/>
                        <img src={apples} alt='apples' className='applesImg'/>
                        <img src={apples} alt='apples' className='applesImg'/>
                    </div>
                    <div className="col-4 navbar2">
                        <Link to='/wish'><h3>Make A New Year's Wish</h3></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}