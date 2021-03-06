//make connection
// var socket = io.connect('http://localhost:3000');
var socket = io.connect();

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

var channelList = document.getElementById('channelList');
var channel = document.querySelectorAll('.channel');
var publicChannelList = document.getElementById('publicChannelList');
var closeWindow = document.getElementById('closeWindow');

var createChannel = document.getElementById('createChannel');
var channelName = document.getElementById('channelName');
var description = document.getElementById('description');
var limit = document.getElementById('limit');
var invite = document.getElementById('invite');
var security = document.getElementById('security');

var joinBtn = document.getElementById('joinBtn');
var cancelBtn = document.getElementById('cancelBtn');
var closeInfoWindow = document.getElementById('closeInfoWindow');
var publicChannel = document.getElementsByClassName('publicChannel');

joinBtn.addEventListener('click', function(){
    let permission = document.getElementById('permission').textContent;
    let channel = document.getElementById('joinChannelTitle').textContent;
    let limit = document.getElementById('maxLimit').textContent;
    if(permission == 'Public'){
        // document.querySelector('.publicChannel-active').classList.remove('publicChannel-active');
        // document.querySelector('.permissionDiv').classList.toggle('hide');
        // document.querySelector('.chatDiv').classList.toggle('hide');
        // publicChannelList.classList.toggle('disallowClick');
        // addChannel.classList.toggle('disallowClick');
        socket.emit('join from publicChannel', username, channel, limit, )
    }
})

// X on the join page, click and close
closeInfoWindow.addEventListener('click', function(){
    document.querySelector('.publicChannel-active').classList.remove('publicChannel-active');
    document.querySelector('.permissionDiv').classList.toggle('hide');
    document.querySelector('.chatDiv').classList.toggle('hide');
    publicChannelList.classList.toggle('disallowClick');
    addChannel.classList.toggle('disallowClick');
})


//cancel button on the join page, click and go back
cancelBtn.addEventListener('click', function(){
    document.querySelector('.publicChannel-active').classList.remove('publicChannel-active');
    document.querySelector('.permissionDiv').classList.toggle('hide');
    document.querySelector('.chatDiv').classList.toggle('hide');
    publicChannelList.classList.toggle('disallowClick');
    addChannel.classList.toggle('disallowClick');
})

createChannel.addEventListener('click', function(){
    if (channelName.value != '' && channelName.value.replace(/\s/g, '').length && description.value != '' && description.value.replace(/\s/g, '').length){
            // socket.emti('')
        socket.emit('create new channel', channelName.value, description.value, limit.value, security.value, username);
        publicChannelList.classList.toggle('disallowClick');
    } else{
        alert('You must enter a value in the field')
    }

})

