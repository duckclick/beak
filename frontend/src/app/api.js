import forge, { configs } from 'mappersmith'
import Promise from 'promise'

configs.Promise = Promise

export default forge({
  host: '/',
  resources: {
    Recordings: {
      playlist: { method: 'get', path: '/api/recordings/{id}/playlist' },
      frame: { method: 'get', path: '/api/recordings/{recordingId}/frames/{id}' }
    }
  }
})
