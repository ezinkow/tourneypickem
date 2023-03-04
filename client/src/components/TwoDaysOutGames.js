import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table';

export default function TwoDaysOutGames() {
    const [games, setGames] = useState([])
    const twoDay = new Date
    const twoDaysMonth = twoDay.getMonth() + 1
    const twoDaysDay = twoDay.getDate() + 2
    const twoDaysDate = twoDaysMonth + '' + twoDaysDay

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    useEffect(() => {
        async function fetchGames() {
            try {
                const response = await axios(`api/games/${twoDaysDate}`)
                setGames(response.data)
                console.log(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchGames()
    }, [])

    const tableGrid =
        games.map(game =>
            <tr>
                <>
                    <td key={game.id}>{game.id}</td>
                    <td key={game.time}>{game.time}</td>
                    <td key={game.underdog}>{game.underdog}</td>
                    <td key={game.favorite}>{game.favorite}</td>
                    <td key={game.line}>-{game.line}</td>
                    
                   
                </>
            </tr>
        )


    return (
        <div className='container'>
            <br></br>
            <h3>In Two Days' Games:</h3>
            <div className="table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Game #</th>
                            <th>Time (ET)</th>
                            <th>Underdog</th>
                            <th>Favorite</th>
                            <th>Line</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableGrid}
                    </tbody>
                </Table>

            </div>
        </div>
    )
}

