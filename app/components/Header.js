import React, { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"

import { LoginForm } from "./LoginForm"
import { HeaderLoggedIn } from "./HeaderLoggedIn"

import { stateContext } from "./StateProvider"

export function Header() {
    const { user } = useContext(stateContext)

    return (
        <header className="header-bar bg-primary mb-3">
            <div className="container d-flex flex-column flex-md-row align-items-center p-3">
                <h4 className="my-0 mr-md-auto font-weight-normal">
                    <Link to="/" className="text-white">
                        ComplexApp
                    </Link>
                </h4>
                {user ? <HeaderLoggedIn /> : <LoginForm />}
            </div>
        </header>
    )
}
