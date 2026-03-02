import React from 'react'
import Navbar from '../components/Navbar'
import Picks from '../components/Picks'

export default function Games() {


    return (
        <div>
            <Navbar />
            <div className='=container page-content'>
                <Picks />
            </div>
        </div>
    )
}