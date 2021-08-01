import React, { useCallback, useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import axios from "axios"

import { stateContext } from "./StateProvider"

import { Page } from "./Page"
import { ProfilePosts } from "./ProfilePosts"

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

            <ProfilePosts />
        </Page>
    )
}
