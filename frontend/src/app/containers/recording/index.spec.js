import React from 'react'
import jasmineEnzyme from 'jasmine-enzyme'
import { install, uninstall, mockClient } from 'mappersmith/test'
import { mount } from 'enzyme'

import API from 'app/api'

import { Recording, mapStateToProps, FIRST_FRAME_WAIT, FRAME_WAIT } from 'app/containers/recording'

const mountComponent = props => mount(<Recording {...props} />)

describe('Recording', () => {
  let props

  beforeEach(() => {
    jasmineEnzyme()
    props = {
      fetchPlaylistFor: jasmine.createSpy('fetchPlaylistFor'),
      setCurrentFrame: jasmine.createSpy('setCurrentFrame'),

      recordingId: 'abcd-efgh-uuid',
      currentFrameId: undefined,
      recording: {
        playlist: [],
        playlistShowing: [],
        loading: true
      }
    }
  })

  it('calls fetchPlaylistFor', () => {
    props.recording.loading = false
    let recording = mountComponent(props)
    recording.instance().handleIframeLoaded()
    expect(props.fetchPlaylistFor).toHaveBeenCalledWith(props.recordingId)
  })

  describe('mapStateToProps', () => {
    it('maps state to correct props', () => {
      const state = {
        currentFrameId: 2,
        recording: {
          playlist: [{ created_at: 1 }, { created_at: 2 }, { created_at: 3 }],
          playlistShowing: [{ created_at: 1 }, { created_at: 2 }, { created_at: 3 }],
          loading: false
        }
      }
      const ownProps = {
        params: {
          recordingId: 'abcd-efgh-uuid'
        }
      }

      expect(mapStateToProps(state, ownProps)).toEqual({
        recordingId: 'abcd-efgh-uuid',
        currentFrameId: 2,
        recording: {
          playlist: [{ created_at: 1 }, { created_at: 2 }, { created_at: 3 }],
          playlistShowing: [{ created_at: 1 }, { created_at: 2 }, { created_at: 3 }],
          loading: false
        }
      })
    })
  })

  describe('when recording is loaded', () => {
    beforeEach(() => {
      install()
      jasmine.clock().install()
    })

    afterEach(() => {
      uninstall()
      jasmine.clock().uninstall()
    })

    xit('eventually calls scheduleNextFrame', () => {
      mockClient(API)
        .resource('Recordings')
        .method('frame')
        .with({ recordingId: 'abcd-efgh-uuid', id: 3 })
        .response()

      mountComponent(props).setProps({
        ...props,
        currentFrameId: 2,
        recording: {
          loading: false,
          playlist: [{ created_at: 1 }, { created_at: 2 }, { created_at: 3 }, { created_at: 4 }],
          playlistShowing: [{ created_at: 1 }, { created_at: 2 }, { created_at: 3 }]
        }
      })

      expect(props.setCurrentFrame).not.toHaveBeenCalled()
      jasmine.clock().tick(FIRST_FRAME_WAIT + 1)
      jasmine.clock().tick(FRAME_WAIT + 1)
      expect(props.setCurrentFrame).toHaveBeenCalled()
    })
  })
})
