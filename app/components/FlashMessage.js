import React, { useContext } from "react"

import { stateContext } from "./StateProvider"

export function FlashMessage() {
    const { flashMessages: messages } = useContext(stateContext)

    return (
        <div className="floating-alerts">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className="alert alert-success text-center floating-alert shadow-sm"
                >
                    {msg}
                </div>
            ))}
        </div>
    )
}
