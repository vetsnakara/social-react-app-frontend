import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"

import axios from "axios"

import { StateProvider } from "./components/StateProvider"
import { useLocalStorage } from "./hooks/useLocalStorage"

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { HomeGuest } from "./components/HomeGuest"
import { About } from "./components/About"
import { Terms } from "./components/Terms"
import { Home } from "./components/Home"
import { CreatePost } from "./components/CreatePost"
import { ViewSinglePost } from "./components/ViewSinglePost"
import { FlashMessage } from "./components/FlashMessage"
import { Profile } from "./components/Profile"
import { EditPost } from "./components/EditPost"
import { NotFound } from "./components/NotFound"

axios.defaults.baseURL = "http://localhost:8080"

function App() {
    const { user } = useLocalStorage()

    return (
        <BrowserRouter>
            <FlashMessage />

            <Header />

            <Switch>
                <Route exact path="/">
                    {user ? <Home /> : <HomeGuest />}
                </Route>
                <Route path="/profile/:username">
                    <Profile />
                </Route>
                <Route path="/post/:id/edit">
                    <EditPost />
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
                <Route>
                    <NotFound />
                </Route>
            </Switch>

            <Footer />
        </BrowserRouter>
    )
}

ReactDOM.render(
    <StateProvider>
        <App />
    </StateProvider>,
    document.querySelector("#root")
)

if (module.hot) {
    module.hot.accept()
}
