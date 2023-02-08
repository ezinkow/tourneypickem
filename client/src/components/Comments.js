import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'

export default function Comments() {
    const [comments, setComments] = useState([])

    // Fetch all entries in post table
    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await axios('api/post')
                setComments(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchComments()
    }, [])

    // console log what comes back from post table
    useEffect(() => {
        console.log(comments)
    })

    return (
        <>
            <div className="comments">
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th><h3>Name</h3></th>
                            <th><h3>Comment</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length > 0 ? comments.map(comment =>
                            <tr>
                                <td>{post.name}</td>
                                <td>{post.comment}</td>
                            </tr>
                        ) : ""}
                    </tbody>
                </Table>
            </div>
        </>
    )
}