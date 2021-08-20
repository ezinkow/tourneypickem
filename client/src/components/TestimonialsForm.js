import React from 'react'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default function () {
    const [name, setName] = useState("")
    const [testimonial, setTestimonial] = useState("")
    // const [question, setQuestion] = useState('')

    const handleNameChange = event => {
        setName(event.target.value);
    };

    function handleTestimonialChange(event) {
        setTestimonial(event.target.value)
    }

    function handleSubmitClick(event) {
        event.preventDefault()
        console.log(event.target)
        axios.post('api/testimonials', {
            name,
            testimonial
        })
        setName("")
        setTestimonial("")
        console.log(name, testimonial)
    }

    return (
        <div className="testForm">
                    <Form>
                        <h3>Testimonials:</h3>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="Text" placeholder="Name" value={name} onChange={handleNameChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Enter your testimonial:</Form.Label>
                            <Form.Control as="textarea" rows={5} placeholder="Testimonial" value={testimonial} onChange={handleTestimonialChange} />
                        </Form.Group>
                        <Button onClick={handleSubmitClick}>Submit</Button>
                    </Form>
        </div>
    )
}