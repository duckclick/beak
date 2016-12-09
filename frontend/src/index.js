import 'index.scss'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import store from 'app/store'
import Routes from 'app/routes'

const Root = (
  <Provider store={store}>
    {Routes}
  </Provider>
)

render(Root, document.getElementById('root'))
