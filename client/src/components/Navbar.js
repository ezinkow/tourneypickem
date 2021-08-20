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
                        <a href='/ask'><img src={ask} className="headerFonts" alt='ask!' /></a>
                    </div>
                    <div className="col-3">
                        <a href='/testimonials'><img src={testimonials} className="headerFonts" alt='testimonials' /></a>
                    </div>
                    <div className="col-2 logoImage">
                        <a href='/'><img className="askthisdadlogo" src={askthisdad} alt='askthisdad' /></a>
                    </div>
                    <div className="col-2">
                        <a href='/about'><img src={about} className="headerFonts" alt='askthisdad' /></a>
                    </div>
                    <div className="col-3">
                        <a href='/answered'><img src={answered} className="headerFonts" alt='askthisdad' /></a>
                    </div>
                </div>
            </div>
        </div>
    )
}