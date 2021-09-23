import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function StatementForm() {
    const [when, setWhen] = useState('')
    const [statement, setStatement] = useState('')

    const handleDateChange = event => {
        setWhen(event.target.value);
        console.log(event.target.value);
    };
    
    function handleStatementChange(event) {
        setStatement(event.target.value)
        console.log(event.target.value);
    }

    function handleSubmitClick(event) {
        event.preventDefault()
        console.log(event.target)
        axios.post('api/statement', {
            when,
            statement
        })
        setWhen("")
        setStatement("")
    }
    return (
        <>
            <div className="form">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="Text" placeholder="Date Said" value={when} onChange={handleDateChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Enter the Shit She Said:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={statement} placeholder="What shit did she say?" onChange={handleStatementChange} />
                    </Form.Group>
                    <Button onClick={handleSubmitClick}>Submit</Button>
                </Form>
            </div>
        </>
    )
}