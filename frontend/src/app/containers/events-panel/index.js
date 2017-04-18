import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

export class EventsPanel extends Component {
  static get propTypes () {
    return {
      currentEventId: PropTypes.number,
      events: PropTypes.arrayOf(
        PropTypes.shape({
          created_at: PropTypes.number,
          current_path: PropTypes.string
        })
      ).isRequired
    }
  }

  render () {
    const { events } = this.props

    return <ul className='events'>
      { events.map((event) => (
        <li
          key={event.created_at}
          className={this.eventClass(event)}
          >
          <i className='event-icon fa fa-mouse-pointer fa-lg' aria-hidden='true' />
          <div className='info'>
            <div className='timestamp'>{this.eventTimestamp(event)}</div>
            <div className='path'>{event.current_path}</div>
          </div>
        </li>
        ))
      }
    </ul>
  }

  eventClass (event) {
    const { currentEventId } = this.props
    return event.created_at === currentEventId ? 'current' : 'not-current'
  }

  eventTimestamp (event) {
    return moment(event.created_at, 'x').format('HH:mm:ss')
  }
}

export const mapStateToProps = (state) => {
  return {
    events: state.recording.playlist,
    currentEventId: state.currentFrameId
  }
}

export default connect(mapStateToProps)(EventsPanel)
