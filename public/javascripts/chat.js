//make connection
var socket = io.connect('http://localhost:3000');

var message = document.getElementById('message');
var output = document.getElementById('output');
var button = document.getElementById('send');
var username = document.getElementById('currentUserName').textContent;
var feedback = document.getElementById('feedback');
var receiver = document.getElementById('receiver');

var onlineUserList = document.getElementById('onlineUserList');
var addChannel = document.getElementById('addChannel');
var channelDropdown = document.querySelector('sidebar-channel-div');
var channelInput = document.getElementById('channelInput');
var channelContent = document.getElementById('channelContent');
var createChannel = document.getElementById('createChannel');
var channelList = document.getElementById('channelList');
var channel = document.querySelectorAll('.channel');
var publicChannelList = document.getElementById('publicChannelList');
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

//add channel from public to personal channel
// document.addEventListener('click', function(e){
    
// })

document.addEventListener('click', function(e){
    if (e.target.className == 'publicChannel') {
        console.log(e.target.textContent + ' IM HERE!!')
    }
})

//switch channel
document.addEventListener('click', function(e){
    if (e.target.className == 'channel'){
        console.log(e.target.textContent);
        console.log(document.getElementById('chatTitle').textContent);
        let newChannel = e.target.textContent;
        socket.emit('switch channel', newChannel);
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
        socket.emit('create new channel', channelInput.value, username);
        document.querySelector('.channel-active').classList.remove('channel-active');
        channelList.innerHTML += '<div class="channel-active channel">' + channelInput.value + '</div>';
        channelInput.value = '';
        channelContent.classList.toggle('displayChannelInput');
    }
})

//emit event
//pass chat to app.js and let app.js send it to all other clients
button.addEventListener('click', function(){
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

//listen for events
// socket.on('publicChat', function(data){
//     output.innerHTML += '<div class="message"><strong>' + data.username + '</strong> : ' + '<p class="textMessage">' + data.message + '</p></div>';
//     message.value = '';
//     feedback.innerHTML = '';
//     console.log(socket);
// })

// socket.on('typing', function(data){
//     feedback.innerHTML = '<p><em id="feedback">' + data + ' is typing a message...' + '</em></p>';
// })

socket.on('users list', function(data){
    console.log(data);
    onlineUserList.innerHTML = '';
    for(user in data){
        onlineUserList.innerHTML += '<div class="onlineUser"><span><i class="fas fa-circle"></i></span>' + user +'</div>';
    }
});

socket.on('init', function(data){
    socket.emit('online user', username);
    console.log(data, ' it works!!!!')
})

socket.on('a user left', function(data){
    console.log(data);
    onlineUserList.innerHTML = '';
    for (user in data) {
        onlineUserList.innerHTML += '<div class="onlineUser"><span><i class="fas fa-circle"></i></span>' + user + '</div>';
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


socket.on('switch channel', function(channelName){
    console.log(channelName + ' channel');
    output.innerHTML = '';
    document.getElementById('chatTitle').innerHTML = '';
    document.getElementById('chatTitle').innerHTML += channelName;
})

socket.on('new channel', function(channelName){
    publicChannelList.innerHTML += 
        `<div class="publicChannel"> 
            ${channelName} 
        </div>`
    ;
})

socket.on('channel message', function(data){
    console.log('you are in channel chat');
    output.innerHTML += '<div class="message"><strong>' + data.username + '</strong> : ' + '<p class="textMessage">' + data.message + '</p></div>';
    message.value = '';
})

socket.on('update user in channel', function(numUsers){
    console.log(numUsers);
    document.getElementById('numUsers').textContent = numUsers;
})

socket.on('refresh user in list', function(){
    socket.emit('refresh user in list');
})

socket.on('get chat history', function(chatHistory){
    for(let i = 0; i < chatHistory.conversation.length; i++){
        output.innerHTML += '<div class="message"><strong>' + chatHistory.conversation[i].author + '</strong> : ' + '<p class="textMessage">' + chatHistory.conversation[i].message + '</p></div>';
    }
})

socket.on('personal channel list', function (list){
    console.log('im got called')
    channelList.innerHTML = '';
    channelList.innerHTML += '<div class="channel-active channel">General</div>';
    list.forEach(data => {
        channelList.innerHTML += '<div class="channel">' + data.channel + '</div>';
    });
})