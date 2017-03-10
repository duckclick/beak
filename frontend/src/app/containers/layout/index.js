import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Layout extends Component {
  static get propTypes () {
    return {}
  }

  render () {
    return (
      <div className={`layout ${process.env.NODE_ENV}`}>
        <div className='body'>
          { this.props.children }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const actionsToConnect = {}

export default connect(
  mapStateToProps,
  actionsToConnect
)(Layout)
