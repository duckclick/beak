import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import store from 'app/store'
import Layout from 'app/containers/layout'
import Home from 'app/containers/home'
import Recording from 'app/containers/recording'

export const history = syncHistoryWithStore(browserHistory, store)

export default (
  <Router history={history}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Home} />
      <Route path='/recordings/:recordingId' component={Recording} />
    </Route>
  </Router>
)
