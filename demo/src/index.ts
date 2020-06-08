import React from "react"
import ReactDOM from "react-dom"
import {h} from "./core"
import {app} from "./app"

ReactDOM.render(
  h.r(React.StrictMode, app()),
  document.getElementById("root"))
