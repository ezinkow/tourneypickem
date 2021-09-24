import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function StatementForm() {
    const [name, setName] = useState('')
    const [post, setPost] = useState('')

    // Set Name
    const handleNameChange = event => {
        setName(event.target.value);
    };
    
    // Set Post
    function handlePostChange(event) {
        setPost(event.target.value)
    }

    // Send name and post to database and reset fields
    function handleSubmitClick(event) {
        event.preventDefault()
        axios.post('api/post', {
            name,
            post
        })
        setName("")
        setPost("")
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
                        <Form.Label>Post:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={post} placeholder="Post" onChange={handlePostChange} />
                    </Form.Group>
                    <Button onClick={handleSubmitClick}>Submit</Button>
                </Form>
            </div>
        </>
    )
}