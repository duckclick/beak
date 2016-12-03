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

class Beak < Sinatra::Base
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
  end

  get '/ping' do
    'PONG'
  end

  get '/api/recordings/:record_id/playlist' do
    playlist_files = Dir[File.join(settings.recordings_folder, params['record_id'], '*')]
    playlist_files.sort!

    content_type :json
    playlist_files.map { |f| File.basename(f, ".*") }.to_json
  end

  get '*' do
    send_file File.join(settings.public_folder, 'assets/index.html')
  end
end
