import React from 'react'
import Navbar from '../components/Navbar'
import EarlyAMPicks from '../components/PicksAMA'

export default function TodaysPicksAm() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <EarlyAMPicks />
            </div>
        </div>
    )
}