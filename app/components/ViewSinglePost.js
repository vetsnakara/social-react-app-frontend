import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import axios from "axios"

import { Page } from "./Page"
import { Loading } from "./Loading"

export function ViewSinglePost() {
    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [post, setPost] = useState([])

    useEffect(() => {
        const request = axios.CancelToken.source()

        ;(async function fetchPosts() {
            try {
                const { data: post } = await axios.get(`/post/${id}`, {
                    cancelToken: request.token,
                })

                setPost(post)
            } catch (error) {
                console.log("There was a problem")
            } finally {
                setIsLoading(false)
            }
        })()

        return () => {
            request.cancel()
        }
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

    // todo: extract to utils
    const dateFormatted = `${
        date.getMonth() + 1
    }/${date.getDay()}/${date.getFullYear()}`

    return (
        <Page title={title}>
            <div className="d-flex justify-content-between">
                <h2>{title}</h2>

                <span className="pt-2">
                    <Link
                        data-tip="Edit"
                        data-for="edit"
                        to={`/post/${id}/edit`}
                        className="text-primary mr-2"
                    >
                        <i className="fas fa-edit"></i>
                    </Link>{" "}
                    <Link
                        data-tip="Delete"
                        data-for="delete"
                        to={`/post/${id}/delete`}
                        className="delete-post-button text-danger"
                        title="Delete"
                    >
                        <i className="fas fa-trash"></i>
                    </Link>
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
            <div className="body-content">
                <ReactMarkdown>{body}</ReactMarkdown>
            </div>
            <ReactTooltip id="edit" className="custom-tooltip" />
            <ReactTooltip id="delete" className="custom-tooltip" />
        </Page>
    )
}
