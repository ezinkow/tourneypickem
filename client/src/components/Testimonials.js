import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Card from 'react-bootstrap/Card'

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState({})

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const response = await axios('api/testimonials')
                setTestimonials(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchTestimonials()
    }, [])

    useEffect(() => {
        console.log(testimonials)
    })

    return (
        <div className="container cards">
            {testimonials.length > 0 ? testimonials.map(testimonial =>
                < Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>"{testimonial.testimonial}"</Card.Title>
                        <Card.Text>
                            -{testimonial.name}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) : ""}
        </div>
    )
}