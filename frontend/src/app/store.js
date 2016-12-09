import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import reducers from 'app/reducers'

const browserMiddleware = routerMiddleware(browserHistory)

const store = createStore(
  reducers,
  {}, // initial state
  compose(
    applyMiddleware(thunkMiddleware, browserMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : (f) => f
  )
)

export default store
