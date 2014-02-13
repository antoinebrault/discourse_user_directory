Discourse.DirectoryIndexRoute = Discourse.Route.extend({
  redirect: function() {
    this.transitionTo('directory.active');
  }
});

Discourse.DirectoryActiveRoute = Discourse.Route.extend({

  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {

    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', 'active');
  }
});

Discourse.DirectoryNewestRoute = Discourse.Route.extend({

  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {

    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', 'newest');
  }
});