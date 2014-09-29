Discourse.Route.buildRoutes(function() {
  this.resource('directory', { path: 'directory' }, function(){
    _.each(['latest', 'active', 'newest', 'moderator'], function(path) {
      this.route(path, { path: '/' + path });
    }, this);
  });
});