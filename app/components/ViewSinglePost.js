import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

import { Page } from "./Page"
import { Loading } from "./Loading"

export function ViewSinglePost() {
    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState([])

    useEffect(() => {
        ;(async function fetchPosts() {
            try {
                const { data: post } = await axios.get(`/post/${id}`)

                setPost(post)
            } catch (error) {
                console.log("There was a problem")
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    if (isLoading) {
        return (
            <Page title="...">
                <Loading />
            </Page>
        )
    }

    const { title, body, author, createdDate } = post

    const date = new Date(createdDate)

    const dateFormatted = `${
        date.getMonth() + 1
    }/${date.getDay()}/${date.getFullYear()}`

    return (
        <Page title={title}>
            <div className="d-flex justify-content-between">
                <h2>{title}</h2>

                <span className="pt-2">
                    <a href="#" className="text-primary mr-2" title="Edit">
                        <i className="fas fa-edit"></i>
                    </a>
                    <a
                        className="delete-post-button text-danger"
                        title="Delete"
                    >
                        <i className="fas fa-trash"></i>
                    </a>
                </span>
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${author.username}`}>
                    <img className="avatar-tiny" src={author.avatar} />
                </Link>
                Posted by{" "}
                <Link to={`/profile/${author.username}`}>
                    {author.username}
                </Link>{" "}
                on {dateFormatted}
            </p>

            <div className="body-content">{body}</div>
        </Page>
    )
}
