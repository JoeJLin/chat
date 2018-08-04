//make connection
var socket = io.connect('http://localhost:3000/');

var message = document.getElementById('message');
var output = document.getElementById('output');
var button = document.getElementById('send');
var username = document.getElementById('username').getAttribute('value');
var feedback = document.getElementById('feedback');
var receiver = document.getElementById('receiver');
var roomName = document.getElementById('roomName');
var addRoom = document.getElementById('addRoom');
var removeRoom = document.getElementById('removeRoom');

//emit event
//pass chat to app.js and let app.js send it to all other clients
button.addEventListener('click', function(){
    if (message.value != '') {
        if (receiver.value == '' && socket['roomName'] != '') {
            socket.emit('publicChat', {
                message: message.value,
                username: username
            });
            console.log(roomName.value + 'FROM SEND!!!!')
            console.log(socket + 'FROM SEND!!!!')
        } else if (receiver.value != ''){
            socket.emit('private message', {
                message: message.value,
                sender: username,
                receiver: receiver.value,
            })
            console.log('this is a private message')
        } else if (socket['roomName'].length != 0){
            console.log('IN BUTTON EVENT')
            socket.emit('room chat', {
                message: message.value,
                username: username,
                room: socket['roomName'],
            })
        }
    }
});

//press enter to send message
message.addEventListener('keypress', function(e){
    if (message.value != ''){
        if (e.keyCode === 13) {
            if (receiver.value == 0) {
                socket.emit('publicChat', {
                    message: message.value,
                    username: username
                });
            } else {
                socket.emit('private message', {
                    message: message.value,
                    sender: username,
                    receiver: receiver.value,
                })
                console.log('this is a private message')
            }
        }
    }
})

//press send button
message.addEventListener('keyup', function(){
    if(message.value.length != 0){
        socket.emit('typing', username);
    }
})

//add room to user (socket)
addRoom.addEventListener('click', function(){
    if(roomName.value.length != 0){
        socket['roomName'] = roomName.value;
        console.log('TRYING TO ADD ROOM' + socket['roomName'])
        // roomName.value = '';
        socket.emit('join room', socket['roomName'])
    }
})

//remove room from user (socket)
removeRoom.addEventListener('click', function(){
    if(roomName.value.length != 0){
        console.log('TRYING TO REMOVE ROOM' + socket['roomName'])
        socket.emit('leave room', socket['roomName']);
        socket['roomName'] = '';
        roomName.value = '';
    }
})

//listen for events
socket.on('publicChat', function(data){
    output.innerHTML += '<p class="textMessage"><strong>' + data.username + '</strong>' + ': ' + data.message + '</p>';
    message.value = '';
    feedback.innerHTML = '';
    console.log(socket);
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

socket.on('to receiver', function (data) {
    output.innerHTML += '<p class="textMessage"> From <strong>' + data.sender + '</strong> <strong> To You </strong>' + ': ' + data.message + '</p>';
    feedback.innerHTML = '';
})

socket.on('to sender', function (data) {
    output.innerHTML += '<p class="textMessage"> To <strong>' + data.receiver + '</strong> From <strong> You </strong>' + ': ' + data.message + '</p>';
    message.value = '';
    receiver.value = '';
    feedback.innerHTML = '';
})

socket.on('room', function(data){
    output.innerHTML += '<p class="textMessage"> You are In ' + data.room + ' Room <strong>' + data.username + '</strong>' + ': ' + data.message + '</p>';
    message.value = '';
    receiver.value = '';
    feedback.innerHTML = '';
})