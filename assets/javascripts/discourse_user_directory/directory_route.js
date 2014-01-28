Discourse.DirectoryRoute = Discourse.Route.extend({
    setupController: function(c) {
        return this.controllerFor('directory').show('active');
    }
});