JoinWith = function(group) {
  Session.set('group', group);
};

RegisterWith = function(group) {
  Meteor.call('addToGroup', group, ShowError);
};

Chat = function(message) {
  var group = Session.get('group');
  Meteor.call('chat', group, message, ShowError);
};

// changing subscription
Deps.autorun(function() {
  $('body').html('');
  var group = Session.get('group');
  if(group) {
    $('body').append('<h1>Group: ' + group + '</h1>');
    Meteor.subscribe('group', group, {onError: ShowError});
  }
  
});

// displaying chat
Chats.find({}, {
  sort: {timestamp: -1},
}).observe({
  added: function(chat) {
    var message = chat.username + ": " + chat.message;
    $('body').append(message + "<br>");
  }
});

ShowError = function(err) {
  if(err) {
    alert(err.reason);
  }
};