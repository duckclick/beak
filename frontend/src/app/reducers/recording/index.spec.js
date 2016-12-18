import recording from 'app/reducers/recording'

import {
  REQUEST_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST,
  RECEIVE_RECORDING_PLAYLIST_FAILURE,
  SET_CURRENT_FRAME
} from 'app/actions'

describe('reducer recording', () => {
  describe('for unknown event', () => {
    it('returns the current state unchanged', () => {
      const state = { untouched: true }

      expect(recording(state, { type: 'unknown' })).toEqual(state)
    })
  })

  describe('for REQUEST_RECORDING_PLAYLIST event', () => {
    it('returns loading=true', () => {
      const state = { loading: false }
      const event = { type: REQUEST_RECORDING_PLAYLIST }

      expect(recording(state, event))
        .toEqual(jasmine.objectContaining({ loading: true }))
    })
  })

  describe('for RECEIVE_RECORDING_PLAYLIST event', () => {
    const state = { loading: true }
    const event = {
      type: RECEIVE_RECORDING_PLAYLIST,
      playlist: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11']
    }

    it('returns loading=false', () => {
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        loading: false
      }))
    })

    it('returns the entire playlist', () => {
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        playlist: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11']
      }))
    })

    it('returns the playlistShowing as a slice of the playlist', () => {
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        playlistShowing: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
      }))
    })
  })

  describe('for RECEIVE_RECORDING_PLAYLIST_FAILURE event', () => {
    it('returns loading=false and error message', () => {
      const state = { loading: true }
      const event = { type: RECEIVE_RECORDING_PLAYLIST_FAILURE, errorMessage: 'raise hell' }

      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        loading: false,
        errorMessage: 'raise hell'
      }))
    })
  })

  describe('for SET_CURRENT_FRAME event', () => {
    const state = {
      playlist: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11'],
      playlistShowing: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
    }

    it('does not move the window if displaying frame is before position 3 (ensure buffer before and after the current frame)', () => {
      let event = { type: SET_CURRENT_FRAME, frameId: 'f1' }
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        playlistShowing: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
      }))

      event = { type: SET_CURRENT_FRAME, frameId: 'f2' }
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        playlistShowing: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
      }))

      event = { type: SET_CURRENT_FRAME, frameId: 'f3' }
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        playlistShowing: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10']
      }))
    })

    it('moves the window if displaying frame is after position 3', () => {
      const event = { type: SET_CURRENT_FRAME, frameId: 'f4' }
      expect(recording(state, event)).toEqual(jasmine.objectContaining({
        playlistShowing: ['f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11']
      }))
    })
  })
})
