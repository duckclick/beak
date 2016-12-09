import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

export class Recording extends Component {
  static get propTypes () {
    return {
      recordingId: PropTypes.string.isRequired
    }
  }

  render () {
    return (
      <div className='page'>
        {this.props.recordingId}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    recordingId: ownProps.params.recordingId
  }
}

const actionsToConnect = {}

export default connect(
  mapStateToProps,
  actionsToConnect
)(Recording)
