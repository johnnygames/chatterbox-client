// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox"
};

app.init = function() {
  app.fetch();
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

app.fetch = function() {
  $.ajax({
    url: this.server,
    type: 'GET',
    success: function(data) {
      console.log(data);
      app.d3load(data);  
    },
    error: function(data) {
      console.error('ERROR!');
    }
  });
};

//make d3 refresh and also get most recent from db
app.d3load = function(data) {
  var messages = data.results;
  messages.sort(function (a, b) {
     return Date.parse(b.updatedAt) - Date.parse(a.updatedAt); 
  });
  d3.select('#chats').selectAll('div')
      .data(messages)
      .enter()
    .append('div')
      .html(function (d) {
        return '<div><span class="username">' + d.username + '</span>: <span>'+ d.text + '</span></div>' ;
      })
    // .append('span')
    //   .attr('class', 'username')
    //   .text(function (d) {return d.username;})
};

app.clearMessages = function () {
  $('#chats').empty();
};

app.addMessage = function(message) {
  var username = message.username;
  var text = message.text;
  var room = message.roomname;
  $('#chats').append('<div><span class="username">' + username + '</span><span>'+ text + '</span></div>' )
};

app.addRoom = function(){
  $('#roomSelect').append('<div></div>')
};

app.addFriend = function() {

};

app.handleSubmit = function(message){
  var message = $('#message').val();
  var escaped = $('<div/>').text(message).html();
  app.send(escaped);
  console.log(escaped);
  $('#message').val("");
}

$(document).ready(function() {

  app.init();

  $('#chats').on('click', '.username', function() {
    app.addFriend();
  });
  //#main       //submit
  $('form').on('click', '#send', function(event){
    event.preventDefault();
    app.handleSubmit(message);
  })

  setInterval(function () {
    app.fetch();
  }, 2000);
});