/**
 This view renders a user.

 @class UserView
 @extends Discourse.GroupedView
 @namespace Discourse
 @module Discourse
 **/
Discourse.DirectoryUserView = Discourse.GroupedView.extend(Ember.Evented, {
  templateName: 'discourse_user_directory/templates/directory_user'
});