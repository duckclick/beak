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
    response.headers['X-Frame-Options'] = 'ALLOW-FROM http://localhost:7274'
  end

  get '/ping' do
    'PONG'
  end

  get '/api/recordings/:record_id/frames/:frame_id' do
    send_file File.join(settings.recordings_folder, params['record_id'], "#{params['frame_id']}.html")
  end

  get '*' do
    path = params['splat'].first
    response = Faraday.new(url: 'http://localhost:9292').get(path)
    content_type response.headers['content-type']
    response.body
  end
end
