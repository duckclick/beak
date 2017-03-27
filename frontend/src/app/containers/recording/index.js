/* global PROXY_HOST */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchPlaylistFor } from 'app/actions/recordings'
import { setCurrentFrame } from 'app/actions/frames'
import API from 'app/api'

export const FIRST_FRAME_WAIT = 1000
export const DEFAULT_FRAME_WAIT = 1000

const getIframe = () => {
  return document.querySelector('.frame iframe')
}

export class Recording extends Component {
  static get propTypes () {
    return {
      fetchPlaylistFor: PropTypes.func.isRequired,
      setCurrentFrame: PropTypes.func.isRequired,

      recordingId: PropTypes.string.isRequired,
      currentFrameId: PropTypes.number,
      recording: PropTypes.shape({
        playlist: PropTypes.arrayOf(
          PropTypes.shape({ created_at: PropTypes.number })
        ).isRequired,
        playlistShowing: PropTypes.arrayOf(
          PropTypes.shape({ created_at: PropTypes.number })
        ).isRequired,
        loading: PropTypes.bool
      })
    }
  }

  render () {
    const { recording } = this.props

    if (recording.loading) {
      return <div>Loading...</div>
    }

    return (
      <div className='page'>
        <div className='controls'>
          <p>{this.props.recordingId}</p>
        </div>
        <div className='player'>
          <div className='frame'>
            <iframe
              key='frame'
              src={PROXY_HOST}
              frameBorder='0'
              width='100%'
              height='100%' />
          </div>
        </div>
      </div>
    )
  }

  sendMessage (message) {
    getIframe()
      .contentWindow
      .postMessage(message, PROXY_HOST)
  }

  componentDidMount () {
    getIframe().addEventListener('load', () => {
      this.props.fetchPlaylistFor(this.props.recordingId)
    }, false)
  }

  componentDidUpdate (previousProps) {
    if (previousProps.recording.loading && !this.props.recording.loading) {
      setTimeout(() => {
        const playlistItem = this.props.recording.playlist[0]

        this.sendMessage(JSON.stringify({
          cmd: 'configure',
          ...playlistItem
        }))

        this.scheduleNextFrame()
      }, FIRST_FRAME_WAIT)
    }
  }

  scheduleNextFrame () {
    const { playlist } = this.props.recording
    const { currentFrameId } = this.props
    const item = playlist.find((item) => item.created_at === currentFrameId)
    const i = playlist.indexOf(item)
    const nextFrame = playlist[i + 1]

    const frameWait = (nextFrame && currentFrameId)
      ? nextFrame.created_at - currentFrameId
      : DEFAULT_FRAME_WAIT

    setTimeout(() => {
      if (nextFrame) {
        API.Recordings
          .frame({ recordingId: this.props.recordingId, id: nextFrame.created_at })
          .then((response) => {
            this.sendMessage(JSON.stringify({ cmd: 'renderFrame', payload: response.data() }))
            this.props.setCurrentFrame(nextFrame.created_at)
            this.scheduleNextFrame()
          })
      }
    }, frameWait)
  }
}

export const mapStateToProps = (state, ownProps) => {
  return {
    recordingId: ownProps.params.recordingId,

    recording: state.recording,
    currentFrameId: state.currentFrameId
  }
}

const actionsToConnect = {
  fetchPlaylistFor,
  setCurrentFrame
}

export default connect(
  mapStateToProps,
  actionsToConnect
)(Recording)
