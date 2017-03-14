require 'bundler/setup'
require 'uri'
require 'json'
require 'yaml'
require 'digest'
require 'cgi'
require 'redis'

require 'rack'
require 'sinatra'
require 'rack/contrib'

class Beak < Sinatra::Base
  PROXY_HOST = ENV['PROXY_HOST'] || 'http://localhost:7275'
  REDIS_HOST = ENV['REDIS_HOST'] || 'localhost'
  REDIS_PORT = ENV['REDIS_PORT'] || '6379'

  configure do
    use Rack::NestedParams

    set(:raise_errors, false)

    set(:assets_folder_name) { 'public' }
    set(:public_folder) { File.join(Dir.pwd, settings.assets_folder_name) }
    set(:redis) { Redis.new(host: REDIS_HOST, port: REDIS_PORT) }
  end

  error do
    content_type :json
    status 500

    e = env['sinatra.error']
    { error: e.message }.to_json
  end

  before do
    cache_control :no_cache
    response.headers['Content-Security-Policy'] = "child-src 'self' #{PROXY_HOST}"
  end

  get '/ping' do
    'PONG'
  end

  get '/api/recordings/:record_id/playlist' do
    playlist_entries = settings.redis.hkeys(params['record_id']).sort

    content_type :json
    playlist_entries.map do |entry_id|
      entry = settings.redis.hget(params['record_id'], entry_id)
      json = JSON.parse(entry)
      uri = URI(json['url'])
      {
        created_at: json['created_at'],
        url: "#{uri.scheme}://#{uri.host}",
        host: uri.host,
        current_path: uri.path
      }
    end.to_json
  end

  get '/api/recordings/:record_id/frames/:id' do
    track_entry = JSON.parse(settings.redis.hget(params['record_id'], params['id']))
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
