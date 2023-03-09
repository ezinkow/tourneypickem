import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table';

export default function onDeckGames() {
    const [games, setGames] = useState([])
    const onDeck = new Date
    const onDeckMonth = onDeck.getMonth() + 1
    const onDeckDay = onDeck.getDate() + 1
    //const onDeckDate = onDeckMonth + '' + onDeckDay
    const onDeckDate = '310a'
    
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
                const response = await axios(`api/games/${onDeckDate}`)
                setGames(response.data)
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
            {/* <h3>On Deck ({onDeckMonth}/{onDeckDay}):</h3> */}
            <h3>On Deck (3/10 AM):</h3>
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

