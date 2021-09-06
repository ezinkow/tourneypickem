import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function WishForm() {
    const [name, setName] = useState('')
    const [wish, setWish] = useState('')

    const handleNameChange = event => {
        setName(event.target.value);
        console.log(event.target.value);
    };

    function handleWishChange(event) {
        setWish(event.target.value)
    }

    function handleSubmitClick(event) {
        event.preventDefault()
        console.log(event.target)
        axios.post('api/wish', {
            name,
            wish
        })
        setName("")
        setWish("")
    }
    return (
        <>
            <div className="form">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="Text" placeholder="Name" value={name} onChange={handleNameChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Enter your wish:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={wish} placeholder="What's your wish?" onChange={handleWishChange} />
                    </Form.Group>
                    <Button onClick={handleSubmitClick}>Submit</Button>
                </Form>
            </div>
        </>
    )
}