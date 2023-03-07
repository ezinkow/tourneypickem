import React from 'react'
import Navbar from '../components/Navbar'
import TodaysPicksP from '../components/TodaysPicksPm'

export default function TodaysPicksPm() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <TodaysPicksP />
            </div>
        </div>
    )
}