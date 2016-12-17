ENV['RACK_ENV'] ||= 'development'

require 'bundler/setup'
Bundler.require(:default)
require_relative './proxy'

run BeakProxy
