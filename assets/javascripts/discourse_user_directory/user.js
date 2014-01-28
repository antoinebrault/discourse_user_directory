(function() {
  window.Discourse.User.reopenClass({
    findAll: function(query, filter) {
      var result;
      result = Em.A();
      Discourse.ajax('/directory/').then(function(payload){
          var users = Em.A();
          _.each(payload,function(user){
              //users.addObject(Discourse.User.create(user));
              return result.pushObject(Discourse.User.create(user));
          });
      });
      return result;
    }
  });
}).call(this);
