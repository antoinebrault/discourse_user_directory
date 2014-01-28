(function() {
  window.Discourse.User.reopenClass({
    findAll: function(query, filter) {
      var result;
      result = Em.A();
      Discourse.ajax('/directory/', { data: { filter: filter }}).then(function(users){
          _.each(users,function(user){
              return result.pushObject(Discourse.User.create(user));
          });
      });
      return result;
    }
  });
}).call(this);
