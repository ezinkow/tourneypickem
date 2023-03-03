import React from 'react'
import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Table from 'react-bootstrap/Table';

export default function PicksDisplay() {
    const [picks, setPicks] = useState([])


    useEffect(() => {
        async function fetchPicks() {
            try {
                const response = await axios('api/picks34')
                setPicks(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchPicks()
    }, [])




    return (

        <div className="table">
            <Table striped bordered hover>

                <thead>
                    <tr>
                        <th>Game #</th>
                        <th>Time</th>
                        <th>Underdog</th>
                        <th>Favorite</th>
                        <th>Line</th>
                        <th>Pick</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </Table>
        </div>
    )
}



