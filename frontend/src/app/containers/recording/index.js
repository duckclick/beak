import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchPlaylistFor } from 'app/actions/recordings'
import { setCurrentFrame } from 'app/actions/frames'
import Frame from 'app/components/frame'

export const FIRST_FRAME_WAIT = 3000
export const FRAME_WAIT = 100

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
    const { playlistShowing } = recording

    if (recording.loading) {
      return <div>Loading...</div>
    }

    return (
      <div className='page'>
        <div className='controls'>
          <p>{this.props.recordingId}</p>
        </div>
        <div className='player'>
          {
            playlistShowing.map((frameId) => {
              return (
                <Frame
                  key={frameId}
                  frameId={frameId}
                  recordingId={this.props.recordingId}
                  show={frameId === this.props.currentFrameId} />
              )
            })
          }
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.props.fetchPlaylistFor(this.props.recordingId)
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
        console.log(`playing: ${nextFrameId}`)
        this.props.setCurrentFrame(nextFrameId)
        this.scheduleNextFrame()
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
