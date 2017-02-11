import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchPlaylistFor } from 'app/actions/recordings'
import { setCurrentFrame } from 'app/actions/frames'
import API from 'app/api'

export const FIRST_FRAME_WAIT = 1000
export const FRAME_WAIT = 500

const getIframe = () => {
  return document.querySelector('.frame iframe')
}

export class Recording extends Component {
  static get propTypes () {
    return {
      fetchPlaylistFor: PropTypes.func.isRequired,
      setCurrentFrame: PropTypes.func.isRequired,

      recordingId: PropTypes.string.isRequired,
      currentFrameId: PropTypes.string,
      recording: PropTypes.shape({
        playlist: PropTypes.arrayOf(PropTypes.string).isRequired,
        playlistShowing: PropTypes.arrayOf(PropTypes.string).isRequired,
        loading: PropTypes.bool
      })
    }
  }

  render () {
    const { recording } = this.props

    if (recording.loading) {
      return <div>Loading...</div>
    }

    const src = 'http://localhost:7275/' // proxy host

    return (
      <div className='page'>
        <div className='controls'>
          <p>{this.props.recordingId}</p>
        </div>
        <div className='player'>
          <div className='frame'>
            <iframe
              key='frame'
              src={src}
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
      .postMessage(message, 'http://localhost:7275')
  }

  componentDidMount () {
    getIframe().addEventListener('load', () => {
      this.props.fetchPlaylistFor(this.props.recordingId)
    }, false)
  }

  componentDidUpdate (previousProps) {
    if (previousProps.recording.loading && !this.props.recording.loading) {
      setTimeout(() => this.scheduleNextFrame(), FIRST_FRAME_WAIT)
    }
  }

  scheduleNextFrame () {
    setTimeout(() => {
      const i = this.props.recording.playlist.indexOf(this.props.currentFrameId)
      const nextFrameId = this.props.recording.playlist[i + 1]

      if (nextFrameId) {
        API.Recordings
          .frame({ recordingId: this.props.recordingId, id: nextFrameId })
          .then((response) => {
            this.sendMessage(JSON.stringify({ cmd: 'renderFrame', payload: response.data }))
            this.props.setCurrentFrame(nextFrameId)
            this.scheduleNextFrame()
          })
      }
    }, FRAME_WAIT)
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
