/**
 A data model representing a Directory

 @class Directory
 @extends Discourse.Model
 @namespace Discourse
 @module Discourse
 **/
Discourse.Directory = Discourse.Model.extend({

  // Update our attributes from a JSON result
  updateFromJson: function(json) {

    var keys = Object.keys(json);
    keys.removeObject('user_stream');

    var directory = this;
    keys.forEach(function (key) {
      directory.set(key, json[key]);
    });

  },

  userStream: function() {
    return Discourse.UserStream.create({directory: this});
  }.property()
});