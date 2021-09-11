import React from "react"
import basket from '../images/appleBasket.png'

export default function Header() {


    return (
        <div className="header container">
            <h1><img src={basket} alt="Apple Basket" className="basketImg" />Make A Wish For The New Year 5782<img src={basket} alt="Apple Basket" className="basketImg" /></h1>
        </div>
    )
}