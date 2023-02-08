import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function CommentForm() {
    const [name, setName] = useState('')
    const [comment, setComment] = useState('')

    // Set Name
    const handleNameChange = event => {
        setName(event.target.value);
        console.log(name)
    };
    
    // Set Comment
    function handleCommentChange(event) {
        setComment(event.target.value)
    }

    // Send name and comment to database and reset fields
    function handleSubmitClick(event) {
        event.preventDefault()
        axios.post('api/comment', {
            name,
            comment
        })
        console.log("test")
        setName("")
        setComment("")
    }
    return (
        <>
            <div className="form">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label><br/>
                        <Form.Control type="Text" placeholder="Name" value={name} onChange={handleNameChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Comment:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={comment} placeholder="Comment" onChange={handleCommentChange} />
                    </Form.Group>
                    <Button onClick={handleSubmitClick}>Submit</Button>
                </Form>
            </div>
        </>
    )
}