window.Discourse.DirectoryController = Discourse.ObjectController.extend(Discourse.Presence, {
  searchString: null,
  query: null,
  selectAll: false,
  userStream: null,
  filterMode: 'directory',

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
    return "<div class='spinner'>" + I18n.t('loading') + "</div>";
  }.property()
});