import React, { useState, useEffect } from "react"
import axios from "axios"

import { Link, useParams, useRouteMatch } from "react-router-dom"

import { Loading } from "./Loading"

export function ProfileFollowing() {
    const { username } = useParams()
    const { url } = useRouteMatch()

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const request = axios.CancelToken.source()

        ;(async function fetchPosts() {
            try {
                const { data: posts } = await axios.get(url, {
                    cancelToken: request.token,
                })

                setPosts(posts)
            } catch (error) {
                console.log("There was a problem")
            } finally {
                setIsLoading(false)
            }
        })()

        return () => request.cancel()
    }, [username])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="list-group">
            {posts.map((follower, index) => {
                return (
                    <Link
                        key={index}
                        to={`/profile/${follower.username}`}
                        className="list-group-item list-group-item-action"
                    >
                        <img className="avatar-tiny" src={follower.avatar} />{" "}
                        {follower.username}
                    </Link>
                )
            })}
        </div>
    )
}
