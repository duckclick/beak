import React, {Component} from 'react'
import {push} from 'react-router-redux'

import store from 'app/store'

export default class extends Component {
  render () {
    return (
      <div className='page'>
        <input
          type='text'
          label='recording-id'
          onBlur={(e) => store.dispatch(push(`/recordings/${e.target.value}`))} />
      </div>
    )
  }
}
