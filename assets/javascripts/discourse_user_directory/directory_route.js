Discourse.DirectoryRoute = Discourse.Route.extend({

  model: function(){
    return Discourse.Directory.create();
  },

  setupController: function(controller, model) {

    this.controllerFor('directory').set('model', model);
    this.controllerFor('directory').refresh();
  }
});