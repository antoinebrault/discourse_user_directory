window.Discourse.DirectoryController = Ember.ArrayController.extend(Discourse.Presence, {
    username: null,
    query: null,
    selectAll: false,
    content: null,
    filterMode: 'directory',

    refresh: function(){
      var directory = Discourse.Directory.create(),
        userStream = directory.get('userStream');
      userStream.refresh('active', null);
      this.set('content', userStream.users);
    },

    filterUsers: Discourse.debounce(function() {
        return this.refreshUsers();
    }, 250).observes('username'),

    orderChanged: (function() {
        return this.refreshUsers();
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
        if (this.blank("content")) {
            return Em.A();
        }
        return this.get("content").filter(function(item, index) {
            return ((index + 1) % 2) === 0;
        });
    }).property("content.@each"),

    contentOdd: (function() {
        if (this.blank("content")) {
            return Em.A();
        }
        return this.get("content").filter(function(item, index) {
            return ((index + 1) % 2) === 1;
        });
    }).property("content.@each")
});