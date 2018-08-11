module.exports = (io, socket, onlineUsers, Message, User) => {
    socket.emit('init', socket.id)
    console.log('connected socket ' + socket.id);

    // socket.on('typing', function (data) {
    //     socket.broadcast.emit('typing', data);
    //     console.log(data)
    // });

    socket.on('refresh user in list', ()=>{
        console.log(socket.rooms)
        for (channel in socket.rooms) {
            io.emit('update user in channel', io.sockets.adapter.rooms[channel].length);
        }
    })

    socket.on('disconnect', function(){
        console.log(socket.username)
        console.log('a user left ' + onlineUsers[socket.username]);
        io.emit('refresh user in list');
        delete onlineUsers[socket.username];
        io.emit('a user left', onlineUsers);
    });

    socket.on('online user', (username)=>{
        socket['username'] = username;
        onlineUsers[username] = socket.id;
        socket.join('General');
        let personalList = [];
        User.findOne({username: username})
            .then((user) =>{
                return user.channelList;
            })
            .then((channelList) =>{
                for(let i = 0; i < channelList.length; i++){
                    personalList.push(channelList[i].channel);
                }
                socket.emit('personal channel list', channelList);
            })
            .then(()=>{
                return Message.findOne({ channel: 'General' })
            })
            .then((chatHistory) => {
                Message.find({}, 'channel')
                    .then((result) => {
                        let channelArr = [];
                        for (let i = 0; i < result.length; i++) {
                            if (result[i].channel != 'General'){
                                channelArr.push(result[i].channel);
                            } else{
                                
                            }
                        }
                        socket.emit('compare two arrs', channelArr, personalList);
                    })
                    return chatHistory;
            })
            .then((chatHistory)=> {
                if(chatHistory){
                    // console.log(chatHistory.conversation);
                    socket.emit('get chat history', chatHistory.conversation);
                } else{
                    throw 'CHAT HISTORY DOES NOT EXISTS';
                }
            })
            .catch((err) =>{
                console.log(err);
            })
        
        io.emit('users list', onlineUsers);
        io.emit('update user in channel', io.sockets.adapter.rooms['General'].length);
    });
    
    socket.on('switch channel', (newChannel) =>{
        console.log(newChannel);
        socket.join(newChannel);
        socket.emit('switch channel', newChannel);
        io.emit('update user in channel', io.sockets.adapter.rooms[newChannel].length);
        Message.findOne({channel: newChannel})
            .then((channel) =>{
                if (!channel.conversation){
                    console.log('not found conversation')
                    // console.log(channel)
                } else {    
                    console.log('found conversation')
                    socket.emit('get chat history', channel.conversation);
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    })

    socket.on('create new channel', (newChannel, channelDescription, maxLimit, security, username)=>{
        console.log('created and join new channel ' + newChannel)
        Message.findOne({channel: newChannel})
            .then((channel) => {
                if(!channel){
                    console.log('not found')
                }else{
                    // console.log('duplicate channel')
                    throw 'Channel name is duplicate';
                }
            })
            .then(() =>{
                let message = new Message({
                    channel: newChannel,
                    memberCount: +1,
                    description: channelDescription,
                    limit: maxLimit,
                    permission: security,
                    Owner: username,
                })
                message.save();
            })
            .then(()=>{
                return User.findOneAndUpdate({ username: username }, 
                    { 
                        '$push': { channelList: { channel: newChannel } },  
                    });
            })
            .then((user) => {
                socket.join(newChannel);
                socket.emit('clear create form');
                socket.broadcast.emit('new channel', newChannel);
                io.emit('update user in channel', io.sockets.adapter.rooms[newChannel].length);
                socket.emit('switch channel', newChannel);
                io.to(onlineUsers[username]).emit('channel to itself', newChannel);
            })
            .catch((err)=>{
                console.log(err);
                socket.emit('error message', err); 
            })
    })

    socket.on('channel messages', (data)=>{
        console.log(data.username + 'you are in server channel messages ' + data.channel);
        data['time'] = new Date().toLocaleTimeString();
        console.log('messages ' + data.time);
        Message.findOne({channel: data.channel})
            .then((channel)=>{
                if(channel){
                    // console.log('exists in db' + channel);
                    channel.conversation.push({
                        author: data.username,
                        message: data.message,
                        time: new Date().toLocaleTimeString(),
                    });
                    channel.save();
                } else if(!channel){
                    console.log('not exists in db, now SAVING!!');
                    let message = new Message({
                    channel: data.channel,
                    conversation: {
                            author: data.username,
                            message: data.message,
                            time: new Date().toLocaleTimeString(),
                        }
                });
                    message.save();
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        
        io.to(data.channel).emit('channel message', data);
    });

    socket.on('private message', (data)=> {
        console.log(`private message by ${data.sender} to ${data.receiver}`);
        //check if receiver is online
        if(data.receiver in onlineUsers){
            console.log('SENDING A PRIVATE MESSAGE!!!!!!' + onlineUsers[data.receiver])
            //write one for sender and receiver
            socket.join(data.directRoomName);
            io.to(onlineUsers[data.receiver]).emit('to receiver', data);
            io.to(onlineUsers[data.sender]).emit('to sender', data);
        }
    })

    socket.on('join room', function(data){
        console.log('JOIN ' + data);
        socket.join(data);
    })

    socket.on('leave room', function(data){
        console.log('LEAVE ' + data);
        socket.leave(data);
    })

    socket.on('peek on channel', (channelName) =>{
        console.log(channelName)
        Message.findOne({channel: channelName})
            .then((channel) =>{
                console.log(channel)
            })
            .catch((err) =>{
                console.log(err);
            })
    })
}