import React from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

export default function AnswerQuestions() {
    const [questions, setQuestions] = useState({})
    const [show, setShow] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [answer, setAnswer] = useState("");
    const [timeWasted, setTimeWasted] = useState("");

    function handleClose(thisQuestion) {
        setShow(false);
        axios.post('/api/answered',{
            name: thisQuestion.name,
            category: thisQuestion.category,
            question: thisQuestion.question,
            answer,
            timeWasted
        })
    }

    async function handleShow(id) {
        setShow(true);
        try {
            const questResponse = await axios(`api/questions/${id}`)
            setSelectedQuestion(questResponse.data)
        } catch (e) {
            console.log(e)
        }
    }
    console.log(selectedQuestion)

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

    useEffect(() => {
        console.log(questions)
    })

    function handleAnswerClick() {
        return (<p>test</p>)
    }

    function handleAnswerChange(event) {
        setAnswer(event.target.value)
        console.log(event.target.value)
    }
    
    function handleTimeWastedChange(event) {
        setTimeWasted(event.target.value)
        console.log(event.target.value)
    }


    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>

                        <th>Question</th>
                        <th>Name</th>
                        <th>Select</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? questions.map(question =>
                        <tr>
                            <td>"{question.question}"</td>
                            <td>{question.name}</td>
                            <td><Button variant="success" onClick={() => handleShow(question.id)}>Answer</Button>{' '}</td>
                        </tr>
                    ) : ""}
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Body>{selectedQuestion.length > 0 ? selectedQuestion[0].question : ""}</Modal.Body>
                </Modal.Header>
                    <Modal.Body>-{selectedQuestion.length > 0 ? selectedQuestion[0].name : ""}</Modal.Body>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Answer:</Form.Label>
                        <Form.Control as="textarea" rows={10} onChange={handleAnswerChange}/>
                        <Form.Label>Task I could have completed instead of answering this question:</Form.Label>
                        <Form.Control as="textarea" rows={3} onChange={handleTimeWastedChange}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" onClick={() => handleClose(selectedQuestion[0])}>
                        ANSWER!
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}