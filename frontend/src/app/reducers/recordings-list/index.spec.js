import recordingsList from 'app/reducers/recordings-list'

import {
  RECEIVE_LIST_RECORDINGS,
  RECEIVE_LIST_RECORDINGS_FAILURE
} from 'app/actions'

describe('reducer recording', () => {
  describe('for unknown event', () => {
    it('returns the current state unchanged', () => {
      const state = { untouched: true }

      expect(recordingsList(state, { type: 'unknown' })).toEqual(state)
    })
  })

  describe('for RECEIVE_LIST_RECORDINGS event', () => {
    const state = { recordings: [], errorMessage: undefined }
    const event = {
      type: RECEIVE_LIST_RECORDINGS,
      payload: {
        data: [
          {
            playlist_id: 'pl1',
            frames: ['1490641359538', '1490641359539', '1490641359540']
          },
          {
            playlist_id: 'pl2',
            frames: ['1490641359528', '1490641359529', '1490641359530']
          }
        ]
      }
    }

    it('returns the recordings list', () => {
      expect(recordingsList(state, event)).toEqual(jasmine.objectContaining({
        recordings: [
          {
            playlist_id: 'pl1',
            frames: ['1490641359538', '1490641359539', '1490641359540']
          },
          {
            playlist_id: 'pl2',
            frames: ['1490641359528', '1490641359529', '1490641359530']
          }
        ]
      }))
    })
  })

  describe('for RECEIVE_LIST_RECORDINGS_FAILURE event', () => {
    it('returns loading=false and error message', () => {
      const state = { recordings: [], errorMessage: undefined }
      const event = { type: RECEIVE_LIST_RECORDINGS_FAILURE, errorMessage: 'raise hell' }

      expect(recordingsList(state, event)).toEqual(jasmine.objectContaining({
        errorMessage: 'raise hell'
      }))
    })
  })
})
