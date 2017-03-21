import API from 'app/api'

export const fetchAllRecordings = () => (dispatch) => {
  return API.Recordings.all()
}
