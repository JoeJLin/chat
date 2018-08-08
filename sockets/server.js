module.exports = (io, socket, onlineUsers, channels) => {
    socket.emit('init', socket.id)
    console.log('connected socket ' + socket.id);

    //handle chat event
    socket.on('publicChat', function (data) {
        socket.broadcast.emit('publicChat', data)
        socket.emit('publicChat', data)
        console.log(data);
    });

    // socket.on('typing', function (data) {
    //     socket.broadcast.emit('typing', data);
    //     console.log(data)
    // });

    socket.on('disconnect', function(){
        console.log(socket.username)
        console.log('a user left ' + onlineUsers[socket.username]);
        delete onlineUsers[socket.username];
        io.emit('a user left', onlineUsers);
    });

    socket.on('new user', (username)=>{
        socket['username'] = username;
        onlineUsers[username] = socket.id;
        socket.join('General');
        io.emit('users list', onlineUsers);
        io.emit('user in channel', io.sockets.adapter.rooms['General'].length)
    });
    
    socket.on('switch channel', (oldChannel, newChannel) =>{
        console.log('switching channel!!');
        // socket.leave(oldChannel);
        console.log(io.sockets.adapter.rooms[newChannel].length)
        socket.join(newChannel);
        socket.emit('switch channel', channels[newChannel], newChannel);
    })

    socket.on('create new channel', (oldChannel, newChannel)=>{
        console.log('created and join new channel ' + newChannel)
        channels[newChannel] = [];
        // socket.leave(oldChannel);
        socket.join(newChannel);
        socket.broadcast.emit('new channel', newChannel);
        socket.emit('switch channel', channels[newChannel], newChannel);
    })

    socket.on('channel messages', (data)=>{
        console.log(data.username + 'you are in server channel messages ' + data.channel);
        data['time'] = new Date().toLocaleTimeString();
        console.log('messages ' + data.time);
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

    socket.on('room chat', function(data){
        console.log('YOU ARE IN ' + data.room)
        io.to(data.room).emit('room', data);
    })

    socket.on('join room', function(data){
        console.log('JOIN ' + data);
        socket.join(data);
    })

    socket.on('leave room', function(data){
        console.log('LEAVE ' + data);
        socket.leave(data);
    })
}