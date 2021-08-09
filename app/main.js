import React, { useContext, useEffect } from "react"
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"

import axios from "axios"

import {
    StateProvider,
    stateContext,
    dispatchContext,
} from "./components/StateProvider"
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
import { Search } from "./components/Search"
import { Chat } from "./components/Chat"

axios.defaults.baseURL = "http://localhost:8080"

function App() {
    useLocalStorage()

    const { user, isSearchOpen } = useContext(stateContext)
    const dispatch = useContext(dispatchContext)

    // check if token is expired or not
    useEffect(() => {
        if (user) {
            const request = axios.CancelToken.source()
            ;(async function () {
                try {
                    const { data: isTokenValid } = await axios.post(
                        "/checkToken",
                        {
                            token: user.token,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    if (!isTokenValid) {
                        dispatch({ type: "logout" })
                        dispatch({
                            type: "flashMessage",
                            value: "You session has expired. Please log in again",
                        })
                    }
                } catch (error) {
                    console.log("Error is occured", error)
                }
            })()

            return () => request.cancel()
        }
    }, [])

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

            <Chat />

            <Footer />

            <CSSTransition
                timeout={330}
                in={isSearchOpen}
                classNames="search-overlay"
                unmountOnExit
            >
                <Search />
            </CSSTransition>
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
