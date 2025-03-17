import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'


export default function Home() {


    return (
        <div>
            <Navbar />
            <div className='container'>
                The game:<br></br>
                Runs from March 18 (FIRST FOUR) - April 7<br></br>
                Pick tournament game <u>against the spread</u> from the First Four through the Championship.<br></br>
                Each round, points increase by 1:<br></br>
                First Four and First Round: 1 point<br></br>
                Second Round: 2 points<br></br>
                Sweet 16: 3 points<br></br>
                Elite 8: 4 points<br></br>
                Final Four: 5 points<br></br>
                Championship: 6 points<br></br>
                <br></br>
                <Link to="/pickstoday"><h3>Make Today's Picks</h3></Link>
                <Link to="/pickstomorrow"><h3>See/Make Tomorrow's Picks</h3></Link>
                <br></br>
                <br></br>

                <a href='https://www.ncaa.com/scoreboard/basketball-men/d1' target="_blank"><h5>Scores</h5></a>
            </div>
        </div>
    )
}