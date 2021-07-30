import React, { useState, useContext } from "react"
import { Redirect } from "react-router-dom"

import axios from "axios"

import Context from "../context"

import { Page } from "./Page"

export function CreatePost({ onCreate }) {
    const { dispatch } = useContext(Context)

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [postId, setPostId] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const { data: postId } = await axios.post("/create-post", {
                title,
                body,
                token: localStorage.getItem("appToken"),
            })

            dispatch({
                type: "flashMessage",
                value: "Post successfully created!!!!!",
            })

            setPostId(postId)
        } catch (error) {
            console.log("There was a problem", error)
        }
    }

    if (postId) {
        return <Redirect to={`/post/${postId}`} />
    }

    return (
        <Page title="Create New Post">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input
                        autoFocus
                        name="title"
                        id="post-title"
                        className="form-control form-control-lg form-control-title"
                        type="text"
                        placeholder=""
                        autoComplete="off"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label
                        htmlFor="post-body"
                        className="text-muted mb-1 d-block"
                    >
                        <small>Body Content</small>
                    </label>
                    <textarea
                        name="body"
                        id="post-body"
                        className="body-content tall-textarea form-control"
                        type="text"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                </div>

                <button className="btn btn-primary">Save New Post</button>
            </form>
        </Page>
    )
}
