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

  window.Discourse.User.reopen({

    updateFromUser: function(otherUser){
      var user = this;
      Object.keys(otherUser).forEach(function (key) {
        var value = otherUser[key];
        if (typeof value !== "function") {
          user.set(key, value);
        }
      });
    }

  });
}).call(this);
