window.Discourse.DirectoryController = Discourse.ObjectController.extend(Discourse.Presence, {
    searchString: null,
    query: null,
    selectAll: false,
    userStream: null,
    filterMode: 'directory',

    refresh: function(){
      var directory = this.get('model'),
        userStream = directory.get('userStream');

      userStream.refresh('active', this.get('searchString'));
      this.set('userStream', userStream);
    },

    filterUsers: Discourse.debounce(function() {
        return this.refresh();
    }, 250).observes('searchString'),

    orderChanged: (function() {
        return this.refresh();
    }).observes('query'),

    availableNavItems: (function() {
        var loggedOn, summary;
        summary = this.get('filterSummary');
        loggedOn = !!Discourse.get('currentUser');
        return Discourse.SiteSettings.top_menu.split("|").map(function(i) {
            return Discourse.NavItem.fromText(i, {
                loggedOn: loggedOn,
                hasCategories: true,
                countSummary: summary
            });
        }).filter(function(i) {
            return i !== null;
        });
    }).property('filterSummary'),

  /**
   Called the the bottommost visible post on the page changes.

   @method bottomVisibleChanged
   @params {Discourse.Post} post that is at the bottom
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