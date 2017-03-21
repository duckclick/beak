import {
  RECEIVE_ALL_RECORDINGS,
  RECEIVE_ALL_RECORDINGS_FAILURE
} from 'app/actions'

const INITIAL_STATE = {
  recordings: [],
  errorMessage: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RECEIVE_ALL_RECORDINGS:
      return {
        ...state,
        recordings: action.payload.data
      }

    case RECEIVE_ALL_RECORDINGS_FAILURE:
      return { ...state, errorMessage: action.errorMessage }

    default:
      return state
  }
}
