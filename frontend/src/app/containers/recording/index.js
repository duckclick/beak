import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchPlaylistFor } from 'app/actions/recordings'
import { setCurrentFrame } from 'app/actions/frames'
import Frame from 'app/components/frame'

export class Recording extends Component {
  static get propTypes () {
    return {
      recordingId: PropTypes.string.isRequired,
      recording: PropTypes.shape({
        playlist: PropTypes.arrayOf(PropTypes.string).isRequired,
        loading: PropTypes.bool
      })
    }
  }

  render () {
    const { recording } = this.props
    const { playlist } = recording

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
            playlist.map((frameId) => {
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
    if (!previousProps.recording.loading) {
      setTimeout(() => this.scheduleNextFrame(), 5000)
    }
  }

  scheduleNextFrame () {
    this.timeoutId = setTimeout(() => {
      const i = this.props.recording.playlist.indexOf(this.props.currentFrameId)
      const nextFrameId = this.props.recording.playlist[i + 1]

      if (nextFrameId) {
        console.log(`playing: ${nextFrameId}`)
        this.props.setCurrentFrame(nextFrameId)
        this.scheduleNextFrame()
      }
    }, 1000)
  }
}

const mapStateToProps = (state, ownProps) => {
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
