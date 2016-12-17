import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchPlaylistFor } from 'app/actions/recordings'
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

  componentDidMount () {
    this.props.fetchPlaylistFor(this.props.recordingId)
  }

  render () {
    if (this.props.recording.loading) {
      return <div>Loading...</div>
    }
    const lastFrame = this.props.recording.playlist[this.props.recording.playlist.length - 1]
    return (
      <div className='page'>
        <p>{this.props.recordingId}:</p>
        <div>
          {
            this.props.recording.playlist.map((frameId) => {
              return (
                <Frame
                  key={frameId}
                  frameId={frameId}
                  recordingId={this.props.recordingId}
                  show={frameId === lastFrame} />
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recordingId: ownProps.params.recordingId,
    recording: state.recording
  }
}

const actionsToConnect = {
  fetchPlaylistFor
}

export default connect(
  mapStateToProps,
  actionsToConnect
)(Recording)
