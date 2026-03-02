import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import CountdownDisplay from '../components/CountdownDisplay'
import Button from 'react-bootstrap/esm/Button'


export default function Home() {


    return (
        <div>
            <Navbar />
            <CountdownDisplay />
            <div className='container'>
                <Button type="submit" variant="success">
                    <a to="/signup">Sign UP</a>
                </Button><br></br>
                The game:<br></br>
                Runs from March 7 - March 15<br></br>
                Pick every conference tournament game <strong><u>against the spread</u></strong> from the following conferences: <br></br>
                A10<br></br>
                American<br></br>
                ACC<br></br>
                Big East<br></br>
                Big 10<br></br>
                Big 12<br></br>
                Conference USA<br></br>
                Mountain West<br></br>
                SEC<br></br>
                <strong>AND ALL </strong>conference championship games between March 7th and 15th.
                <br></br>
                Games lock at scheduled tip-off time.<br></br>
                Lines lock one hour before scheduled tip-off time.<br></br>
                No matter what the line is when pick is submitted, the final, closed locked line will be the line everyone is using
                <br></br>
                <Link to="/picks"><h3>Make Picks</h3></Link>
                <br></br>
                <br></br>
                <h5>Conference Tournament Schedules:</h5>
                <a href='https://www.ncaa.com/news/basketball-men/article/2025-02-12/2025-ncaa-conference-tournaments-schedules-brackets-scores-auto-bids' target="_blank">FULL LIST OF CONFERENCE TOURNAMENTS</a>
            </div>
        </div>
    )
}