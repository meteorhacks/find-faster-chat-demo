Meteor.methods({
  registerWith: function(groupName) {
    this.unblock();
    if(Meteor.userId()) {
      Groups.upsert({_id: groupName}, {$addToSet: {users: Meteor.userId()}});
    } else {
      throw new Meteor.Error(401, "Unauthorized!");
    }
  },

  unregisterFrom: function(groupName) {
    this.unblock();
    if(Meteor.userId()) {
      Groups.update({_id: groupName}, {$pull: {users: Meteor.userId()}});
    } else {
      throw new Meteor.Error(401, "Unauthorized!");
    }
  },

  chat: function(group, message, useFindFaster) {
    this.unblock();
    var methodName = (useFindFaster)? "findOneFaster": "findOne";
    var user = Meteor.users[methodName](this.userId);
    if(!user) throw new Meteor.Error(401, "Unauthorized!");

    var userInGroup = Groups[methodName]({_id: group, users: user._id}, {
      fields: {users: 0}
    });

    if(userInGroup) {
      Chats.insert({
        from: user._id,
        group: group,
        message: message,
        timestamp: Date.now(),
        username: user.username
      });
    } else {
      throw new Meteor.Error(401, "Not Authorized To Post!");
    }
  },

  getReport: function(group, useFindFaster) {
    this.unblock();
    var methodName = (useFindFaster)? "findFaster": "find";
    var groupData = Chats[methodName]({group: group}, {
      sort: {timestamp: -1},
      fields: {message: 1},
      limit: 1000
    }).fetch();

    //do some calculation
    return 10;
  }
});