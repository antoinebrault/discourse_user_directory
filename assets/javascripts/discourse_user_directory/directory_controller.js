window.Discourse.DirectoryController = Discourse.ObjectController.extend(Discourse.Presence, {
  searchString: null,
  query: null,
  selectAll: false,
  userStream: null,
  filterMode: 'directory',


  actions: {
    // Modals that can pop up within a topic
    expandPostUser: function(post) {
      this.controllerFor('poster-expansion').show(post.get('username'), post.get('uploaded_avatar_id'));
    }
  },

  refresh: Discourse.debounce(function(){
    var directory = this.get('model'),
      userStream = directory.get('userStream');

    userStream.refresh(this.get('query'), this.get('searchString'));
    this.set('userStream', userStream);
  }, 250).observes('query'),

  filterUsers: Discourse.debounce(function() {
    return this.refresh();
  }, 250).observes('searchString'),

  /**
   Called the the bottommost visible user on the page changes.

   @method bottomVisibleChanged
   @params {Discourse.USer} user that is at the bottom
   **/
  bottomVisibleChanged: function(user) {
    var userStream = this.get('userStream');
    var lastLoadedUser = userStream.get('lastLoadedUser');

    if (lastLoadedUser && lastLoadedUser === user) {
      userStream.appendMore();
    }
  },

  loadingHTML: function() {
    return "<div class='spinner'></div>";
  }.property()
});
