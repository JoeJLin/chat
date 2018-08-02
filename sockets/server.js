module.exports = (io, socket, onlineUsers) => {
    socket.emit('init', socket.id)
    console.log('connected socket ' + socket.id);

    //handle chat event
    socket.on('publicChat', function (data) {
        io.sockets.emit('publicChat', data)
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
        console.log(`private message by ${data.username} to ${data.receiver}`);
        //check if receiver is online
        if(data.receiver in onlineUsers){
            console.log('SENDING A PRIVATE MESSAGE!!!!!!' + onlineUsers[data.receiver])
            socket.to(onlineUsers[data.receiver]).emit('To receiver', data);
        }
    })

}