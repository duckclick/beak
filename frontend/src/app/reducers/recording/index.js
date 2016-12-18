import {
  REQUEST_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST_FAILURE,
  SET_CURRENT_FRAME
} from 'app/actions'

const SLIDING_WINDOW_SIZE = 10
const SLIDING_POINT = 2

const INITIAL_STATE = {
  playlist: [],
  playlistShowing: [],
  loading: false,
  errorMessage: null
}

const slicePlaylistPreservingFrame = (playlist, frameId) => {
  const currentFrameIndex = playlist.indexOf(frameId)
  const beginning = currentFrameIndex >= SLIDING_POINT ? currentFrameIndex - SLIDING_POINT : 0
  const ending = beginning + SLIDING_WINDOW_SIZE
  return playlist.slice(beginning, ending)
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REQUEST_RECORDING_PLAYLIST:
      return { ...state, loading: true }

    case RECEIVE_RECORDING_PLAYLIST:
      return {
        ...state,
        loading: false,
        playlist: action.playlist,
        playlistShowing: action.playlist.slice(0, SLIDING_WINDOW_SIZE)
      }

    case RECEIVE_RECORDING_PLAYLIST_FAILURE:
      return { ...state, loading: false, errorMessage: action.errorMessage }

    case SET_CURRENT_FRAME:
      return { ...state, playlistShowing: slicePlaylistPreservingFrame(state.playlist, action.frameId) }

    default:
      return state
  }
}
