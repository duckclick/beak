import React, { Component, PropTypes } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { fetchAllRecordings } from 'app/actions/all-recordings'
import store from 'app/store'

export class Home extends Component {
  static get propTypes () {
    return {
      fetchAllRecordings: PropTypes.func.isRequired,
      recordings: React.PropTypes.array.isRequired
    }
  }

  componentDidMount () {
    this.props.fetchAllRecordings()
  }

  render () {
    const { recordings } = this.props
    return (
      <div className='page'>
        {
          recordings.map((recordingData) => (
            <div
              className='recording-label'
              onClick={(e) => store.dispatch(push(`/recordings/${recordingData.playlist_id}`))}
            >
              {recordingData.playlist_id}
            </div>
          ))
        }
      </div>
    )
  }
}

export const mapStateToProps = (state, ownProps) => {
  return {
    recordings: state.allRecordings.recordings
  }
}

const actionsToConnect = {
  fetchAllRecordings
}

export default connect(
  mapStateToProps,
  actionsToConnect
)(Home)
