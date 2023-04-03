import React from 'react'
import Navbar from '../components/Navbar'
import PicksToday from '../components/PicksToday'
import PicksTiebreaker from '../components/PicksTiebreaker'

export default function TodaysPicks() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <PicksTiebreaker />
            </div>
        </div>
    )
}