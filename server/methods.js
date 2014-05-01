Meteor.methods({
  addToGroup: function(groupName) {
    // 
    if(Meteor.userId()) {
      Groups.upsert({_id: groupName}, {$addToSet: {users: Meteor.userId()}});
    } else {
      throw new Meteor.Error(401, "Unauthorized!");
    }
  },

  chat: function(group, message) {
    var user = Meteor.user();
    if(!user) throw new Meteor.Error(401, "Unauthorized!");

    var userInGroup = Groups.findOne({_id: group, users: user._id}, {
      fields: {users: -1}
    });

    if(userInGroup) {
      Chats.insert({
        from: user,
        group: group,
        message: message,
        timestamp: Date.now(),
        username: user.username
      });
    } else {
      throw new Meteor.Error(401, "Not Authorized To Post!");
    }
  }
});