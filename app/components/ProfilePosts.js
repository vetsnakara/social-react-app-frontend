import React, { useState, useEffect } from "react"
import axios from "axios"

import { Link, useParams } from "react-router-dom"

import { Loading } from "./Loading"

export function ProfilePosts() {
    const { username } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        ;(async function fetchPosts() {
            try {
                const { data: posts } = await axios.get(
                    `/profile/${username}/posts`
                )

                setPosts(posts)
            } catch (error) {
                console.log("There was a problem")
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="list-group">
            {posts.map(({ _id: id, createdDate, avatar, title, author }) => {
                const date = new Date(createdDate)

                const dateFormatted = `${
                    date.getMonth() + 1
                }/${date.getDay()}/${date.getFullYear()}`

                return (
                    <Link
                        key={id}
                        to={`/post/${id}`}
                        className="list-group-item list-group-item-action"
                    >
                        <img className="avatar-tiny" src={author.avatar} />{" "}
                        <strong>{title}</strong>{" "}
                        <span className="text-muted small">
                            on {dateFormatted}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}
