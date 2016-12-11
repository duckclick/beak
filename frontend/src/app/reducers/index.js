import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import recording from 'app/reducers/recording'

export default combineReducers({
  recording,
  routing: routerReducer
})
