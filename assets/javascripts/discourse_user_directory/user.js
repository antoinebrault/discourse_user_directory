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

    pretty_stats: function(){
      var stats = {};
      this.get("stats").forEach(function(x){
        stats[x.action_type] = x.count;
      });
      return stats;
    }.property("stats"),

    likes_count: function(){
      return this.get("pretty_stats")[Discourse.UserAction.TYPES.likes_received] || 0;
    }.property("pretty_stats"),

    topics_count: function(){
      return this.get("pretty_stats")[Discourse.UserAction.TYPES.topics] || 0;
    }.property("pretty_stats"),

    replies_count: function(){
      return this.get("pretty_stats")[Discourse.UserAction.TYPES.replies]|| 0;
    }.property("pretty_stats"),

    posts_count: function(){
      return this.get("pretty_stats")[Discourse.UserAction.TYPES.posts]|| 0;
    }.property("pretty_stats"),

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
