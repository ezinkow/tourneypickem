import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table';

export default function GameResults() {
    const [games, setGames] = useState([])

    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios(`api/games`)
                console.log('response', response.data)
                setGames(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchGames()
    }, []);
    return (
        <div className="table resultstable">
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th key='game id'>Game #</th>
                        <th key='underdog'>Underdog</th>
                        <th key='favorite'>Favorite</th>
                        <th key='line'>Line</th>
                        <th key='winner'>Winner</th>
                    </tr>
                </thead>
                <tbody>
                    {games.length > 0 ? games.map(thisGame =>
                        <tr>
                            <td key={thisGame.id}>{thisGame.id}</td>
                            <td key={thisGame.underdog}>{thisGame.underdog}</td>
                            <td key={thisGame.favorite}>{thisGame.favorite}</td>
                            <td key={thisGame.line}>-{thisGame.line}</td>
                            <td key={thisGame.winner}>{thisGame.winner}</td>
                        </tr>
                    ) : ""
                    }
                </tbody>
            </Table>
        </div>
    )
}