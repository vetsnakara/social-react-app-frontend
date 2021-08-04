import React from "react"
import { Link } from "react-router-dom"

export function Post({
    post: { _id: id, createdDate, avatar, title, author },
    noAuthor = false,
    ...props
}) {
    const date = new Date(createdDate)

    const dateFormatted = `${
        date.getMonth() + 1
    }/${date.getDay()}/${date.getFullYear()}`

    return (
        <Link
            to={`/post/${id}`}
            className="list-group-item list-group-item-action"
            {...props}
        >
            <img className="avatar-tiny" src={author.avatar} />{" "}
            <strong>{title}</strong>{" "}
            <span className="text-muted small">
                {`${
                    !noAuthor ? `by ${author.username}` : ""
                } on ${dateFormatted}`}
            </span>
        </Link>
    )
}
