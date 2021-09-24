import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'

export default function Posts() {
    const [posts, setPosts] = useState([])

    // Fetch all entries in post table
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await axios('api/post')
                setPosts(response.data)
            } catch (e) {
                console.log(e)
            }
        }
        fetchPosts()
    }, [])

    // console log what comes back from post table
    useEffect(() => {
        console.log(posts)
    })

    return (
        <>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th><h3>Name</h3></th>
                        <th><h3>Post</h3></th>
                    </tr>
                </thead>
                <tbody>
                    {posts.length > 0 ? posts.map(post =>
                        <tr>
                            <td>{post.name}</td>
                            <td>{post.post}</td>
                        </tr>
                    ) : ""}
                </tbody>
            </Table>
        </>
    )
}