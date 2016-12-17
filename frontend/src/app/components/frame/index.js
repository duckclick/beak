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
    const host = 'http://localhost:7275' // proxy host
    const src = `${host}/api/recordings/${this.props.recordingId}/frames/${this.props.frameId}`
    return (
      <div className='frame' style={{display: this.props.show ? 'block' : 'none'}}>
        <iframe
          src={src}
          sandbox=''
          frameBorder='0'
          width='100%'
          height='100%' />
      </div>
    )
  }
}
