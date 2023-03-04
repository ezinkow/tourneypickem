import React from 'react'
import Navbar from '../components/Navbar'
import TwoDaysOutGames from '../components/TwoDaysOutGames'

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