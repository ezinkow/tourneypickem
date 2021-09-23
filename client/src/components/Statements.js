import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'

export default function Statements() {
    const [statements, setStatements] = useState([])

    useEffect(() => {
        async function fetchStatements() {
            try {
                const response = await axios('api/statement')
                console.log(response)
                setStatements(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchStatements()
    }, [])

    useEffect(() => {
        console.log(statements)
    })

    return (
        <>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th><h3>Date Said</h3></th>
                        <th><h3>Shit She Said</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {statements.length > 0 ? statements.map(statement =>
                        <tr>
                            <td>{statement.when}</td>
                            <td>{statement.statement}</td>
                        </tr>
                    ) : ""}
                </tbody>
            </Table>
        </>
    )
}