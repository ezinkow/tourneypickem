import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'
import speechBubble from '../images/speechbubble.png'

export default function Testimonials() {
    const [questions, setQuestions] = useState({})

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await axios('api/questions')
                setQuestions(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchQuestions()
    }, [])

    return (
        <div className='row bubbles'>
            {questions.length > 0 ? questions.map(question =>
                <div className='col-3 bubbleContainer'>
                    <img src={speechBubble} alt="Speech Bubble" className="bubbleImg" />
                    <div className='questionText'>
                        <h4>"{question.question}"</h4>
                        <p className='questionName'>-{question.name}</p>
                    </div>
                </div>
            ) : ""}
        </div>
    )
}