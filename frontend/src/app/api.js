import Mappersmith from 'mappersmith'
import Promise from 'promise'

Mappersmith.Env.USE_PROMISES = true
Mappersmith.Env.Promise = Promise

const manifest = {
  host: '/',
  resources: {
    Recordings: {
      playlist: { method: 'get', path: '/api/recordings/{id}/playlist' },
      frame: { method: 'get', path: '/api/recordings/{recordingId}/frames/{id}' }
    }
  }
}

const Client = Mappersmith.forge(manifest)
export default Client

export function parseError (response) {
  try {
    const error = response.err[0]
    const responseText = error.responseText

    try {
      return JSON.parse(responseText)
    } catch (e) {
      return responseText
    }
  } catch (e) {
    return response
  }
}
