import React from "react"
import abba from '../images/abba.png'

export default function Header() {


    return (
        <div className="header">
            <h1>Ask This Dad <img src={abba} alt="dad" className="dadImage" /></h1>
        </div>
    )
}