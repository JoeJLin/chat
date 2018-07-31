module.exports = (io, socket) => {
    console.log('connected socket');
    // console.log(socket.request)
    console.log(socket.id)

    //handle chat event
    socket.on('chat', function (data) {
        io.sockets.emit('chat', data)
        console.log(data);
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
        console.log(data)
    });
}