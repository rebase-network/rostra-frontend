
import * as React from "react"
import ReactDOM from "react-dom"
import { HashRouter, Switch, Route } from 'react-router-dom'
import ReactGA from 'react-ga'
import './i18n'
import { App } from "./pages/App"
import reportWebVitals from "./reportWebVitals"
import * as serviceWorker from "./serviceWorker"
import { ChakraProvider } from '@chakra-ui/react'
import theme from './themes'
import TransHOC from './components/Trans'

window.addEventListener('error', error => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true
  })
})


ReactDOM.render(
  <React.StrictMode>
      <HashRouter>
        <ChakraProvider theme={theme}>
          <TransHOC>
            <Switch>
              <Route exact strict path="/*" component={App} />
              {/* <Route exact strict path="/" component={Home} /> */}
            </Switch>
          </TransHOC>
        </ChakraProvider>
      </HashRouter>

  </React.StrictMode>,
  document.getElementById("root"),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
