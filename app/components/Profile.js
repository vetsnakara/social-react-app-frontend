import React, { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import axios from "axios"

import { stateContext } from "./StateProvider"

import { Page } from "./Page"

export function Profile() {
    const { username } = useParams()

    const [profileData, setProfileData] = useState({
        profileUsername: "...",
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        counts: {
            postCount: "",
            followerCount: "",
            followingCount: "",
        },
    })

    const {
        user: { token },
    } = useContext(stateContext)

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.post(`/profile/${username}`, {
                    token,
                })

                setProfileData(data)
            } catch (error) {
                console.log("There was a problem", error)
            }
        }

        fetchData()
    }, [])

    const {
        profileUsername,
        profileAvatar,
        counts: { postCount, followerCount, followingCount },
    } = profileData

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={profileAvatar} />{" "}
                {profileUsername}
                <button className="btn btn-primary btn-sm ml-2">
                    Follow <i className="fas fa-user-plus"></i>
                </button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {postCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {followingCount}
                </a>
            </div>

            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action">
                    <img
                        className="avatar-tiny"
                        src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                    />{" "}
                    <strong>Example Post #1</strong>
                    <span className="text-muted small">on 2/10/2020 </span>
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                    <img
                        className="avatar-tiny"
                        src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                    />{" "}
                    <strong>Example Post #2</strong>
                    <span className="text-muted small">on 2/10/2020 </span>
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                    <img
                        className="avatar-tiny"
                        src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"
                    />{" "}
                    <strong>Example Post #3</strong>
                    <span className="text-muted small">on 2/10/2020 </span>
                </a>
            </div>
        </Page>
    )
}
