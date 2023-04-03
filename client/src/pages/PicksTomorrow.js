import React from 'react'
import Navbar from '../components/Navbar'
import PicksTomorrow from '../components/PicksTomorrow'
import PicksTiebreaker from '../components/PicksTiebreaker'

export default function TomorrowPicks() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <PicksTomorrow />
            </div>
        </div>
    )
}