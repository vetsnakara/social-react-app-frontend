import { useContext, useEffect } from "react"

import { stateContext } from "../components/StateProvider"

export function useLocalStorage() {
    const state = useContext(stateContext)

    const { user } = state

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
        } else {
            localStorage.removeItem("user")
        }
    }, [user])

    return state
}
