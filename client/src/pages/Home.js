import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import CountdownDisplay from '../components/CountdownDisplay'
import Button from 'react-bootstrap/esm/Button'

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="page-content">   {/* ← ADD THIS */}
                <CountdownDisplay />
                <div className='container'>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <Button variant="success" size="lg">
                            Sign Up Here
                        </Button>
                    </Link>
                    <br /><br />
                    <strong>The game:</strong><br />
                    Runs from March 7 - March 15<br />
                    Pick every conference tournament game <strong><u>against the spread</u></strong> from the following conferences: <br />
                    <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: '10px' }}>
                        <li>A10</li>
                        <li>American</li>
                        <li>ACC</li>
                        <li>Big East</li>
                        <li>Big 10</li>
                        <li>Big 12</li>
                        <li>Conference USA</li>
                        <li>Mountain West</li>
                        <li>SEC</li>
                    </ul>
                    <strong>AND ALL </strong>conference championship games between March 7th and 15th.
                    <br /><br />
                    Games lock at scheduled tip-off time.<br />
                    Lines lock one hour before scheduled tip-off time.<br />
                    No matter what the line is when pick is submitted, the final, closed locked line will be the line everyone is using.
                    <br /><br />
                    <Link to="/picks"><h3>🏀 Make Your Picks</h3></Link>
                    <br />
                    <h5>Conference Tournament Schedules:</h5>
                    <a href='https://www.ncaa.com/news/basketball-men/article/2026-02-11/tracking-31-ncaa-mens-basketball-conference-tournaments-auto-bids-2026-march' target="_blank" rel="noreferrer">
                        FULL LIST OF CONFERENCE TOURNAMENTS
                    </a>
                </div>
            </div>
        </div>
    )
}