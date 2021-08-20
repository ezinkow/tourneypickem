import React from 'react'
import { useState } from 'react'
import axios from 'axios'

export default function testimonials() {
    const [testimonials, setTestimonials] = useState({})

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const response = await axios('api/queries')
                setTestimonials(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchTestimonials()
    }, [])

    return (
        <p>test</p>
    )
}