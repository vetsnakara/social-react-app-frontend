import React, { createContext, useReducer } from "react"
import { useImmerReducer } from "use-immer"

import { appReducer } from "../reducer"

const stateContext = createContext()
const dispatchContext = createContext()

const user =
    typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null

const initState = {
    redirectUrl: null,
    flashMessages: [],
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
}

export function StateProvider({ children }) {
    const [state, dispatch] = useImmerReducer(appReducer, initState)

    return (
        <stateContext.Provider value={state}>
            <dispatchContext.Provider value={dispatch}>
                {children}
            </dispatchContext.Provider>
        </stateContext.Provider>
    )
}

export { stateContext, dispatchContext }
