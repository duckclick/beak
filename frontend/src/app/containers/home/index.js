import React, { Component, PropTypes } from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import moment from 'moment'

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

  datetime (timestamp) {
    return moment(timestamp, 'x').fromNow()
  }

  render () {
    const { recordings } = this.props
    return (
      <div className='page'>
        <h1>Recordings</h1>
        <ul>
          {
            recordings.map((recordingData) => (
              <li
                key={recordingData.playlist_id}
                onClick={(e) => store.dispatch(push(`/recordings/${recordingData.playlist_id}`))}
              >
                <div className='recording-label'>{recordingData.playlist_id}
                  <div className='frameCount'>Frames: {recordingData.frames.length}</div>
                  <div className='timeRange'>Time: {this.datetime(recordingData.frames[0])}</div>
                </div>
              </li>
            ))
          }
        </ul>
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
