import React, { useContext } from "react"
import { Link } from "react-router-dom"

import ReactTooltip from "react-tooltip"

import { dispatchContext } from "./StateProvider"
import { stateContext } from "./StateProvider"

export function HeaderLoggedIn() {
    const dispatch = useContext(dispatchContext)

    const {
        user: { avatar, username },
        unreadChatCount,
    } = useContext(stateContext)

    function handleLogout() {
        dispatch({ type: "logout" })
        dispatch({
            type: "flashMessage",
            value: "You have successfully logged out!",
        })
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
                data-tip="Search"
                data-for="search"
            >
                <i className="fas fa-search"></i>
            </a>{" "}
            <span
                data-for="chat"
                data-tip="Chat"
                className={`mr-2 header-chat-icon ${
                    unreadChatCount ? "text-danger" : "text-white"
                }`}
                onClick={() => dispatch({ type: "toggleChat" })}
            >
                <i className="fas fa-comment"></i>
                {unreadChatCount ? (
                    <span className="chat-count-badge text-white">
                        {unreadChatCount < 10 ? unreadChatCount : "9+"}
                    </span>
                ) : null}
            </span>{" "}
            <Link
                to={`/profile/${username}`}
                className="mr-2"
                data-for="profile"
                data-tip="My profile"
            >
                <img className="small-header-avatar" src={avatar} />
            </Link>
            <Link to="/create-post" className="btn btn-sm btn-success mr-2">
                Create Post
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
            <ReactTooltip
                id="search"
                place="bottom"
                className="custom-tooltip"
            />
            <ReactTooltip id="chat" place="bottom" className="custom-tooltip" />
            <ReactTooltip
                id="profile"
                place="bottom"
                className="custom-tooltip"
            />
        </div>
    )
}
