//make connection
var socket = io.connect('http://localhost:3000/');

var message = document.getElementById('message');
var output = document.getElementById('output');
var button = document.getElementById('send');
var username = document.getElementById('currentUserName').textContent;
var feedback = document.getElementById('feedback');
var receiver = document.getElementById('receiver');
var roomName = document.getElementById('roomName');
var addRoom = document.getElementById('addRoom');
var removeRoom = document.getElementById('removeRoom');
var onlineUser = document.getElementsByClassName('onlineUser');
var addChannel = document.getElementById('addChannel');
var channelDropdown = document.querySelector('sidebar-channel-div');
var channelInput = document.getElementById('channelInput');
var channelContent = document.getElementById('channelContent');
var createChannel = document.getElementById('createChannel');
var channelList = document.getElementById('channelList');
var channel = document.querySelectorAll('.channel');
// var directRoomName;

//listen for click users
// for(let i = 0; i< onlineUser.length; i++){
//     onlineUser[i].addEventListener('click', function (e) {
//         console.log(e.target.textContent)
//         directRoomName = e.target.textContent + '-' + username;
//         console.log(username)
//         console.log(directRoomName);
//         socket.emit('join room', directRoomName);
//     })
// }

// for(let i = 0; i < channel.length; i++){
//     channel[i].addEventListener('click', function(e){
//         console.log(e.target.className);
//     })
// }

//switch channel
document.addEventListener('click', function(e){
    if (e.target.className == 'channel'){
        console.log(e.target.textContent);
        console.log(document.getElementById('chatTitle').textContent);
        let oldChannel = document.getElementById('chatTitle').textContent;
        let newChannel = e.target.textContent;
        socket.emit('switch channel', oldChannel, newChannel);
        document.querySelector('.channel-active').classList.remove('channel-active');
        e.target.classList.add('channel-active');
    }
})

//expand input channel box
addChannel.addEventListener('click', function(){
    console.log('button clicked')
    channelContent.classList.toggle('displayChannelInput');
})

//create channel and append it to channel list
createChannel.addEventListener('click', function(e){
    if(channelInput.value.length > 0){
        let oldChannel = document.getElementById('chatTitle').textContent;
        socket.emit('create new channel', oldChannel, channelInput.value);
        document.querySelector('.channel-active').classList.remove('channel-active');
        channelList.innerHTML += '<div class="channel-active channel">' + channelInput.value + '</div>';
        channelInput.value = '';
        channelContent.classList.toggle('displayChannelInput');
    }
})

//emit event
//pass chat to app.js and let app.js send it to all other clients
button.addEventListener('click', function(){
    // console.log(socket.roomName)
    if (message.value != '') {
        console.log(username)
        let currentChannel = document.querySelector('.channel-active').textContent;
        socket.emit('channel messages', {
            message: message.value,
            username: username,
            channel: currentChannel,
        });
    }
});

//press enter to send message
message.addEventListener('keypress', function(e){
    if (message.value != ''){
        if (e.keyCode === 13) {
            if (receiver.value == '' && !socket['roomName']) {
                socket.emit('publicChat', {
                    message: message.value,
                    username: username
                });
                console.log(roomName.value + 'FROM SEND!!!!')
                console.log(socket + 'FROM SEND!!!!')
            } else if (receiver.value != '') {
                socket.emit('private message', {
                    message: message.value,
                    sender: username,
                    receiver: receiver.value,
                })
                console.log('this is a private message')
            } else if (socket['roomName']) {
                console.log('IN BUTTON EVENT')
                socket.emit('room chat', {
                    message: message.value,
                    username: username,
                    room: socket['roomName'],
                })
            }
        }
    }
})

//press send button
// message.addEventListener('keyup', function(){
//     if(message.value.length != 0){
//         socket.emit('typing', username);
//     }
// })

//add room to user (socket)
addRoom.addEventListener('click', function(){
    if(roomName.value.length != 0){
        socket['roomName'] = roomName.value;
        console.log('TRYING TO ADD ROOM ' + socket['roomName'])
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
    output.innerHTML += '<div class="message"><strong>' + data.username + '</strong> : ' + '<p class="textMessage">' + data.message + '</p></div>';
    message.value = '';
    feedback.innerHTML = '';
    console.log(socket);
})

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em id="feedback">' + data + ' is typing a message...' + '</em></p>';
})

socket.on('users list', function(data){
    console.log(data);
    document.getElementById('friendList').innerHTML = '';
    for(user in data){
        document.getElementById('friendList').innerHTML += '<div class="">' + user +'</div>';
    }
});

socket.on('init', function(data){
    socket.emit('new user', username);
    console.log(data, ' it works!!!!')
})

socket.on('a user left', function(data){
    console.log(data);
    document.getElementById('friendList').innerHTML = '';
    for (user in data) {
        document.getElementById('friendList').innerHTML += '<div class="">' + user + '</div>';
    }
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

socket.on('switch channel', function(channelObj, channelName){
    console.log(channelObj);
    console.log(channelName);
    output.innerHTML = '';
    document.getElementById('chatTitle').innerHTML = '';
    document.getElementById('chatTitle').innerHTML += channelName;
})

socket.on('new channel', function(channelName){
    channelList.innerHTML += '<div class="channel">' + channelName + '</div>';
})

socket.on('channel message', function(data){
    console.log('you are in channel chat');
    output.innerHTML += '<div class="message"><strong>' + data.username + '</strong> : ' + '<p class="textMessage">' + data.message + '</p></div>';

})

socket.on('user in channel', function(numUsers){
    console.log(numUsers);
    document.getElementById('numUsers').textContent = numUsers;
})