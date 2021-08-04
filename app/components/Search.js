// todo add open overlay on key combination

import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useImmer } from "use-immer"

import axios from "axios"

import { dispatchContext } from "./StateProvider"
import { Post } from "./Post"

export function Search() {
    const dispatch = useContext(dispatchContext)

    const [state, setState] = useImmer({
        searchTerm: "",
        results: [],
        show: "neither",
        requestCount: 0,
    })

    useEffect(() => {
        document.addEventListener("keydown", searchKeyPressHandler)
        return () =>
            document.removeEventListener("keydown", searchKeyPressHandler)
    }, [])

    useEffect(() => {
        if (state.searchTerm.trim()) {
            setState((state) => {
                state.show = "loading"
            })

            const delay = setTimeout(() => {
                setState((state) => {
                    state.requestCount++
                })
            }, 500)

            return () => clearTimeout(delay)
        }
    }, [state.searchTerm])

    useEffect(() => {
        if (state.requestCount > 0) {
            const request = axios.CancelToken.source()
            ;(async function fetchResults() {
                try {
                    const { data } = await axios.post(
                        "/search",
                        {
                            searchTerm: state.searchTerm,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    setState((state) => {
                        state.results = data
                        state.show = "results"
                    })
                } catch (error) {
                    setState((state) => {
                        state.show = "neither"
                    })

                    console.log("Error is occured", error)
                }
            })()

            return () => request.cancel()
        }
    }, [state.requestCount])

    function searchKeyPressHandler({ keyCode }) {
        if (keyCode === 27) dispatch({ type: "closeSearch" })
    }

    function handleInput(e) {
        const { value } = e.target
        setState((state) => {
            state.searchTerm = value
        })
    }

    return (
        <div className="search-overlay">
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label
                        htmlFor="live-search-field"
                        className="search-overlay-icon"
                    >
                        <i className="fas fa-search"></i>
                    </label>
                    <input
                        autoFocus
                        type="text"
                        autoComplete="off"
                        id="live-search-field"
                        className="live-search-field"
                        placeholder="What are you interested in?"
                        value={state.searchTerm}
                        onChange={handleInput}
                    />
                    <span
                        onClick={() => dispatch({ type: "closeSearch" })}
                        className="close-live-search"
                    >
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div
                        className={
                            "circle-loader " +
                            (state.show == "loading"
                                ? "circle-loader--visible"
                                : "")
                        }
                    ></div>

                    <div
                        className={
                            "live-search-results " +
                            (state.show == "results"
                                ? "live-search-results--visible"
                                : "")
                        }
                    >
                        {Boolean(state.results.length) && (
                            <div className="list-group shadow-sm">
                                <div className="list-group-item active">
                                    <strong>Search Results</strong> (
                                    {state.results.length} items found)
                                </div>
                                {state.results.map((post) => (
                                    <Post
                                        key={post._id}
                                        post={post}
                                        onClick={() =>
                                            dispatch({ type: "closeSearch" })
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {!Boolean(state.results.length) && (
                            <p className="alert alert-danger text-center shadow-sm">
                                Sorry, can not find posts =(
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
