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

    contentEven: (function() {
        if (this.blank("userStream")) {
            return Em.A();
        }
        return this.get("userStream").users.filter(function(item, index) {
            return ((index + 1) % 2) === 0;
        });
    }).property("userStream"),

    contentOdd: (function() {
        if (this.blank("userStream")) {
            return Em.A();
        }
        return this.get("userStream").users.filter(function(item, index) {
            return ((index + 1) % 2) === 1;
        });
    }).property("userStream")
});