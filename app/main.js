import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { HomeGuest } from "./components/HomeGuest"
import { About } from "./components/About"
import { Terms } from "./components/Terms"

function App() {
  return (
    <BrowserRouter>
      <Header/>

      <Switch>
        <Route exact path="/">
          <HomeGuest/>
        </Route>
        <Route path="/about">
          <About/>
        </Route>
        <Route path="/terms">
          <Terms/>
        </Route>
      </Switch>

      <Footer/>
    </BrowserRouter>
  )
}

ReactDOM.render(<App/>, document.querySelector("#root"));

if (module.hot) {
  module.hot.accept();
}