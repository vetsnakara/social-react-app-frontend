import React, { useState, useEffect, useReducer } from "react"
import ReactDOM from "react-dom"

import axios from "axios"

import Context from "./context"

import { BrowserRouter, Switch, Route } from "react-router-dom"

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { HomeGuest } from "./components/HomeGuest"
import { About } from "./components/About"
import { Terms } from "./components/Terms"
import { Home } from "./components/Home"
import { CreatePost } from "./components/CreatePost"
import { ViewSinglePost } from "./components/ViewSinglePost"
import { FlashMessage } from "./components/FlashMessage"

axios.defaults.baseURL = "http://localhost:8080"

function App() {
    const initState = {
        loggedIn: localStorage.getItem("appToken"),
        flashMessages: [],
    }

    const [state, dispatch] = useReducer(appReducer, initState)

    return (
        <Context.Provider value={{ dispatch, state }}>
            <BrowserRouter>
                <FlashMessage />

                <Header />

                <Switch>
                    <Route exact path="/">
                        {state.loggedIn ? <Home /> : <HomeGuest />}
                    </Route>
                    <Route path="/post/:id">
                        <ViewSinglePost />
                    </Route>
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/terms">
                        <Terms />
                    </Route>
                    <Route path="/create-post">
                        <CreatePost />
                    </Route>
                </Switch>

                <Footer />
            </BrowserRouter>
        </Context.Provider>
    )
}

function appReducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                loggedIn: true,
            }
        case "logout":
            return {
                ...state,
                loggedIn: false,
            }
        case "flashMessage":
            return {
                ...state,
                flashMessages: state.flashMessages.concat(action.value),
            }
        default:
            return state
    }
}

ReactDOM.render(<App />, document.querySelector("#root"))

if (module.hot) {
    module.hot.accept()
}
