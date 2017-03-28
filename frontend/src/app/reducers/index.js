import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import recordingsList from 'app/reducers/recordings-list'
import recording from 'app/reducers/recording'
import currentFrameId from 'app/reducers/frame'

export default combineReducers({
  recordingsList,
  recording,
  currentFrameId,
  routing: routerReducer
})
