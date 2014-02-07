(function() {
  window.Discourse.UserStream.reopenClass({

    create: function() {
      var userStream = this._super.apply(this, arguments);
      userStream.setProperties({
        users: Em.A(),
        stream: Em.A(),
        //userFilters: Em.Set.create(),
        userIdentityMap: Em.Map.create(),
        summary: false,
        loaded: false,
        loadingAbove: false,
        loadingBelow: false,
        loadingFilter: false
        //stagingPost: false
      });
      return userStream;
    },

    loadDirectoryView: function(query, filter) {
      url = Discourse.getURL("/directory");

      return PreloadStore.getAndRemove("user_directory", function() {
        return Discourse.ajax(url + ".json", {data: { filter: filter }});
      });
    }

  });

  window.Discourse.UserStream.reopen({

    /**
     Are we currently loading users in any way?

     @property loading
     **/
    loading: Em.computed.or('loadingAbove', 'loadingBelow', 'loadingFilter'),

    notLoading: Em.computed.not('loading'),

    /**
     Loads a new set of users into the stream. If you provide a `nearUser` option and the user
     is already loaded, it will simply scroll there and load nothing.

     @method refresh
     @param {Object} opts Options for loading the stream
     @param {Integer} opts.nearUser The user we want to find other users near to.
     @param {Boolean} opts.track_visit Whether or not to track this as a visit to a directory.
     @returns {Ember.Deferred} a promise that is resolved when the users have been inserted into the stream.
     **/
    refresh: function(query, filter) {

      //opts = opts || {};
      opts = {};
      //opts.nearUser = parseInt(opts.nearUser, 10);

      var directory = this.get('directory');
      self = this;

      // Do we already have the user in our list of users? Jump there.
      //var userWeWant = this.get('users').findProperty('user_number', opts.nearUser);
      //if (userWeWant) { return Ember.RSVP.resolve(); }

      // TODO: if we have all the users in the filter, don't go to the server for them.
      self.set('loadingFilter', true);

      //opts = _.merge(opts, self.get('streamFilters'));

      // Request a topicView
      return Discourse.UserStream.loadDirectoryView(query, filter, opts).then(function (json) {
        directory.updateFromJson(json);
        self.updateFromJson(json.user_stream);
        self.setProperties({ loadingFilter: false, loaded: true });

        Discourse.URL.set('queryParams', self.get('streamFilters'));
      }).catch(function(result) {
        self.errorLoading(result);
      });
    },

    /**
     Appends a single user into the stream.

     @method appendUser
     @param {Discourse.User} user The user we're appending
     @returns {Discourse.User} the user that was inserted.
     **/
    appendUser: function(user) {
      this.get('users').addObject(this.storeUser(user));
      return user;
    },

    /**
     @private

     Given a JSON packet, update this stream and the users that exist in it.

     @param {Object} userStreamData The JSON data we want to update from.
     @method updateFromJson
     **/
    updateFromJson: function(userStreamData) {

      var userStream = this,
        users = this.get('users');


      users.clear();
      if (userStreamData) {
        // Load users if present
        userStreamData.users.forEach(function(u) {
          userStream.appendUser(Discourse.User.create(u));
        });
        delete userStreamData.users;

        // Update our attributes
        userStream.setProperties(userStreamData);
      }
    },

    /**
     @private

     Stores a user in our identity map, and sets up the references it needs to
     find associated objects like the topic. It might return a different reference
     than you supplied if the user has already been loaded.

     @method storeUser
     @param {Discourse.User} user The user we're storing in the identity map
     @returns {Discourse.User} the user from the identity map
     **/
    storeUser: function(user) {
      var userId = user.get('id');
      if (userId) {
        var userIdentityMap = this.get('userIdentityMap'),
          existing = userIdentityMap.get(user.get('id'));

        if (existing) {
          // If the user is in the identity map, update it and return the old reference.
          existing.updateFromUser(user);
          return existing;
        }

        user.set('directory', this.get('directory'));
        userIdentityMap.set(user.get('id'), user);
      }
      return user;
    },

    /**
     @private

     Handles an error loading a directory based on a HTTP status code. Updates
     the text to the correct values.

     @method errorLoading
     @param {Integer} status the HTTP status code
     @param {Discourse.Directory} directory The directory instance we were trying to load
     **/
    errorLoading: function(result) {
      var status = result.status;

      var directory = this.get('directory');
      directory.set('loadingFilter', false);
      directory.set('errorLoading', true);

      // If the result was 404 the post is not found
      if (status === 404) {
        directory.set('errorTitle', I18n.t('topic.not_found.title'));
        directory.set('errorBodyHtml', result.responseText);
        return;
      }

      // If the result is 403 it means invalid access
      if (status === 403) {
        directory.set('errorTitle', I18n.t('topic.invalid_access.title'));
        directory.set('message', I18n.t('topic.invalid_access.description'));
        return;
      }

      // Otherwise supply a generic error message
      directory.set('errorTitle', I18n.t('topic.server_error.title'));
      directory.set('message', I18n.t('topic.server_error.description'));
    }

  });
}).call(this);
