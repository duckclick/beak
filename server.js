const express = require('express')
const redis = require('redis')
const bluebird = require('bluebird')
const parseUri = require('parse-uri')

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const PORT = 7274;

const PROXY_HOST = process.env.PROXY_HOST || 'http://localhost:7275'
const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = process.env.REDIS_PORT || '6379'

const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT
});

process.on('exit', redisClient.quit);

const app = express();
app.use(express.static('public/assets'))
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({error: err.message})
})

app.route('/api/*')
  .all(function(req, res, next) {
    res.set({
      'Content-Security-Policy': `child-src 'self' ${PROXY_HOST}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    })

    next()
  })


app.get('/ping', (req, res) => {
  res.send('PONG')
})

app.get('/api/recordings', async (req, res, next) => {
  // TODO: `KEYS` should not be used in production code,
  //       refactor store structure in Redis

  try {
    const allRecordings = await redisClient.keysAsync('*')
    const recordings = await Promise.all(
      allRecordings.map(async (key) => {
        try {
          return {
            playlist_id: key,
            frames: (await redisClient.hkeysAsync(key)).sort()
          }
        } catch (e) {
          next(e)
        }
      }))
    recordings.sort((a, b) =>
      b.frames[0] - a.frames[0]
    )
    res.json(recordings)
  }
  catch(e) {
    next(e)
  }
})

app.get('/api/recordings/:record_id/playlist', async (req, res, next) => {
  try {
    const playlistEntries = (await redisClient.hkeysAsync(req.params.record_id))

    const entries = await Promise.all(
      playlistEntries.sort().map(async (entry_id) => {
        try {
          const entry = await redisClient.hgetAsync(req.params.record_id, entry_id)
          const json = JSON.parse(entry)
          const uri = parseUri(json.url)

          return {
            created_at: json.created_at,
            url: `${uri.protocol}://${uri.host}`,
            host: uri.host,
            current_path: uri.path
          }
        } catch (err) {
          next(err)
        }
      }))
    res.json(entries)
  } catch (err) {
    next(err)
  }
})

app.get('/api/recordings/:id', (req, res) =>{
  res.send('le_recordings with id')
})

app.listen(PORT, '0.0.0.0', (err) =>{
  if (err) {
    console.error(err);
  }
  console.info(
    '==> 🌎 Listening on PORT %s. Open up http://0.0.0.0:%s/ in your browser.',
    PORT, PORT);
});