// click on public channel 
document.addEventListener('click', function(e){
    if (e.target.className == 'publicChannel' || e.target.className == 'publicChannel publicChannel-active') {
        console.log(e.target);
        socket.emit('peek on channel', e.target.textContent);
        document.querySelector('.permissionDiv').classList.toggle('hide');
        document.querySelector('.chatDiv').classList.toggle('hide');
        publicChannelList.classList.toggle('disallowClick');
        e.target.classList.toggle('publicChannel-active');
        addChannel.classList.toggle('disallowClick');
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
    // console.log('button clicked')
    document.querySelector('.chatDiv').classList.toggle('hide');
    document.querySelector('.infoContent').classList.toggle('hide');
    publicChannelList.classList.toggle('disallowClick');
})

//close create channel window
closeWindow.addEventListener('click', function(){
    document.querySelector('.chatDiv').classList.toggle('hide');
    document.querySelector('.infoContent').classList.toggle('hide');
    publicChannelList.classList.toggle('disallowClick');
})

//create channel and append it to channel list
// createChannel.addEventListener('click', function(e){
//     if(channelInput.value.length > 0){
//         let oldChannel = document.getElementById('chatTitle').textContent;
//         socket.emit('create new channel', channelInput.value, username);
//         channelInput.value = '';
//     }
// })

//emit event
//pass chat to app.js and let app.js send it to all other clients
button.addEventListener('click', function(){
    if (message.value != '' && message.value.replace(/\s/g, '').length) {
        console.log(username)
        if (message.value[0] == '@') {
            let receiver = message.value.substr(1, message.value.indexOf(' ') - 1);
            let textMessage = message.value.substr(message.value.indexOf(' ') + 1, message.value.length);
            socket.emit('private message', {
                message: textMessage,
                sender: username,
                receiver: receiver,
            })
        } else {
            let currentChannel = document.querySelector('.channel-active').textContent;
            socket.emit('channel messages', {
                message: message.value,
                username: username,
                channel: currentChannel,
            });
        }
    }
});

//press enter to send message
message.addEventListener('keypress', function(e){
    if (message.value != '' && message.value.replace(/\s/g, '').length){
        if (e.keyCode === 13) {
            if(message.value[0] == '@'){
                let receiver = message.value.substr(1, message.value.indexOf(' ') - 1);
                let textMessage = message.value.substr(message.value.indexOf(' ') + 1, message.value.length);
                socket.emit('private message', {
                    message: textMessage,
                    sender: username,
                    receiver: receiver,
                })
            } else{
                let currentChannel = document.querySelector('.channel-active').textContent;
                socket.emit('channel messages', {
                    message: message.value,
                    username: username,
                    channel: currentChannel,
                });
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
    output.innerHTML += '<p class="message"> From <strong>' + data.sender + '</strong>' + ': ' + data.message + '</p>';
    feedback.innerHTML = '';
})

socket.on('to sender', function (data) {
    output.innerHTML += '<p class="message"> To <strong>' + data.receiver + '</strong>' + ': ' + data.message + '</p>';
    message.value = '';
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
        `<div class="publicChannel">${channelName}</div>`
    ;
})

socket.on('channel message', function(data){
    console.log('you are in channel chat');
    output.innerHTML += '<div class="message"><strong>' + data.username + '</strong>: ' + '<p class="textMessage">' + data.message + '</p></div>';
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
    for(let i = 0; i < chatHistory.length; i++){
        output.innerHTML += '<div class="message"><strong>' + chatHistory[i].author + '</strong>: ' + '<p class="textMessage">' + chatHistory[i].message + '</p></div>';
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

socket.on('error message', function(message){
    alert(message);
})

socket.on('channel to itself', function(channel){
    document.querySelector('.channel-active').classList.remove('channel-active');
    channelList.innerHTML += '<div class="channel-active channel">' + channel + '</div>';
    // channelContent.classList.toggle('displayChannelInput');
})

socket.on('clear create form', function(){
    createChannel.value = '';
    channelName.value = '';
    description.value = '';
    limit.value = '';
    security.value = 'Public';
    document.querySelector('.chatDiv').classList.toggle('hide');
    document.querySelector('.infoContent').classList.toggle('hide');
})

socket.on('compare two arrs', function (public, personalList){
    console.log(public);
    console.log(personalList);
    var finalArr = public.filter((channel) => !personalList.includes(channel));
    console.log(finalArr);
    finalArr.forEach((channel) => {
        publicChannelList.innerHTML += `<div class="publicChannel">${channel}</div>`;
    })
})

socket.on('append data to content', function(data){
    console.log('im in append ' + data.channel)
    document.getElementById('joinChannelTitle').innerHTML = data.channel;
    document.getElementById('permission').innerHTML = data.permission;
    document.getElementById('ChannelOwner').innerHTML = data.Owner;
    document.getElementById('joinChannelDescription').innerHTML = data.description;
    if(data.limit == null){
        document.getElementById('maxLimit').innerHTML = 'No Limit';
    }else{
        document.getElementById('maxLimit').innerHTML = data.limit;
    }
})

socket.on('redirect to channel', function(channel){
    console.log(document.querySelector('.publicChannel-active'));
    let element = document.querySelector('.publicChannel-active')
    element.parentElement.removeChild(element);
    document.querySelector('.permissionDiv').classList.toggle('hide');
    document.querySelector('.chatDiv').classList.toggle('hide');
    publicChannelList.classList.toggle('disallowClick');
    addChannel.classList.toggle('disallowClick');
    document.querySelector('.channel-active').classList.remove('channel-active');
    channelList.innerHTML +=`<div class="channel channel-active">${channel.channel}</div>`;
    socket.emit('switch channel', channel.channel)
})
