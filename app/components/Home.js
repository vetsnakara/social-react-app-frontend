import React, { useCallback, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useImmer } from "use-immer"
import axios from "axios"

import { stateContext } from "./StateProvider"

import { Page } from "./Page"
import { Loading } from "./Loading"
import { Post } from "./Post"

export function Home() {
    const {
        user: { username, token },
    } = useContext(stateContext)

    const [state, setState] = useImmer({
        isLoading: true,
        feed: [],
    })

    useEffect(() => {
        const request = axios.CancelToken.source()

        ;(async function fetchData() {
            try {
                const { data } = await axios.post(
                    "/getHomeFeed",
                    {
                        token,
                    },
                    {
                        cancelToken: request.token,
                    }
                )

                setState((state) => {
                    state.isLoading = false
                    state.feed = data
                })
            } catch (error) {
                console.log("There was a problem", error)
            }

            return request.cancel
        })()
    }, [username])

    if (state.isLoading) {
        return <Loading />
    }

    return (
        <Page title="Your Feed">
            {state.feed.length > 0 && (
                <>
                    <h2 className="text-center mb-4">
                        The latest from those you follow
                    </h2>
                    <div className="list-group">
                        {state.feed.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}
                    </div>
                </>
            )}
            {state.feed.length == 0 && (
                <>
                    <h2 className="text-center">
                        Hello <strong>{username}</strong>, your feed is empty.
                    </h2>
                    <p className="lead text-muted text-center">
                        Your feed displays the latest posts from the people you
                        follow. If you don&rsquo;t have any friends to follow
                        that&rsquo;s okay; you can use the &ldquo;Search&rdquo;
                        feature in the top menu bar to find content written by
                        people with similar interests and then follow them.
                    </p>
                </>
            )}
        </Page>
    )
}
