import React from 'react'

export default function instructions() {
    return (
        <div className="instructions-card">
            <h3>Instructions:</h3>
            <ul>
                <li>Select CORRECT name from drop down</li>
                <li>Make your picks and submit</li>
                <li>If you need to make a change, you can resubmit single picks at any time up until game time.</li>
                <li>Lines that are whole numbers will shift .5 in favor of the underdog (-5 moves to -5.5)</li>
                <li>Missed picks will default to underdog and are worth 0.5 point</li>
            </ul>
        </div>

    )
}