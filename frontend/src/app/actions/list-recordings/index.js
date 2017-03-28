import API from 'app/api'

export const listRecordings = () => (dispatch) => {
  return API.Recordings.all()
}
