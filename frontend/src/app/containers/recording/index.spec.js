import React from 'react'
import jasmineEnzyme from 'jasmine-enzyme'
import { mount } from 'enzyme'

import {
  Recording,
  mapStateToProps,
  FIRST_FRAME_WAIT,
  FRAME_WAIT
} from 'app/containers/recording'
import Frame from 'app/components/frame'

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
    mountComponent(props)
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

    it('eventually calls scheduleNextFrame', () => {
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

  describe('when displaying specific frame', () => {
    let wrapper

    beforeEach(() => {
      props = {
        ...props,
        currentFrameId: 'f15',
        recording: {
          loading: false,
          playlist: ['f14', 'f15', 'f16', 'f17'],
          playlistShowing: ['f14', 'f15', 'f16']
        }
      }
      wrapper = mountComponent(props)
    })

    it('renders all frames in playlistShowing, but shows only the current one', () => {
      expect(wrapper).toContainReact(
        <Frame frameId='f14' recordingId='abcd-efgh-uuid' show={false} />
      )
      expect(wrapper).toContainReact(
        <Frame frameId='f15' recordingId='abcd-efgh-uuid' show />
      )
      expect(wrapper).toContainReact(
        <Frame frameId='f16' recordingId='abcd-efgh-uuid' show={false} />
      )
      expect(wrapper).not.toContainReact(
        <Frame frameId='f17' recordingId='abcd-efgh-uuid' show={false} />
      )
    })
  })
})
