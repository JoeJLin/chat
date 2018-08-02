//make connection
var socket = io.connect('http://localhost:3000/');

var message = document.getElementById('message');
var output = document.getElementById('output');
var button = document.getElementById('send');
var username = document.getElementById('username').getAttribute('value');
var feedback = document.getElementById('feedback');
var receiver = document.getElementById('receiver');


//emit event
//pass chat to app.js and let app.js send it to all other clients
button.addEventListener('click', function(){
    if (receiver.value.length == 0){
        socket.emit('publicChat', {
            message: message.value,
            username: username
        });
    } else {
        socket.emit('private message', {
            message: message.value,
            username: username,
            receiver: receiver.value,
        })
        console.log('this is a private message')
    }
    
});

//press enter to send message
message.addEventListener('keypress', function(e){
    if(e.keyCode === 13){
        if (receiver.value == 0) {
            socket.emit('publicChat', {
                message: message.value,
                username: username
            });
        } else {
            console.log('this is a private message')
        }
    }
})

//press send button
message.addEventListener('keyup', function(){
    if(message.value.length != 0){
        socket.emit('typing', username);
    }
})


//listen for events
socket.on('publicChat', function(data){
    output.innerHTML += '<p class="textMessage"><strong>' + data.username + '</strong>' + ': ' + data.message + '</p>';
    message.value = '';
    feedback.innerHTML = '';
})

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em id="feedback">' + data + ' is typing a message...' + '</em></p>';
})

socket.on('new user', function(data){
    console.log(data);
})

socket.on('init', function(data){
    socket.emit('new user', username);
    console.log(data, ' it works!!!!')
})

socket.on('a user left', function(data){
    console.log(data);
})

socket.on('To receiver', function (data) {
    output.innerHTML += '<p class="textMessage"><strong>' + data.receiver + '</strong> <br> <strong>' + data.username + '</strong>' + ': ' + data.message + '</p>';
    message.value = '';
    feedback.innerHTML = '';
})