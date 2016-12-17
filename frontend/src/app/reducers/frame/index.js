import { SET_CURRENT_FRAME } from 'app/actions'

export default (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_FRAME:
      return action.frameId

    default:
      return state
  }
}
