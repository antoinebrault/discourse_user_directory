(function() {
  window.Discourse.UserStream.reopenClass({

    create: function() {
      var userStream = this._super.apply(this, arguments);
      userStream.setProperties({
        users: Em.A(),
        stream: Em.A(),
        userIdentityMap: Em.Map.create(),
        summary: false,
        loaded: false,
        loadingBelow: false,
        loadingFilter: false
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
    loading: Em.computed.or('loadingBelow', 'loadingFilter'),

    notLoading: Em.computed.not('loading'),

    filteredUsersCount: Em.computed.alias('stream.length'),

    /**
     Have we loaded any users?

     @property hasUsers
     **/
    hasUsers: Em.computed.gt('users.length', 0),

    /**
     Do we have a stream list of user ids?

     @property hasStream
     **/
    hasStream: Em.computed.gt('filteredUsersCount', 0),

    /**
     Can we append more users to our current stream?

     @property canAppendMore
     **/
    canAppendMore: Em.computed.and('notLoading', 'hasUsers', 'lastUserNotLoaded'),

    /**
     Returns the id of the last user in the set

     @property lastUserId
     **/
    lastUserId: function() {
      return _.last(this.get('stream'));
    }.property('stream.@each'),

    /**
     Have we loaded the last user in the stream?

     @property loadedAllUsers
     **/
    loadedAllUsers: function() {
      if (!this.get('hasLoadedData')) { return false; }
      return !!this.get('users').findProperty('id', this.get('lastUserId'));
    }.property('hasLoadedData', 'users.@each.id', 'lastUserId'),

    lastUserNotLoaded: Em.computed.not('loadedAllUsers'),

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

    hasLoadedData: Em.computed.and('hasUsers', 'hasStream'),

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
     Returns the window of users below the current set in the stream, bound by the bottom of the
     stream. This is the collection we use when scrolling downwards.

     @property nextWindow
     **/
    nextWindow: function() {
      // If we can't find the last user loaded, bail
      var lastLoadedUser = this.get('lastLoadedUser');
      if (!lastLoadedUser) { return []; }

      // Find the index of the last user loaded, if not found, bail
      var stream = this.get('stream');
      var lastIndex = this.indexOf(lastLoadedUser);
      if (lastIndex === -1) { return []; }

      // find our window of users
      return stream.slice(lastIndex+1, lastIndex+Discourse.SiteSettings.posts_per_page+1);
    }.property('lastLoadedUser', 'stream.@each'),

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
    },

    /**
     The last user we have loaded. Useful for checking to see if we should load more

     @property lastLoadedUser
     **/
    lastLoadedUser: function() {
      return _.last(this.get('users'));
    }.property('users.@each'),

    /**
     Appends the next window of users to the stream. Call it when scrolling downwards.

     @method appendMore
     @returns {Ember.Deferred} a promise that's resolved when the users have been added.
     **/
    appendMore: function() {
      var self = this;

      // Make sure we can append more users
      if (!self.get('canAppendMore')) { return Ember.RSVP.resolve(); }

      var userIds = self.get('nextWindow');
      if (Ember.isEmpty(userIds)) { return Ember.RSVP.resolve(); }

      self.set('loadingBelow', true);

      var stopLoading = function() {
        self.set('loadingBelow', false);
      };

      return self.findUsersByIds(userIds).then(function(users) {
        users.forEach(function(u) {
          self.appendUser(u);
        });
        stopLoading();
      }, stopLoading);
    },

    /**
     @private

     Returns the index of a particular user in the stream

     @method indexOf
     @param {Discourse.User} user The user we're looking for
     **/
    indexOf: function(user) {
      return this.get('stream').indexOf(user.get('id'));
    },

    /**
     @private

     Returns a list of users in order requested, by id.

     @method findUsersByIds
     @param {Array} userIds The user Ids we want to retrieve, in order.
     @returns {Ember.Deferred} a promise that will resolve to the users in the order requested.
     **/
    findUsersByIds: function(userIds) {
      var unloaded = this.listUnloadedIds(userIds),
        userIdentityMap = this.get('userIdentityMap');

      // Load our unloaded users by id
      return this.loadIntoIdentityMap(unloaded).then(function() {
        return userIds.map(function (u) {
          return userIdentityMap.get(u);
        });
      });
    },

    /**
     @private

     Given a list of userIds, returns a list of the users we don't have in our
     identity map and need to load.

     @method listUnloadedIds
     @param {Array} userIds The user Ids we want to load from the server
     @returns {Array} the array of userIds we don't have loaded.
     **/
    listUnloadedIds: function(userIds) {
      var unloaded = Em.A(),
        userIdentityMap = this.get('userIdentityMap');
      userIds.forEach(function(u) {
        if (!userIdentityMap.has(u)) { unloaded.pushObject(u); }
      });
      return unloaded;
    },

    /**
     @private

     Loads a list of users from the server and inserts them into our identity map.

     @method loadIntoIdentityMap
     @param {Array} userIds The user Ids we want to insert into the identity map.
     @returns {Ember.Deferred} a promise that will resolve to the users in the order requested.
     **/
    loadIntoIdentityMap: function(userIds) {

      // If we don't want any users, return a promise that resolves right away
      if (Em.isEmpty(userIds)) {
        return Ember.Deferred.promise(function (p) { p.resolve(); });
      }

      var url = "/directory/users.json",
        data = { user_ids: userIds },
        userStream = this;

      return Discourse.ajax(url, {data: data}).then(function(result) {
        var users = Em.get(result, "user_stream.users");
        if (users) {
          users.forEach(function (u) {
            userStream.storePost(Discourse.User.create(u));
          });
        }
      });
    }

  });
}).call(this);
