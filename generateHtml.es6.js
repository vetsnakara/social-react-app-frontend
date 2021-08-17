import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "fs"
import { Footer } from "./app/components/Footer"
import { Header } from "./app/components/Header"
import { Loading } from "./app/components/Loading"
import { StaticRouter as Router } from "react-router-dom"
import { stateContext } from "./app/components/StateProvider"

const state = {
    user: null,
}

function Shell() {
    return (
        <stateContext.Provider value={state}>
            <Router>
                <Header staticEmpty={true} />
                <div className="py-5 my-5 text-center">
                    <Loading />
                </div>
                <Footer />
            </Router>
        </stateContext.Provider>
    )
}

function html(x) {
    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>OurApp</title>
      <link href="/font.css" rel="stylesheet" />
      <link rel="stylesheet" href="/bootstrap.min.css" />
      <link rel="stylesheet" href="/main.css" />
      <script defer src="/all.js"></script>
    </head>
    <body>
      <div id="root">
      ${x}
      </div>
    </body>
  </html>
  `
}

/*
  We can use ReactDomServer (you can see how we imported
  that at the very top of this file) to generate a string
  of HTML text. We simply give it a React component and
  here we are using the JSX syntax.
*/
const reactHtml = ReactDOMServer.renderToString(<Shell />)

/*
  Call our "html" function which has the skeleton or
  boilerplate HTML, and give it the string that React
  generated for us. Our "html" function will insert
  the React string inside the #app div. So now we will
  have a variable in memory with the exact string we
  want, we just need to save it to a file.

*/
const overallHtmlString = html(reactHtml)

/*
  This course is not about Node, but here we are simply
  saving our generated string into a file named
  index-template.html. Please note that this Node task
  will fail if the directory we told it to live within
  ("app" in this case) does not already exist.
*/
const fileName = "./app/index-template.html"
const stream = fs.createWriteStream(fileName)
stream.once("open", () => {
    stream.end(overallHtmlString)
})
