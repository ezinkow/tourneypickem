import React from 'react'
import Navbar from '../components/Navbar'
import Scoreboard from '../components/Scoreboard'
import RefreshGamesButton from '../components/RefreshGamesButton'

export default function Scores() {


    return (
        <div>
            <Navbar />
            <div className='=container'>
                <Scoreboard />
                <RefreshGamesButton />
            </div>
        </div>
    )
}