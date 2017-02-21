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
    response.headers['Content-Security-Policy'] = "child-src 'self' http://localhost:7275"
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

  get '/api/recordings/:record_id/frames/:id' do
    file_path = File.join(settings.recordings_folder, params['record_id'], "#{params['id']}.json")
    track_entry = JSON.parse(File.read(file_path))
    frame_html =  Nokogiri::HTML(track_entry['markup'])

    head = frame_html.css('head').inner_html.strip
    body = frame_html.css('body')
    body_attributes = body.first
      .attributes
      .map {|k,v| {k => v.value}}
      .reduce({}) {|result, v| result.merge(v)}

    content_type :json
    {
      head: head,
      body: body.inner_html.strip,
      body_attributes: body_attributes
    }.to_json
  end

  get '*' do
    send_file File.join(settings.public_folder, 'assets/index.html')
  end
end
