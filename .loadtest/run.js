var DDPClient = require('ddp');
var SENT_CHATS = 0;
var RES_TIME = 0;

function createClient(username, password, chatTimeout, useFindFaster) {
  var client = new DDPClient({
    // host: "find-faster-chat-demo.meteor.com",
    // port: 443,
    // use_ssl: true

    // host: "107.170.153.91",
    // port: 80

    host: "localhost",
    port: 80
  });

  client.connect(function(err) {
    if(err) throw err;
    console.log('connected!');

    client.loginWithUsername(username, password, afterLogin);
  });

  function afterLogin (err) {
    if(err) {
      console.log(err.message);
      throw err;
    }
    console.log('loggedIn & setting with groups');
    for(var lc=1; lc<=10; lc++) {
      var groupName = 'group-' + lc;
      client.call('registerWith', [groupName]);
      // client.subscribe('group', [groupName]);
    }

    startReporting();
    // startChatting();
  }

  function startChatting() {
    var group = getRandomGroup();
    var startTime = Date.now();
    client.call('chat', [group, 'hello-message', useFindFaster], function(err) {
      if(err) {
        console.log(err.message);
        throw err;
      } else {
        setTimeout(startChatting, chatTimeout);
      }
      SENT_CHATS++;
      RES_TIME += Date.now() - startTime;
    });
  }

  function startReporting() {
    var group = getRandomGroup();
    var startTime = Date.now();
    client.call('getReport', [group, useFindFaster], function(err) {
      if(err) {
        console.log(err.message);
        throw err;
      } else {
        setTimeout(startReporting, chatTimeout);
      }
      SENT_CHATS++;
      RES_TIME += Date.now() - startTime;
    });
  }

  function getRandomGroup() {
    var id = Math.ceil(Math.random() * 10);
    return "group-" + id;
  }
}

initialize(5, false, function() {
  process.exit(0);
});

function initialize(count, useFindFaster, callback) {
  createClient('arunoda', 'maxapower', 100, useFindFaster);
  createClient('arunoda', 'maxapower', 100, useFindFaster);
  if(count > 0) {
    setTimeout(function() {
      initialize(count -1, useFindFaster, callback);
    }, 1000 * 60 * 1);
  } else {
    callback();
  }
}

var logEverySecs = 3;
setInterval(function() {
  var throughput = SENT_CHATS/logEverySecs;
  var avgResTime = RES_TIME/SENT_CHATS;

  SENT_CHATS = 0;
  RES_TIME = 0;

  console.log("Chat Throughput: " + Math.ceil(throughput) + " per/sec");
  console.log("Chat Avg. ResTime: " + avgResTime.toFixed(2) + " millis");
}, 1000 * logEverySecs);