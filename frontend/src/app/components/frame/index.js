import React, { Component, PropTypes } from 'react'

export default class Frame extends Component {
  static get propTypes () {
    return {
      recordingId: PropTypes.string.isRequired,
      frameId: PropTypes.string.isRequired,
      show: PropTypes.bool
    }
  }

  render () {
    if (this.props.show) {
      return (
        <div>
          <iframe src={`http://localhost:7275/recordings/${this.props.recordingId}/frames/${this.props.frameId}`} sandbox='allow-same-origin' />
        </div>
      )
    } else {
      return <div />
    }
  }
}
