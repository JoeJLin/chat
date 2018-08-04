module.exports = (io, socket, onlineUsers) => {
    socket.emit('init', socket.id)
    console.log('connected socket ' + socket.id);

    //handle chat event
    socket.on('publicChat', function (data) {
        io.emit('publicChat', data)
        console.log(data);
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
        console.log(data)
    });

    socket.on('disconnect', function(){
        console.log(socket.username)
        console.log('a user left ' + onlineUsers[socket.username]);
        delete onlineUsers[socket.username];
        io.emit('a user left', onlineUsers);
    });

    socket.on('new user', (username)=>{
        socket['username'] = username;
        onlineUsers[username] = socket.id;
        io.emit('new user', onlineUsers);
    });
    
    socket.on('private message', (data)=> {
        console.log(`private message by ${data.sender} to ${data.receiver}`);
        //check if receiver is online
        if(data.receiver in onlineUsers){
            console.log('SENDING A PRIVATE MESSAGE!!!!!!' + onlineUsers[data.receiver])
            //write one for sender and receiver
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