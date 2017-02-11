require 'bundler/setup'
require 'uri'
require 'json'
require 'yaml'
require 'digest'
require 'cgi'
require 'fileutils'

require 'rack'
require 'sinatra'
require 'rack/contrib'
require 'faraday'

class BeakProxy < Sinatra::Base
  configure do
    use Rack::NestedParams

    set(:raise_errors, false)
    set(:protection, except: [:frame_options])

    set(:assets_folder_name) { 'public' }
    set(:public_folder) { File.join(Dir.pwd, settings.assets_folder_name) }
    set(:recordings_folder) { '/tmp/track_entries' }
  end

  error do
    content_type :json
    status 500

    e = env['sinatra.error']
    { error: e.message }.to_json
  end

  before do
    cache_control :no_cache
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'content-type'
  end

  get '/ping' do
    'PONG'
  end

  # get '/api/recordings/:record_id/frames/:frame_id' do
  #   send_file File.join(settings.recordings_folder, params['record_id'], "#{params['frame_id']}.html")
  # end

  get '/' do
    <<~HTML
      <html>
        <head>
          <script type="text/javascript" src="/__duckclick__/assets/common.js"></script>
          <script type="text/javascript" src="/__duckclick__/assets/frame.js"></script>
        </head>
        <body>
          <div id="__duckclick-root__" style="padding: 0; margin: 0; width: 100%; height: 100%;"></div>
        </body>
      </html>
    HTML
  end

  get '/__duckclick__/assets/*' do
    path = params['splat'].first
    faraday_response = Faraday.new(url: 'http://localhost:7276').get(path)
    content_type faraday_response.headers['content-type']
    faraday_response.body
  end

  get '*' do
    path = params['splat'].first
    faraday_response = Faraday.new(
      url: 'http://todomvc.com',
      headers: { 'Host' => 'todomvc.com' }
    ).get("/examples/react/#{path}")
    content_type faraday_response.headers['content-type']
    faraday_response.body
  end
end
