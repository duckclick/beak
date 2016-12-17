import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import recording from 'app/reducers/recording'
import currentFrameId from 'app/reducers/frame'

export default combineReducers({
  recording,
  currentFrameId,
  routing: routerReducer
})
