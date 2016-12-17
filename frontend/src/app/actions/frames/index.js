import {
  SET_CURRENT_FRAME
} from 'app/actions'

export const setCurrentFrame = (frameId) => ({
  type: SET_CURRENT_FRAME,
  frameId
})
