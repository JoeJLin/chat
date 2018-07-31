//make connection
var socket = io.connect('http://localhost:3000');

var message = document.getElementById('message');
var output = document.getElementById('output');
var button = document.getElementById('send');
var username = document.getElementById('username').getAttribute('value');
var feedback = document.getElementById('feedback');


//emit event
//pass chat to app.js and let app.js send it to all other clients
button.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        username: username
    });
});

//press enter to send message
message.addEventListener('keypress', function(e){
    if(e.keyCode === 13){
        socket.emit('chat', {
            message: message.value,
            username: username,
        });
    }
})

//press send button
message.addEventListener('keyup', function(){
    if(message.value.length != 0){
        socket.emit('typing', username);
    }
})


//listen for events
socket.on('chat', function(data){
    output.innerHTML += '<p class="textMessage"><strong>' + data.username + '</strong>' + ': ' + data.message + '</p>';
    message.value = '';
    feedback.innerHTML = '';
})

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em id="feedback">' + data + ' is typing a message...' + '</em></p>';
})