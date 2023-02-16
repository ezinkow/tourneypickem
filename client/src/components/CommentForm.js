import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import Modal from 'react-modal';

export default function CommentForm() {
    const [name, setName] = useState('')
    const [comment, setComment] = useState('')
    const [hashtag, setHashtag] = useState('')
    const [modalIsOpen, setIsOpen] = useState('')

    // Set Comment
    function handleCommentChange(event) {
        setComment(event.target.value)
    }
    
    // Set Hashtag
    function handleHashtagChange(event) {
        setHashtag(event.target.value)
    }

    // Set Name
    const handleNameChange = event => {
        setName(event.target.value);
    };

    // Send name and comment to database and reset fields
    function handleSubmitClick(event) {
        event.preventDefault()
        axios.post('api/comment', {
            name,
            comment
        })
        setComment("")
        setHashtag("")
        setName("")
    }
    return (
        <>
            <div className="form">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Leave a Comment for Amir and Dana!:</Form.Label>
                        <Form.Control as="textarea" rows={5} value={comment} placeholder="Comment" onChange={handleCommentChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Hashtags:</Form.Label><br />
                        <Form.Control type="Text" placeholder="Hashtag" value={hashtag} onChange={handleHashtagChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label><br />
                        <Form.Control type="Text" placeholder="Name" value={name} onChange={handleNameChange} />
                    </Form.Group>
                    <Button onClick={handleSubmitClick}>Submit</Button>
                </Form>
            </div>
        </>
    )
}