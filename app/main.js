import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { HomeGuest } from "./components/HomeGuest"
import { About } from "./components/About"
import { Terms } from "./components/Terms"
import { Home } from "./components/Home"

function App() {
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("appToken")
        setLoggedIn(isLoggedIn)
    }, [])

    return (
        <BrowserRouter>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <Switch>
                <Route exact path="/">
                    {loggedIn ? <Home /> : <HomeGuest />}
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/terms">
                    <Terms />
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
