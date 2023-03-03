import React from 'react'
import Navbar from '../components/Navbar'
import Picks from '../components/Picks'

export default function TodaysPicks() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <Picks />
            </div>
        </div>
    )
}