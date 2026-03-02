import React from 'react'
import Navbar from '../components/Navbar'
import Scoreboard from '../components/Scoreboard'

export default function Scores() {


    return (
        <div className="page-content">
            <Navbar />
            <div className='=container'>
                <Scoreboard />
            </div>
        </div>
    )
}