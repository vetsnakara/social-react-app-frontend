import React, { useState, useEffect, useContext } from "react"
import axios from "axios"

import { dispatchContext } from "./StateProvider"

export const LoginForm = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useContext(dispatchContext)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const { data } = await axios.post("/login", {
                username,
                password,
            })

            if (data) {
                const { token, username, avatar } = data

                localStorage.setItem("appToken", token)
                localStorage.setItem("appAvatar", avatar)
                localStorage.setItem("appUsername", username)

                dispatch({ type: "login" })
            } else {
                console.log("Incorrect username or password")
            }
        } catch (error) {
            console.log("There was a problem", error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input
                        name="username"
                        className="form-control form-control-sm input-dark"
                        type="text"
                        placeholder="Username"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input
                        name="password"
                        className="form-control form-control-sm input-dark"
                        type="password"
                        placeholder="Password"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    )
}
