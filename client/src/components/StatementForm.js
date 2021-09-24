import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import DatePicker from 'react-date-picker'

export default function StatementForm() {
    const [when, onChange] = useState(new Date())
    const [statement, setStatement] = useState('')

    const handleDateChange = event => {
        // setWhen(event.target.value);
        console.log(event);
    };

    console.log(when)
    
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
        onChange("")
        setStatement("")
    }
    return (
        <>
            <div className="form">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label><br/>
                        <DatePicker 
                         calendarAriaLabel="Toggle calendar"
                         clearAriaLabel="Clear value"
                         dayAriaLabel="Day"
                         monthAriaLabel="Month"
                         nativeInputAriaLabel="Date"
                         onChange={onChange}
                         value={when}
                         yearAriaLabel="Year"
                         format="MM-dd-y"
                         maxLength='10'
                        />
                        {/* <Form.Control type="Text" placeholder="Date Said" value={when} onChange={handleDateChange} /> */}
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