Discourse.DirectoryIndexRoute = Discourse.Route.extend({
  redirect: function() {
    this.transitionTo('directory.active');
  }
});


var DirectoryRouteMixin = Ember.Mixin({
  filter: "latest",
  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {
    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', this.filter);
  }
});

Discourse.DirectoryLatestRoute = Discourse.Route.extend({
  filter: "latest",
  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {
    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', this.filter);
  }
});

Discourse.DirectoryActiveRoute = Discourse.Route.extend({
  filter: "active",
  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {
    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', this.filter);
  }
});

Discourse.DirectoryNewestRoute = Discourse.Route.extend({
  filter: "newest",
  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {
    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', this.filter);
  }
});

Discourse.DirectoryModeratorRoute = Discourse.Route.extend({
  filter: "moderator",
  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {
    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').set('query', this.filter);
  }
});

// If someone can explain me why this doesn't work, the same way, I'd gladly buy them a beer and listen to the story!
// var DirectoryRouteMixin = Ember.Mixin({
//   filter: "latest",
//   model: function(){
//     return Discourse.Directory.create();
//   },

//   setupController: function(controller, model) {
//     this.controllerFor('directory').set('model', model);
//     this.controllerFor('directory').set('query', this.filter);
//   }
// });

// Discourse.DirectoryLatestRoute = Discourse.Route.extend(DirectoryRouteMixin, {
//   filter: "latest"
// });

// Discourse.DirectoryActiveRoute = Discourse.Route.extend(DirectoryRouteMixin, {
//   filter: "active"
// });

// Discourse.DirectoryNewestRoute = Discourse.Route.extend(DirectoryRouteMixin, {
//   filter: "newest"
// });

// Discourse.DirectoryModeratorsRoute = Discourse.Route.extend(DirectoryRouteMixin, {
//   filter: "moderators"
// });
