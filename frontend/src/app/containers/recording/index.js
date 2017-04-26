/* global PROXY_HOST */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import { fetchPlaylistFor } from 'app/actions/recordings'
import { setCurrentFrame } from 'app/actions/frames'
import API from 'app/api'
import { EventsPanel } from 'app/containers/events-panel'

export const FIRST_FRAME_WAIT = 1000
export const DEFAULT_FRAME_WAIT = 1000

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
        loading: PropTypes.bool,
        playlistRequested: PropTypes.bool
      })
    }
  }

  render () {
    const { recording, currentFrameId } = this.props

    if (recording.loading) {
      return <div>Loading...</div>
    }

    return (
      <div className='page'>
        <div className='controls'>
          <div className='logo'>DuckClick</div>
          <div className='recording-info'>
            <div>Recording: {this.props.recordingId}</div>
            <div>{this.recordingTime()}</div>
          </div>
        </div>
        <div className='player'>
          <div className='frame'>
            <iframe
              ref='iframe'
              scrolling='no'
              key='frame'
              src={PROXY_HOST}
              frameBorder='0'
              onLoad={this.handleIframeLoaded.bind(this)}
            />
          </div>
          <EventsPanel currentEventId={currentFrameId} events={recording.playlist} />
        </div>
      </div>
    )
  }

  sendMessage (message) {
    let contentWindow = this.getIframe().contentWindow
    contentWindow && contentWindow.postMessage(message, PROXY_HOST)
  }

  handleIframeLoaded () {
    !this.props.recording.playlistRequested && this.props.fetchPlaylistFor(this.props.recordingId)
  }

  getIframe () {
    return this.refs.iframe
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

  recordingTime () {
    const { recording } = this.props
    return recording.playlist[0] && moment(recording.playlist[0].created_at, 'x').format('MMMM Do YYYY, HH A')
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
