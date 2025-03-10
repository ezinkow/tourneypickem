
import React from 'react'

export default function Steps() {


    return (
        <div>
            <h3>Steps:</h3>
            <ul>
                <li>Select CORRECT name from drop down</li>
                <li>Make your picks</li>
                <li>Picks will show up in the table down below</li>
                <li>When ready, submit your picks. If you need to make a change, you can resubmit single picks/games. Most recent pick will be official pick</li>
                <li>Lines that are whole numbers will shift .5 in favor of the underdog (-5 moves to -5.5)</li>
                <li>Missed picks will default to underdog</li>
                {/* with a single point penalty (+3.5 will move to +2.5)</li> */}
            </ul>
        </div>
    )
}