import React from 'react'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';
import Steps from './Steps'

export default function PicksToday() {
    const [name, setName] = useState('SELECT YOUR NAME IN DROPDOWN!')
    const [names, setNames] = useState([''])
    const [games, setGames] = useState([])
    const [picks, setPicks] = useState([])
    const [nameToast, setNameToast] = useState('')
    const [currentPick, setCurrentPick] = useState([])
    const [modalIsOpen, setIsOpen] = useState('')

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
                const response = await axios(`api/games/y`)
                setGames(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchGames()
    }, [])

    useEffect(() => {
        async function fetchNames() {
            try {
                const response = await axios('api/names')
                const sortedList = response.data.sort((a, b) =>
                    a.name.localeCompare(b.name));
                setNames(sortedList)
            } catch (e) {
                console.log(e)
            }
        }
        fetchNames()
    }, [])

    // Set Name
    const handleNameSelect = event => {
        setName(event);
        setNameToast(event);
    };

    const namesList =
        names.map(name =>
            <Dropdown.Item
                eventKey={name.name}
                key={name.name}
            >
                {name.name}
            </Dropdown.Item>
        )

    // Set Picks
    const handleChange = (event, id, underdog, favorite, line, game_date) => {
        let activePicks = picks
        const currentPick = event.target.value
        const currentPickObj = {
            game: id,
            pick: currentPick,
            underdog,
            favorite,
            line,
            game_date
        }
        setCurrentPick(currentPick)
        if (activePicks.length > 0) {
            let findCurrentPick = activePicks.find(o => o.game === id)
            if (findCurrentPick === undefined) {
                activePicks.push(currentPickObj)
                setPicks(activePicks)
            } else {
                findCurrentPick.pick = currentPick
                setPicks(activePicks)
            }
        } else {
            activePicks.push(currentPickObj)
            setPicks(activePicks);
        }
    }

        //tiebreaker scores
        const handleUScore = event => {
            setUScore(event.target.value)
        }
        const handleFScore = event => {
            setFScore(event.target.value)
        }

    const tableGrid =
        games.map(game =>
            <tr>
                <>
                    <td key={game.id}>{game.id}</td>
                    <td key={game.time}>{game.time}</td>
                    <td key={game.underdog}>{game.underdog}</td>
                    <td key={game.favorite}>{game.favorite}</td>
                    <td key={game.line}>-{game.line}</td>
                    <td>
                        <select
                            key={game.id}
                            value={game.id}
                            onChange={() => { handleChange(event, game.id, game.underdog, game.favorite, game.line, game.game_date) }}
                        >
                            <option
                                key='pick'
                                value=''
                            >

                            </option>
                            <option
                                key={game.underdog}
                                value={game.underdog}
                            >
                                {game.underdog} (+{game.line})
                            </option>
                            <option
                                key={game.favorite}
                                value={game.favorite}
                            >
                                {game.favorite} (-{game.line})
                            </option>
                        </select>
                    </td>
                </>
            </tr>
            // )
        )


    // Send name and picks to database and reset fields
    function handleSubmitClick(event) {

        if (name != 'SELECT YOUR NAME IN DROPDOWN!') {
            event.preventDefault()
            setIsOpen(true);
            for (let i = 0; i < picks.length; i++) {
                const game_id = picks[i].game;
                const pick = picks[i].pick
                const game_date = picks[i].game_date
                axios.post('api/picks', {
                    name,
                    game_id,
                    pick,
                    game_date
                })
            }

            // const totalTiebreakerScore = Number(uScore) + Number(fScore)
            // const tiebreakerScore = uScore + '-' + fScore + ' (' + totalTiebreakerScore + ')'
            // axios.post('api/picks', {
            //     name,
            //     game_id: 113,
            //     pick:tiebreakerScore,
            //     game_date: 'tb'
            // })

            toast.success(`Thanks, ${nameToast}, picks submitted.`,
                {
                    duration: 10001,
                    position: 'top-center',
                    style: {
                        border: '2px solid #713200',
                        padding: '20px',
                        marginTop: '100px',
                        color: 'white',
                        backgroundColor: 'rgb(60, 179, 113, 0.7)'
                    },
                    icon: '🏀',
                    role: 'status',
                    ariaLive: 'polite',
                });
            setName("")
            setPicks("")
        } else {
            toast.error('Please select name in dropdown!',
                {
                    duration: 5000,
                    position: 'top-center',
                    style: {
                        border: '2px solid #713200',
                        padding: '20px',
                        marginTop: '100px',
                        backgroundColor: 'rgb(255,0,0)',
                        color: 'rgb(255,255,255)'
                    },
                });
        }

    }

    return (
        <div className='container'>
            <Toaster />
            <Steps />
            <DropdownButton
                id="dropdown-basic-button"
                title='Name'
                onSelect={handleNameSelect}
                key='dropdown'>{namesList}
            </DropdownButton>
            <h4> Name: {name}</h4>
            <h5>Most Recent Pick: {currentPick}</h5>
            <div className="table">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Game #</th>
                            <th>Time (ET)</th>
                            <th>Underdog</th>
                            <th>Favorite</th>
                            <th>Line</th>
                            <th>Pick</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableGrid}
                          {/* <tr>
                        <td>Tiebreaker: Big Ten Score</td>
                        <td>Enter scores to the right</td>
                        <td><input onChange={handleUScore} type="text" id="tiebreakeru" name="underdog score" size="10" /></td>
                        <td><input onChange={handleFScore} type="text" id="tiebreakerf" name="favorite score" size="10" /></td>
                    </tr> */}
                    </tbody>
                </Table>

                <Button onClick={handleSubmitClick}>Submit</Button>
            </div>
            <>
                <h3>Picks (selected {picks.length} out of {games.length}):</h3>
                <div className="table picksTable">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th key='game id'>#</th>
                                <th key='game'>Game</th>
                                <th key='game pick'>Pick</th>
                            </tr>
                        </thead>
                        <tbody>
                            {picks.length > 0 ? picks.map(thisPick =>
                                <tr>
                                    <td key={thisPick.game}>{thisPick.game}</td>
                                    <td key='matchup'>{thisPick.underdog} vs {thisPick.favorite} (-{thisPick.line})</td>
                                    <td key={thisPick.pick}>{thisPick.pick}</td>
                                </tr>
                            ) : ""
                            }
                        </tbody>
                    </Table>
                </div>
            </>
        </div>
    )
}

