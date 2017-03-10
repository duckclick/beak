import {
  REQUEST_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST_FAILURE,
  SET_CURRENT_FRAME
} from 'app/actions'

const ALL_FRAMES_BUFFER_SIZE = 10
const OLD_FRAMES_BUFFER_SIZE = 2

const INITIAL_STATE = {
  playlist: [],
  playlistShowing: [],
  loading: false,
  errorMessage: null
}

const slicePlaylistPreservingFrame = (playlist, frameId) => {
  const currentFrameIndex = playlist.find((item) => item.created_at === frameId)
  const beginning = currentFrameIndex >= OLD_FRAMES_BUFFER_SIZE
    ? currentFrameIndex - OLD_FRAMES_BUFFER_SIZE
    : 0

  const ending = beginning + ALL_FRAMES_BUFFER_SIZE

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
        playlistShowing: action.playlist.slice(0, ALL_FRAMES_BUFFER_SIZE)
      }

    case RECEIVE_RECORDING_PLAYLIST_FAILURE:
      return { ...state, loading: false, errorMessage: action.errorMessage }

    case SET_CURRENT_FRAME:
      return { ...state, playlistShowing: slicePlaylistPreservingFrame(state.playlist, action.frameId) }

    default:
      return state
  }
}
