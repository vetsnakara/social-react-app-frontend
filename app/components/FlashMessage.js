import React from "react"

export function FlashMessage({ messages = [] }) {
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
