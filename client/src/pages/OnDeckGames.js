import React from 'react'
import Navbar from '../components/Navbar'
import TomorrowsGames from '../components/OnDeckGames'

export default function TomorrowGames() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <TomorrowsGames />
            </div>
        </div>
    )
}