ENV['RACK_ENV'] ||= 'development'

require 'bundler/setup'
Bundler.require(:default)
require_relative './app'

run Beak
