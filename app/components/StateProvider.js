import React, { createContext, useReducer } from "react"
import { useImmerReducer } from "use-immer"

import { appReducer } from "../reducer"

const stateContext = createContext()
const dispatchContext = createContext()

const initState = {
    redirectUrl: null,
    flashMessages: [],
    user: JSON.parse(localStorage.getItem("user")),
    isSearchOpen: false,
    isChatOpen: false,
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
