import { useContext, useEffect } from "react"

import { stateContext } from "../components/StateProvider"

const isSSR = typeof window === "undefined"

export function useLocalStorage() {
    const { user } = useContext(stateContext)

    useEffect(() => {
        if (!isSSR) {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user))
            } else {
                localStorage.removeItem("user")
            }
        }
    }, [user])
}
