// todo: markdown preview when create/edit post

import React, { useState, useEffect, useCallback, useContext } from "react"
import { Link, Redirect } from "react-router-dom"
import { useParams } from "react-router"
import { useImmerReducer } from "use-immer"
import axios from "axios"

import { stateContext } from "./StateProvider"
import { dispatchContext } from "./StateProvider"

import { Page } from "./Page"
import { NotFound } from "./NotFound"
import { Loading } from "./Loading"

export function EditPost() {
    const { id } = useParams()

    const { user } = useContext(stateContext)
    const appDispatch = useContext(dispatchContext)

    const origState = {
        title: {
            value: "",
            hasErrors: false,
            message: "",
        },
        body: {
            value: "",
            hasErrors: false,
            message: "",
        },
        loading: true,
        saving: false,
        id,
        sendCount: 0,
        notFound: false,
        permissionProblem: false,
    }

    const [state, dispatch] = useImmerReducer(reducer, origState)

    function reducer(state, action) {
        switch (action.type) {
            case "fetchComplete":
                state.title.value = action.value.title
                state.body.value = action.value.body
                state.loading = false
                if (!user || user.username !== action.value.author.username) {
                    state.permissionProblem = true
                }
                break
            case "titleChange":
                state.title.value = action.value
                state.title.hasErrors = false
                break
            case "bodyChange":
                state.body.value = action.value
                state.body.hasErrors = false
                break
            case "submit":
                if (!state.title.hasErrors && !state.body.hasErrors) {
                    state.sendCount++
                }
                break
            case "saveRequestStarted":
                state.saving = true
                break
            case "saveRequestFinished":
                state.saving = false
                break
            case "titleRules":
                state.title.hasErrors = !action.value.trim()
                state.title.message = state.title.hasErrors
                    ? "You must provide a title"
                    : ""
                break
            case "bodyRules":
                state.body.hasErrors = !action.value.trim()
                state.body.message = state.body.hasErrors
                    ? "You must provide a body"
                    : ""
                break
            case "notFound":
                state.notFound = true
                break
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        dispatch({ type: "titleRules", value: state.title.value })
        dispatch({ type: "bodyRules", value: state.body.value })
        dispatch({ type: "submit" })
    }

    useEffect(() => {
        const request = axios.CancelToken.source()

        ;(async function fetchPosts() {
            try {
                const { data: post } = await axios.get(`/post/${id}`, {
                    cancelToken: request.token,
                })

                if (post) {
                    dispatch({ type: "fetchComplete", value: post })
                } else {
                    dispatch({ type: "notFound" })
                }
            } catch (error) {
                console.log("There was a problem")
            } finally {
            }
        })()

        return () => {
            request.cancel()
        }
    }, [])

    useEffect(() => {
        if (state.sendCount > 0) {
            const request = axios.CancelToken.source()

            ;(async function editPost() {
                dispatch({ type: "saveRequestStarted" })

                try {
                    const { data: post } = await axios.post(
                        `/post/${id}/edit`,
                        {
                            title: state.title.value,
                            body: state.body.value,
                            token: user.token,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    dispatch({ type: "saveRequestFinished" })

                    appDispatch({
                        type: "flashMessage",
                        value: "Post successfully updated!",
                    })
                } catch (error) {
                    console.log("There was a problem")
                } finally {
                }
            })()

            return () => {
                request.cancel()
            }
        }
    }, [state.sendCount])

    useEffect(() => {
        if (state.permissionProblem === true) {
            appDispatch({
                type: "flashMessage",
                value: "You have no permissions to edit this post",
            })
        }
    }, [state.permissionProblem])

    const { loading, notFound, permissionProblem, title, body } = state

    if (notFound) {
        return <NotFound />
    }

    if (permissionProblem) {
        return <Redirect to="/" />
    }

    if (loading) {
        return (
            <Page title="...">
                <Loading />
            </Page>
        )
    }

    return (
        <Page title="Edit post">
            <Link to={`/post/${id}`} className="small font-weight-bold">
                &laquo; Back to post
            </Link>

            <form className="mt-3" onSubmit={handleSubmit}>
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
                        value={title.value}
                        onChange={(e) =>
                            dispatch({
                                type: "titleChange",
                                value: e.target.value,
                            })
                        }
                        onBlur={(e) =>
                            dispatch({
                                type: "titleRules",
                                value: e.target.value,
                            })
                        }
                    />
                    {state.title.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">
                            {state.title.message}
                        </div>
                    )}
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
                        value={body.value}
                        onChange={(e) =>
                            dispatch({
                                type: "bodyChange",
                                value: e.target.value,
                            })
                        }
                        onBlur={(e) =>
                            dispatch({
                                type: "bodyRules",
                                value: e.target.value,
                            })
                        }
                    ></textarea>
                    {state.body.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">
                            {state.body.message}
                        </div>
                    )}
                </div>

                <button className="btn btn-primary" disabled={state.saving}>
                    Edit Post
                </button>
            </form>
        </Page>
    )
}
