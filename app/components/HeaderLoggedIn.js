import React, { useContext } from "react"
import { Link } from "react-router-dom"

import { dispatchContext } from "./StateProvider"
import { stateContext } from "./StateProvider"

export function HeaderLoggedIn() {
    const dispatch = useContext(dispatchContext)

    const {
        user: { avatar, username },
    } = useContext(stateContext)

    function handleLogout() {
        dispatch({ type: "logout" })
    }

    function handleSearch(e) {
        e.preventDefault()
        dispatch({ type: "openSearch" })
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a
                onClick={handleSearch}
                href="#"
                className="text-white mr-2 header-search-icon"
            >
                <i className="fas fa-search"></i>
            </a>
            <span className="mr-2 header-chat-icon text-white">
                <i className="fas fa-comment"></i>
                <span className="chat-count-badge text-white"> </span>
            </span>
            <Link to={`/profile/${username}`} className="mr-2">
                <img className="small-header-avatar" src={avatar} />
            </Link>
            <Link to="/create-post" className="btn btn-sm btn-success mr-2">
                Create Post
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    )
}
