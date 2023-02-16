import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

export default function Comments() {
    const [comments, setComments] = useState({})

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await axios('api/comments')
                setComments(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchComments()
    }, [])

    return (
        <Container className='commentCards'>
            {comments.length > 0 ? comments.map(comment =>
                    <Card className='commentCard'>
                        <Card.Body>
                            <Card.Title>"{comment.comment}"</Card.Title>
                            <Card.Text>{comment.hashtag}</Card.Text>
                            <Card.Text>-{comment.name}</Card.Text>
                        </Card.Body>
                    </Card>
            ) : "No comments yet"}
        </Container >
    )
}