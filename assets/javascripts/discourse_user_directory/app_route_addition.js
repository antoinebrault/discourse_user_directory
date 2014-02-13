Discourse.Route.buildRoutes(function() {
  this.resource('directory', { path: 'directory' }, function(){
    _.each(['active', 'newest'], function(path) {
      this.route(path, { path: '/' + path });
    }, this);
  });
});