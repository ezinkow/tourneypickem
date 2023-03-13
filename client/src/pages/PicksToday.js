import React from 'react'
import Navbar from '../components/Navbar'
import PicksToday from '../components/PicksToday'

export default function TodaysPicks() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <PicksToday />
            </div>
        </div>
    )
}