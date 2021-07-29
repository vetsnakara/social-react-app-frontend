import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"

import axios from "axios"

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
    const [loggedIn, setLoggedIn] = useState(false)
    const [flashMessages, setFlashMessages] = useState([])

    console.log("messages", flashMessages)

    function addFlashMessage(msg) {
        setFlashMessages((prev) => prev.concat(msg))
    }

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("appToken")
        setLoggedIn(isLoggedIn)
    }, [])

    return (
        <BrowserRouter>
            <FlashMessage messages={flashMessages} />

            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <Switch>
                <Route exact path="/">
                    {loggedIn ? <Home /> : <HomeGuest />}
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
                    <CreatePost onCreate={addFlashMessage} />
                </Route>
            </Switch>

            <Footer />
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.querySelector("#root"))

if (module.hot) {
    module.hot.accept()
}
