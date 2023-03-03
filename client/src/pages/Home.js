import React from 'react'
import Navbar from '../components/Navbar'
import HomeImage from '../components/HomeImage'


export default function Home() {


    return (
        <div>
            <Navbar />
            <div className='container'>
                <h3>Check out the google doc for your picks results:</h3>
                <a href='https://docs.google.com/spreadsheets/d/1-i2MnFezvP7qIwiB6mRolqyz23JB7VOUEpbhhkXDF24/edit?usp=sharing' target="_blank">https://docs.google.com/spreadsheets/d/1-i2MnFezvP7qIwiB6mRolqyz23JB7VOUEpbhhkXDF24/edit?usp=sharing</a>
                <br></br>
                <br></br>
                <h5>Conference Tournament Schedules:</h5>
                <a href='https://www.ncaa.com/news/basketball-men/article/2023-02-14/2023-ncaa-conference-tournaments-schedules-brackets-scores-auto-bids' target="_blank">FULL LIST OF CONFERENCE TOURNAMENTS</a>
            </div>
        </div>
    )
}