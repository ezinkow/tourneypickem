import React from 'react'
import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Form from 'react-bootstrap/Form';


export default function NameSubmit() {
    const [real_name, setReal_name] = useState('')
    const [name, setName] = useState('')
    const [email_address, setEmail_address] = useState('')
    const [email_opt_in, setEmail_opt_in] = useState(false)
    const [paid, setPaid] = useState(false)
    const [modalIsOpen, setIsOpen] = useState('')

    const handleRealNameChange = event => {
        setReal_name(event.target.value)
        console.log(name)
    }
    const handleNameChange = event => {
        setName(event.target.value)
        console.log(real_name)
    }
    const handleEmail_addressChange = event => {
        setEmail_address(event.target.value)
        console.log(email_address)
    }
    const handleEmail_opt_inChange = event => {
        setEmail_opt_in(event.target.checked)
        console.log(email_opt_in)
    }
    const handlePaidChange = event => {
        setPaid(event.target.checked)
        console.log(paid)
    }

    const handleNameSubmit = event => {
        event.preventDefault()
        console.log(real_name + name + email_address + email_opt_in)
        setIsOpen(true);
        axios.post('api/names', {
            real_name,
            name,
            email_address,
            email_opt_in,
            paid
        })
        toast.success(`THANKS, ${real_name}, YOU'RE SIGNED UP!`,
            {
                duration: 10001,
                position: 'top-center',
                style: {
                    border: '2px solid #713200',
                    padding: '20px',
                    marginTop: '100px',
                    color: 'white',
                    backgroundColor: 'rgb(60, 179, 113, 0.7)'
                },
                icon: '🏀',
                role: 'status',
                ariaLive: 'polite',
            });
        setName("")
    }

    return (
        < div >
            < form >
                <Toaster />
                <label for="fname"><h3>Sign up below:</h3></label><br />
                <Form>
                    <Form.Group onChange={handleRealNameChange} type="text" id="real_name" value={real_name} className="mb-3" controlId="formBasicName">
                        <Form.Label>REAL Name:</Form.Label>
                        <Form.Control size="lg" type="name" placeholder="Enter Your REAL Name" />
                    </Form.Group>
                    <Form.Group onChange={handleNameChange} type="text" id="name" value={name} className="mb-3" controlId="formBasicName">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control size="lg" type="name" placeholder="Enter Name You'll Select All Week" />
                    </Form.Group>
                    <Form.Group onChange={handleEmail_addressChange} type="text" id="email_address" value={email_address} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control size="lg" type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group onChange={handleEmail_opt_inChange} className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Sign me up for emails!" />
                    </Form.Group>
                    <Form.Group onChange={handlePaidChange} className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="I'm going to pay (venmo or zelle) right now!" />
                    </Form.Group>
                    <Button onClick={handleNameSubmit} type="submit" value="Submit" variant="primary">
                        Submit
                    </Button>
                </Form>
                {/* <input onChange={handleNameChange} type="text" id="name" value={name} placeholder='Name' /><br /><br /> */}
                {/* <Button onClick={handleNameSubmit} type="submit" value="Submit">Submit</Button> */}
                <h3>Please check the list below for any name duplicates, include last initial if needed</h3>
            </form >
        </div >
    )
}