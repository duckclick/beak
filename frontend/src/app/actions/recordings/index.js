import API from 'app/api'

import {
  REQUEST_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST_FAILURE
} from 'app/actions'

const requestRecordingPlaylist = () => ({
  type: REQUEST_RECORDING_PLAYLIST
})

const receiveRecordingPlaylist = (data) => ({
  type: RECEIVE_RECORDING_PLAYLIST,
  playlist: data
})

const receiveRecordingPlaylistFailure = (apiError) => ({
  type: RECEIVE_RECORDING_PLAYLIST_FAILURE,
  errorMessage: apiError
})

export const fetchPlaylistFor = (id) => (dispatch) => {
  dispatch(requestRecordingPlaylist())

  return API.Recordings
    .playlist({ id })
    .then((response) => dispatch(receiveRecordingPlaylist(response.data())))
    .catch((response) => {
      dispatch(receiveRecordingPlaylistFailure(response.data()))
    })
}
