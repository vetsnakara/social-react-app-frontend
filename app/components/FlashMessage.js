import React, { useContext } from "react"

import Context from "../context"

export function FlashMessage() {
    const {
        state: { flashMessages: messages },
    } = useContext(Context)

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
