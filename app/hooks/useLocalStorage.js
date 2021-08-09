import { useContext, useEffect } from "react"

import { stateContext } from "../components/StateProvider"

export function useLocalStorage() {
    const { user } = useContext(stateContext)

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user))
        } else {
            localStorage.removeItem("user")
        }
    }, [user])
}
