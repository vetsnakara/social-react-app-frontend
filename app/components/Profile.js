import React, { useCallback, useContext, useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { useParams } from "react-router"
import axios from "axios"

import { stateContext } from "./StateProvider"

import { Page } from "./Page"
import { ProfilePosts } from "./ProfilePosts"

export function Profile() {
    const { username } = useParams()

    const { user } = useContext(stateContext)

    const [state, setState] = useImmer({
        loading: false,
        startFollowingRequestCount: 0,
        stopFollowingRequestCount: 0,
        profileData: {
            profileUsername: null,
            profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
            isFollowing: false,
            counts: {
                postCount: "",
                followerCount: "",
                followingCount: "",
            },
        },
    })

    // get profile data request
    useEffect(() => {
        const request = axios.CancelToken.source()

        ;(async function fetchData() {
            try {
                const { data } = await axios.post(
                    `/profile/${username}`,
                    {
                        token: user && user.token,
                    },
                    {
                        cancelToken: request.token,
                    }
                )

                setState((state) => {
                    state.profileData = data
                })
            } catch (error) {
                console.log("There was a problem", error)
            }

            return request.cancel
        })()
    }, [username])

    // follow request
    useEffect(() => {
        if (state.startFollowingRequestCount > 0) {
            const request = axios.CancelToken.source()

            setState((state) => {
                state.loading = true
            })
            ;(async function fetchData() {
                try {
                    const { data } = await axios.post(
                        `/addFollow/${state.profileData.profileUsername}`,
                        {
                            token: user.token,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    setState((state) => {
                        state.profileData.isFollowing = true
                        state.profileData.counts.followerCount++
                    })
                } catch (error) {
                    console.log("There was a problem", error)
                } finally {
                    setState((state) => {
                        state.loading = false
                    })
                }

                return request.cancel
            })()
        }
    }, [state.startFollowingRequestCount])

    // unfollow request
    useEffect(() => {
        if (state.stopFollowingRequestCount > 0) {
            const request = axios.CancelToken.source()

            setState((state) => {
                state.loading = true
            })
            ;(async function fetchData() {
                try {
                    const { data } = await axios.post(
                        `/removeFollow/${state.profileData.profileUsername}`,
                        {
                            token: user.token,
                        },
                        {
                            cancelToken: request.token,
                        }
                    )

                    setState((state) => {
                        state.profileData.isFollowing = false
                        state.profileData.counts.followerCount--
                    })
                } catch (error) {
                    console.log("There was a problem", error)
                } finally {
                    setState((state) => {
                        state.loading = false
                    })
                }

                return request.cancel
            })()
        }
    }, [state.stopFollowingRequestCount])

    const {
        loading,
        profileData: {
            profileUsername,
            profileAvatar,
            isFollowing,
            counts: { postCount, followerCount, followingCount },
        },
    } = state

    const isFollowEnable = user && !isFollowing && user.username !== username
    const isUnfollowEnable = user && isFollowing && user.username !== username

    function startFollowing() {
        setState((state) => {
            state.startFollowingRequestCount++
        })
    }

    function stopFollowing() {
        setState((state) => {
            state.stopFollowingRequestCount++
        })
    }

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={profileAvatar} />{" "}
                {profileUsername || "..."}
                {isFollowEnable && (
                    <button
                        className="btn btn-primary btn-sm ml-2"
                        onClick={startFollowing}
                        disabled={loading}
                    >
                        Follow <i className="fas fa-user-plus"></i>
                    </button>
                )}
                {isUnfollowEnable && (
                    <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={stopFollowing}
                        disabled={loading}
                    >
                        Stop Follow <i className="fas fa-user-times"></i>
                    </button>
                )}
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
