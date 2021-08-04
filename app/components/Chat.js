// todo: use hotkey to open/close chat

import React, { useContext, useEffect, useRef } from "react"

import { stateContext, dispatchContext } from "./StateProvider"

export function Chat() {
    const { isChatOpen } = useContext(stateContext)
    const dispatch = useContext(dispatchContext)

    const inputRef = useRef(null)

    const classes = `chat-wrapper shadow border-top border-left border-right ${
        isChatOpen ? "chat-wrapper--is-visible" : ""
    }`

    useEffect(() => {
        if (isChatOpen) {
            inputRef.current.focus()
        }
    }, [isChatOpen])

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
                <div className="chat-self">
                    <div className="chat-message">
                        <div className="chat-message-inner">
                            Hey, how are you?
                        </div>
                    </div>
                    <img
                        className="chat-avatar avatar-tiny"
                        src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                    />
                </div>

                <div className="chat-other">
                    <a href="#">
                        <img
                            className="avatar-tiny"
                            src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"
                        />
                    </a>
                    <div className="chat-message">
                        <div className="chat-message-inner">
                            <a href="#">
                                <strong>barksalot:</strong>
                            </a>
                            Hey, I am good, how about you?
                        </div>
                    </div>
                </div>
            </div>
            <form id="chatForm" className="chat-form border-top">
                <input
                    ref={inputRef}
                    type="text"
                    className="chat-field"
                    id="chatField"
                    placeholder="Type a message…"
                    autoComplete="off"
                />
            </form>
        </div>
    )
}
