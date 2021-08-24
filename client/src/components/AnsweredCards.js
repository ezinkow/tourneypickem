import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'

export default function Answered() {
    const [answered, setAnswered] = useState({})

    useEffect(() => {
        async function fetchAnswered() {
            try {
                const response = await axios('api/answered')
                setAnswered(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchAnswered()
    }, [])

    useEffect(() => {
        console.log(answered)
    })

    return (
        <div className="container answeredCards">
            <div className='row'>
                {answered.length > 0 ? answered.map(answer =>
                    <div className='col-3 answerCards'>
                        < Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Question: {answer.question}</Card.Title>
                                <Card.Title>
                                    Answer: {answer.answer}
                                </Card.Title>
                                <Card.Text>
                                    Category: {answer.category}
                                </Card.Text>
                                <Card.Text>
                                    Name: {answer.name}
                                </Card.Text>
                                <Card.Text>
                                    Task I could have completed: {answer.timeWasted}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                ) : ""}
            </div>
        </div>
    )
}