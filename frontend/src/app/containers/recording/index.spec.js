import React from 'react'
import jasmineEnzyme from 'jasmine-enzyme'
import { mount } from 'enzyme'

import {
  Recording,
  mapStateToProps,
  FIRST_FRAME_WAIT,
  FRAME_WAIT
} from 'app/containers/recording'

const mountComponent = (props) => mount(
  <Recording {...props} />
)

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
        currentFrameId: 'f15',
        recording: {
          playlist: ['f14', 'f15', 'f16'],
          playlistShowing: ['f14', 'f15', 'f16'],
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
        currentFrameId: 'f15',
        recording: {
          playlist: ['f14', 'f15', 'f16'],
          playlistShowing: ['f14', 'f15', 'f16'],
          loading: false
        }
      })
    })
  })

  describe('when recording is loaded', () => {
    beforeEach(() => {
      jasmine.clock().install()
    })

    afterEach(() => {
      jasmine.clock().uninstall()
    })

    xit('eventually calls scheduleNextFrame', () => {
      mountComponent(props).setProps({
        ...props,
        currentFrameId: 'f15',
        recording: {
          loading: false,
          playlist: ['f14', 'f15', 'f16', 'f17'],
          playlistShowing: ['f14', 'f15', 'f16']
        }
      })

      expect(props.setCurrentFrame).not.toHaveBeenCalled()
      jasmine.clock().tick(FIRST_FRAME_WAIT + 1)
      jasmine.clock().tick(FRAME_WAIT + 1)
      expect(props.setCurrentFrame).toHaveBeenCalled()
    })
  })
})
