import React from 'react'
import ask from '../images/askbutton.png'
import testimonials from '../images/testimonialsbutton.png'
import askthisdad from '../images/askthisdad.png'
import about from '../images/aboutbutton.png'
import answered from '../images/answeredbutton.png'
import {
    Link
} from "react-router-dom";

export default function HomeNavbar() {

    return (
        <div className="container homeNavBar">
            <div className="row">
                <div className="navbar">
                    <div className="col-2">
                        <Link to='/ask'><img src={ask} className="headerFonts" alt='ask!' /></Link>
                    </div>
                    <div className="col-3">
                        <Link to='/testimonials'><img src={testimonials} className="headerFonts" alt='testimonials' /></Link>
                    </div>
                    <div className="col-2 logoImage">
                        <Link to='/'><img className="askthisdadlogo" src={askthisdad} alt='askthisdad' /></Link>
                    </div>
                    <div className="col-2">
                        <Link to='/about'><img src={about} className="headerFonts" alt='askthisdad' /></Link>
                    </div>
                    <div className="col-3">
                        <Link to='/answered'><img src={answered} className="headerFonts" alt='askthisdad' /></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}