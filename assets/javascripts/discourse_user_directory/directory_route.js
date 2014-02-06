Discourse.DirectoryRoute = Discourse.Route.extend({

  model: function(params) {
    var currentModel = this.modelFor('directory');
    if (currentModel && (currentModel.get('id') === parseInt(params.id, 10))) {
      return currentModel;
    }
    return Discourse.Directory.create(params);
  },

  setupController: function(controller, params) {

      var directory = this.modelFor('directory'),
          userStream = directory.get('userStream');

      userStream.refresh('active', null);//.then(function () {
        // The post we requested might not exist. Let's find the closest post
        //var closest = postStream.closestPostNumberFor(params.nearPost) || 1;

        //topicController.setProperties({
        //  currentPost: closest,
        //  progressPosition: closest,
        //  enteredAt: new Date().getTime().toString(),
        //  highlightOnInsert: closest
        //});

        //Discourse.TopicView.jumpToPost(closest);

        //if (topic.present('draft')) {
        //  composerController.open({
        //    draft: Discourse.Draft.getLocal(topic.get('draft_key'), topic.get('draft')),
        //    draftKey: topic.get('draft_key'),
        //    draftSequence: topic.get('draft_sequence'),
        //    topic: topic,
        //    ignoreIfChanged: true
        //  });
        //}
      //});
        //return this.controllerFor('directory').show('active');
    }

});