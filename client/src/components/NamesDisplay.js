import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table';

export default function NamesDisplay() {
    const [names, setNames] = useState([])
    
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
        async function fetchNames() {
            try {
                const response = await axios("api/names/")
                const sortedList = response.data.sort((a,b) => (a.name > b.name) ? 1 : -1);
                setNames(sortedList)
                console.log('NAMES:',names)
                console.log(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchNames()
    }, [])

    const tableGrid =
        names.map(name =>
            <tr>
                <>
                    <td key={name.id}>{name.name}</td>
                    <td key={name.name}>{name.paid}</td>
                </>
            </tr>
        )


    return (
        <div className='container'>
            <br></br>
            <div className="table">
            <h2>Signed Up:</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Paid?</th>
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

