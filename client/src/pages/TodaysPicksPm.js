import React from 'react'
import Navbar from '../components/Navbar'
import TodaysPicksPm from '../components/TodaysPicksPm'

export default function TodaysPicksP() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <TodaysPicksPm />
            </div>
        </div>
    )
}