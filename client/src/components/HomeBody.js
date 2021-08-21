import React from 'react'
import scam from '../images/scam.png'
import weirdmoles from '../images/weirdmoles.png'
import dad from '../images/dad.png'
import carissues from '../images/carissues.png'
import toilettrouble from '../images/toilettrouble.png'

export default function HomeBody() {

    return (
        <div className="container">
            <div className="row">
                <div className="col-4 homeLeft">
                    <img className="homeImages" src={scam} />
                    <img className="homeImages" src={weirdmoles} />
                </div>
                <div className="col-4 homeCenter">
                    <img className="dadImage" src={dad} />
                </div>
                <div className="col-4 homeRight">
                    <img className="homeImages" src={carissues} />
                    <img className="homeImages" src={toilettrouble} />
                </div>
            </div>
        </div>
    )
}