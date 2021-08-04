// todo: use hotkey to open/close chat

import React, { useContext, useEffect, useRef } from "react"
import { useImmer } from "use-immer"
import { io } from "socket.io-client"

import { stateContext, dispatchContext } from "./StateProvider"

const socket = io("http://localhost:8080")

export function Chat() {
    const { user, isChatOpen } = useContext(stateContext)
    const dispatch = useContext(dispatchContext)

    const [state, setState] = useImmer({
        fieldValue: "",
        chatMessages: [],
    })

    const inputRef = useRef(null)

    const classes = `chat-wrapper shadow border-top border-left border-right ${
        isChatOpen ? "chat-wrapper--is-visible" : ""
    }`

    useEffect(() => {
        if (isChatOpen) {
            inputRef.current.focus()
        }
    }, [isChatOpen])

    useEffect(() => {
        socket.on("chatFromServer", (message) => {
            setState((state) => {
                state.chatMessages.push(message)
            })
        })

        return () => {}
    }, [])

    function handleFieldChange(e) {
        setState((state) => {
            state.fieldValue = e.target.value
        })
    }

    function handleSubmit(e) {
        const { fieldValue } = state
        e.preventDefault()

        // send message to chat server
        socket.emit("chatFromBrowser", {
            message: state.fieldValue,
            token: user.token,
        })

        setState((state) => {
            state.fieldValue = ""
            state.chatMessages.push({
                message: fieldValue,
                username: user.username,
                avatar: user.avatar,
            })
        })
    }

    return (
        <div id="chat-wrapper" className={classes}>
            <div className="chat-title-bar bg-primary">
                Chat
                <span
                    onClick={() => dispatch({ type: "toggleChat" })}
                    className="chat-title-bar-close"
                >
                    <i className="fas fa-times-circle"></i>
                </span>
            </div>
            <div id="chat" className="chat-log">
                {state.chatMessages.map((message, index) => {
                    if (message.username === user.username) {
                        return (
                            <div key={index} className="chat-self">
                                <div className="chat-message">
                                    <div className="chat-message-inner">
                                        {message.message}
                                    </div>
                                </div>
                                <img
                                    className="chat-avatar avatar-tiny"
                                    src={message.avatar}
                                />
                            </div>
                        )
                    }

                    return (
                        <div key={index} className="chat-other">
                            <a href="#">
                                <img
                                    className="avatar-tiny"
                                    src={message.avatar}
                                />
                            </a>
                            <div className="chat-message">
                                <div className="chat-message-inner">
                                    <a href="#">
                                        <strong>{message.username}:</strong>
                                    </a>{" "}
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <form
                onSubmit={handleSubmit}
                id="chatForm"
                className="chat-form border-top"
            >
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-field"
                    id="chatField"
                    placeholder="Type a message…"
                    autoComplete="off"
                    value={state.fieldValue}
                    onChange={handleFieldChange}
                />
            </form>
        </div>
    )
}
