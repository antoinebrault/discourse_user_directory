# name: discourse_user_directory
# about: Discourse user directory
# version: 0.0.5
# authors: sbauch

# load the engine definition, which is in a separate file so that script/rails can use it
require File.expand_path('../lib/discourse_user_directory/engine', __FILE__)

# register the two main assets (sprockets will take over from here)
register_asset('javascripts/discourse_user_directory.js', :server_side)
register_asset('stylesheets/discourse_user_directory.css')


after_initialize do
  require_dependency File.expand_path('../integrate.rb', __FILE__)
end