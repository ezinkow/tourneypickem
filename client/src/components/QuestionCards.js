import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'

export default function Testimonials() {
    const [questions, setQuestions] = useState({})

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios('api/queries')
                setQuestions(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchQuestions()
    }, [])

    return (
        <div className="container questionCards">
            {questions.length > 0 ? questions.map(question =>
                < Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>"{question.question}"</Card.Title>
                        <Card.Text>
                            -{question.name}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) : ""}
        </div>
    )
}