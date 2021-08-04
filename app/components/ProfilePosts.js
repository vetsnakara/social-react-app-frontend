import React, { useState, useEffect } from "react"
import { useRouteMatch } from "react-router"
import axios from "axios"

import { Link, useParams } from "react-router-dom"

import { Loading } from "./Loading"
import { Post } from "./Post"

export function ProfilePosts() {
    const { username } = useParams()
    const { url } = useRouteMatch()

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const request = axios.CancelToken.source()

        ;(async function fetchPosts() {
            try {
                const { data: posts } = await axios.get(`${url}/posts`, {
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
            {posts.map((post) => (
                <Post noAuthor key={post._id} post={post} />
            ))}
        </div>
    )
}
