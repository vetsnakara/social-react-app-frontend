import React, { useContext, useEffect, useState } from "react"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import axios from "axios"

import { dispatchContext } from "./StateProvider"

import { Page } from "./Page"

export function HomeGuest() {
    const appDispatch = useContext(dispatchContext)

    const initState = {
        username: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0, // used to check isUnique via backend request
        },
        email: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0,
        },
        password: {
            value: "",
            hasErrors: false,
            message: "",
        },
        submitCount: 0,
    }

    const [state, dispatch] = useImmerReducer(reducer, initState)

    function reducer(state, action) {
        switch (action.type) {
            case "usernameImmediately":
                state.username.hasErrors = false
                state.username.value = action.value

                if (state.username.value.length > 30) {
                    state.username.hasErrors = true
                    state.username.message =
                        "Username cannot exceed 30 characters"
                    return
                }

                if (
                    state.username.value &&
                    !/^([a-zA-Z0-9]+)$/.test(state.username.value)
                ) {
                    state.username.hasErrors = true
                    state.username.message =
                        "Username can contain only letters and numbers"
                    return
                }

                break
            case "usernameAfterDelay":
                if (state.username.value.length < 3) {
                    state.username.hasErrors = true
                    state.username.message =
                        "Username should be at least 3 characters"
                }

                if (!state.username.hasErrors && !action.noRequest) {
                    state.username.checkCount++
                }
                break
            case "usernameUniqueResults":
                if (action.value) {
                    state.username.hasErrors = true
                    state.username.isUnique = false
                    state.username.message = "That username is already taken"
                } else {
                    state.username.isUnique = true
                }
                break
            case "emailImmediately":
                state.email.hasErrors = false
                state.email.value = action.value
                break
            case "emailAfterDelay":
                if (!/^\S+@\S+$/.test(state.email.value)) {
                    state.email.hasErrors = true
                    state.email.message =
                        "You must provide a valid email address"
                }

                if (!state.email.hasErrors && !action.noRequest) {
                    state.email.checkCount++
                }
                break
            case "emailUniqueResults":
                if (action.value) {
                    state.email.hasErrors = true
                    state.email.isUnique = false
                    state.email.message = "That email is already taken"
                } else {
                    state.email.isUnique = true
                }
                break
            case "passwordImmediately":
                state.password.hasErrors = false
                state.password.value = action.value

                if (state.password.value.length > 50) {
                    state.password.hasErrors = true
                    state.password.message =
                        "Password cannot exceed 50 characters"
                }
                break
            case "passwordAfterDelay":
                if (state.password.value.length < 12) {
                    state.password.hasErrors = true
                    state.password.message =
                        "Password must be at least 12 characters"
                }
                break
            case "submitForm":
                if (
                    !state.username.hasErrors &&
                    !state.email.hasErrors &&
                    !state.password.hasErrors
                ) {
                    state.submitCount++
                }
                break
        }
    }

    useEffect(() => {
        if (state.username.value) {
            const timer = setTimeout(() => {
                dispatch({ type: "usernameAfterDelay" })
            }, 750)

            return () => clearTimeout(timer)
        }
    }, [state.username.value])

    useEffect(() => {
        if (state.email.value) {
            const timer = setTimeout(() => {
                dispatch({ type: "emailAfterDelay" })
            }, 750)

            return () => clearTimeout(timer)
        }
    }, [state.email.value])

    useEffect(() => {
        if (state.password.value) {
            const timer = setTimeout(() => {
                dispatch({ type: "passwordAfterDelay" })
            }, 750)

            return () => clearTimeout(timer)
        }
    }, [state.password.value])

    useEffect(() => {
        if (state.username.checkCount > 0) {
            const request = axios.CancelToken.source()
            ;(async function () {
                try {
                    const { data } = await axios.post(
                        "/doesUsernameExist",
                        {
                            username: state.username.value,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    dispatch({ type: "usernameUniqueResults", value: data })
                } catch (error) {
                    console.log("Error is occured", error)
                }
            })()

            return () => request.cancel()
        }
    }, [state.username.checkCount])

    useEffect(() => {
        if (state.email.checkCount > 0) {
            const request = axios.CancelToken.source()
            ;(async function () {
                try {
                    const { data } = await axios.post(
                        "/doesEmailExist",
                        {
                            email: state.email.value,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    dispatch({ type: "emailUniqueResults", value: data })
                } catch (error) {
                    console.log("Error is occured", error)
                }
            })()

            return () => request.cancel()
        }
    }, [state.email.checkCount])

    useEffect(() => {
        if (state.submitCount > 0) {
            const request = axios.CancelToken.source()
            ;(async function () {
                try {
                    const { data } = await axios.post(
                        "/register",
                        {
                            username: state.username.value,
                            email: state.email.value,
                            password: state.password.value,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    appDispatch({ type: "login", value: data })
                    appDispatch({
                        type: "flashMessage",
                        value: "Welcome to your new account!",
                    })
                } catch (error) {
                    console.log("Error is occured", error)
                }
            })()

            return () => request.cancel()
        }
    }, [state.submitCount])

    function handleSubmit(e) {
        e.preventDefault()

        dispatch({ type: "usernameImmediately", value: state.username.value })
        dispatch({
            type: "usernameAfterDelay",
            value: state.username.value,
            noRequest: true,
        })
        dispatch({ type: "emailImmediately", value: state.email.value })
        dispatch({
            type: "emailAfterDelay",
            value: state.email.value,
            noRequest: true,
        })
        dispatch({ type: "passwordImmediately", value: state.password.value })
        dispatch({
            type: "passwordAfterDelay",
            value: state.password.value,
        })
        dispatch({ type: "submitForm" })
    }

    const { username, email, password } = state

    return (
        <Page title="Home" wide={true}>
            <div className="row align-items-center">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">
                        Are you sick of short tweets and impersonal
                        &ldquo;shared&rdquo; posts that are reminiscent of the
                        late 90&rsquo;s email forwards? We believe getting back
                        to actually writing is the key to enjoying the internet
                        again.
                    </p>
                </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label
                                htmlFor="username-register"
                                className="text-muted mb-1"
                            >
                                <small>Username</small>
                            </label>
                            <input
                                id="username-register"
                                name="username"
                                className="form-control"
                                type="text"
                                placeholder="Pick a username"
                                autoComplete="off"
                                value={username.value}
                                onChange={(e) =>
                                    dispatch({
                                        type: "usernameImmediately",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <CSSTransition
                                in={state.username.hasErrors}
                                timeout={300}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {username.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="email-register"
                                className="text-muted mb-1"
                            >
                                <small>Email</small>
                            </label>
                            <input
                                id="email-register"
                                name="email"
                                className="form-control"
                                type="text"
                                placeholder="you@example.com"
                                autoComplete="off"
                                value={email.value}
                                onChange={(e) =>
                                    dispatch({
                                        type: "emailImmediately",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <CSSTransition
                                in={state.email.hasErrors}
                                timeout={300}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {email.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="password-register"
                                className="text-muted mb-1"
                            >
                                <small>Password</small>
                            </label>
                            <input
                                id="password-register"
                                name="password"
                                className="form-control"
                                type="password"
                                placeholder="Create a password"
                                autoComplete="off"
                                value={password.value}
                                onChange={(e) =>
                                    dispatch({
                                        type: "passwordImmediately",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <CSSTransition
                                in={state.password.hasErrors}
                                timeout={300}
                                classNames="liveValidateMessage"
                                unmountOnExit
                            >
                                <div className="alert alert-danger small liveValidateMessage">
                                    {password.message}
                                </div>
                            </CSSTransition>
                        </div>
                        <button
                            type="submit"
                            className="py-3 mt-4 btn btn-lg btn-success btn-block"
                        >
                            Sign up for ComplexApp
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    )
}
