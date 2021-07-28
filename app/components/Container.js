import React from 'react'

export function Container ({
  wide = false,
  children
}) {
  let classes = ["container", "py-md-5"];

  if (!wide) classes.push("container--narrow");

  classes = classes.join(" ");

  return (
    <div className={classes}>
      {children}
    </div>
  )
}