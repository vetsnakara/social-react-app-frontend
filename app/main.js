import React, { useContext, useEffect, Suspense } from "react"
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
import { FlashMessage } from "./components/FlashMessage"
import { Profile } from "./components/Profile"
import { EditPost } from "./components/EditPost"
import { NotFound } from "./components/NotFound"
import { Loading } from "./components/Loading"

const CreatePost = React.lazy(() =>
    import("./components/CreatePost").then((m) => ({ default: m.CreatePost }))
)

const ViewSinglePost = React.lazy(() =>
    import("./components/ViewSinglePost").then((m) => ({
        default: m.ViewSinglePost,
    }))
)

const Search = React.lazy(() =>
    import("./components/Search").then((m) => ({ default: m.Search }))
)

const Chat = React.lazy(() =>
    import("./components/Chat").then((m) => ({ default: m.Chat }))
)

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

            <Suspense fallback={<Loading />}>
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
            </Suspense>

            <Suspense fallback="">{user && <Chat />}</Suspense>

            <Footer />

            <CSSTransition
                timeout={330}
                in={isSearchOpen}
                classNames="search-overlay"
                unmountOnExit
            >
                <div className="search-overlay">
                    <Suspense fallback="">
                        <Search />
                    </Suspense>
                </div>
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
