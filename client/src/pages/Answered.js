import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Answered() {
    const [askedQuestions, setAskedQuestions] = useState([])

    useEffect(() => {
        async function fetchAskedQuestions() {
            try {
                const response = await axios('api/queries')
                setAskedQuestions(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchAskedQuestions()
    }, [])

    return (
        <>
            <Navbar />
            {askedQuestions.map((q) => (
                <>
                    <p>Name: {q.name}</p>
                    <p>Category: {q.category}</p>
                    <p>Question: {q.question}</p>
                    <p>Answer: {q.answer}</p>
                    <p>Time Wasted: {q.timeWasted}</p>
                </>
            ))}
        </>
    )
}