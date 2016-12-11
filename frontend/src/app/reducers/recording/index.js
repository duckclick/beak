import {
  REQUEST_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST_FAILURE
} from 'app/actions'

export const INITIAL_STATE = {
  playlist: [],
  loading: false,
  errorMessage: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_RECORDING_PLAYLIST:
      return { ...state, loading: true }

    case RECEIVE_RECORDING_PLAYLIST:
      return { ...state, loading: false, playlist: action.playlist }

    case RECEIVE_RECORDING_PLAYLIST_FAILURE:
      return { ...state, loading: false, errorMessage: action.errorMessage }

    default:
      return state
  }
}
