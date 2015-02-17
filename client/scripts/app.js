// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox",
  roomname: "lobby",
  friends: {}
};

app.init = function() {
  app.fetch();
  app.roomFetch();
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(room) {
  var filter = '?order=-createdAt&limit=200';
  var url = this.server + filter;
  app.roomname = room || app.roomname;
  query = {
    where: {
      roomname: app.roomname
    }
  };

  app.getRequest(url, query, app.load);

};

app.getRequest = function (url, query, callback) {
  $.ajax({
    url: url,
    type: 'GET',
    data: query,
    success: function(data) {
      console.log(data);
      callback(data);
    },
    error: function(data) {
      console.error('ERROR!');
    }
  });
}

app.roomFetch = function () {
  var filter = '?order=-createdAt&limit=200';
  var url = this.server + filter;
  
  app.getRequest(url, {}, function (data) {
    var classRoom = data.results;
    var storage = {};
    for (var i = 0; i < classRoom.length; i++) {
      storage[classRoom[i].roomname] = 1;
    };

    for (var key in storage) {
      app.addRoom(app.escape(key));
    }
    
  });
}

//make d3 refresh and also get most recent from db
app.d3load = function(data) {
  var messages = data.results;

  var chats = d3.select('#chats').selectAll('div')
      .data(messages, function (d) { 
        if (d !== undefined) {
          return -d.createdAt;
        }
      });
      
  chats.data(messages)
      .enter()
    .append('div')
      .html(function (d) {
        return '<div><span class="username">' + d.username + '</span>: <span>'+ d.text + '</span></div>' ;
      });

  chats  
    .exit()
    .remove();
};

app.load = function(data) {
  var messages = data.results;
  app.clearMessages();
  for (var i = 0; i < messages.length; i++) {
    app.addMessage(messages[i]);
  }
};

app.escape = function(string) {
  return $('<div/>').text(string).html();
}

app.clearMessages = function () {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var username = app.escape(message.username);
  var text = app.escape(message.text);
  var room = app.escape(message.roomname);
  var $message = $('<div class="' + room + '"><span class="username" id="'+username+'">' + username + '</span>: <span>'+ text + '</span></div>')
  if (app.friends[username] === 1) {
    $message.css('font-weight', 'Bold');
  }
  $('#chats').append($message);
};

app.addRoom = function(room){
  $('#roomSelect').append('<div class=room>' + room + '</div>')
};

app.addFriend = function(username) {
  app.friends[username] = 1;
  // $('#'+username).css('font-weight', 'bold');
};

app.handleSubmit = function(message){
  var message = app.escape($('#message').val());
  var messageObject = {
    'username': window.location.search.slice(10),
    'text': message,
    'roomname': app.roomname
     };
  app.send(messageObject);
  console.log(messageObject);
  $('#message').val("");
}

$(document).ready(function() {

  app.init();

  $('#chats').on('click', '.username', function() {
    var username = $(this).text();
    app.addFriend(username);
  });
  //#main       //submit
  $('form').on('click', '#send', function(event){
    event.preventDefault();
    app.handleSubmit(message);
  });
  
  $('#roomSelect').on('click', '.room', function() {
    var room = $(this).text();
    app.fetch(room);
  });

  setInterval(function () {
    app.fetch();
  }, 5000);
});