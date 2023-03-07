import React from 'react'
import Navbar from '../components/Navbar'
import TodaysPicks from '../components/Picks'

export default function TodaysPicksAm() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <TodaysPicks />
            </div>
        </div>
    )
}