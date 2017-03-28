import forge, { configs } from 'mappersmith'
import ReduxMiddleware, { setStore } from 'mappersmith-redux-middleware'
import store from 'app/store'
import { Promise } from 'es6-promise'

configs.Promise = Promise
setStore(store)

export default forge({
  middlewares: [ReduxMiddleware],
  host: '/',
  resources: {
    Recordings: {
      all: { method: 'get', path: '/api/recordings' },
      playlist: { method: 'get', path: '/api/recordings/{id}/playlist' },
      frame: { method: 'get', path: '/api/recordings/{recordingId}/frames/{id}' }
    }
  }
})
