import React from 'react'
import Navbar from '../components/Navbar'
import TwoDaysOutGames from '../components/InTheHoleGames'

export default function TwoDaysOut() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <TwoDaysOutGames />
            </div>
        </div>
    )
}