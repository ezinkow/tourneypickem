import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table';

export default function PicksDisplay() {
    const [picks, setPicks] = useState([])
    const maxGameId = '2'
    const todaysDate = '35'

    useEffect(() => {
        async function fetchPicks() {
            try {
                const response = await axios(`api/picks/${todaysDate}`)
                setPicks(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchPicks()
    }, [])

    return (

        <div className="table">
            <h1>come back later for everyones picks</h1>
            {/* <h3>Picks:</h3>
            <div className="table picksTable">
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th key='game id'>Name</th>
                            <th key='game id'>Game #</th>
                            <th key='game pick'>Pick</th>
                        </tr>
                    </thead>
                    <tbody>
                        {picks.length > 0 ? picks.map(thisPick =>
                            <tr>
                                <td key={thisPick.name}>{thisPick.name}</td>
                                <td key={thisPick.game_id}>{thisPick.game_id}</td>
                                <td key={thisPick.pick}>{thisPick.pick}</td>
                            </tr>
                        ) : ""
                        }
                    </tbody>
                </Table>
            </div> */}
        </div>
    )
}



