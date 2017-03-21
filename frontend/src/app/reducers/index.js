import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import allRecordings from 'app/reducers/fetch-recordings'
import recording from 'app/reducers/recording'
import currentFrameId from 'app/reducers/frame'

export default combineReducers({
  allRecordings,
  recording,
  currentFrameId,
  routing: routerReducer
})
