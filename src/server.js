const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:4200",
    credentials: true
  }
});

const rooms = [];


io.sockets.on('connection', function(socket) {
  console.log('Connecting to server...');
  socket.emit('rooms', rooms);

  socket.on('disconnect', function () {
    console.log('Disconnecting from server...');
  });

  socket.on('join', function ([r, user]) {
    if (!rooms.some(elem => elem.id === r.id)) {
      console.log(`Creating room ${r.id}...`);
      rooms.push(r);
      io.emit('rooms', rooms);
    }

    const room = rooms.find(elem => elem.id === r.id);
    console.log(`Joining room ${room.id}...`);
    room.users.push(user);
    socket.join(room.id);
    io.emit('joined', room);

    socket.on('start', function ([state]) {
      console.log(`Starting room ${room.id}...`);
      io.in(room.id).emit('started', state);
    });

    socket.on('update', function ([state]) {
      console.log(`Updating room ${room.id}...`);
      io.in(room.id).emit('updated', state);
    });

    socket.on('disconnect', function () {
      console.log(`Leaving room ${room.id}...`);
      room.users.splice(room.users.indexOf(user), 1);
      if (room.users.length === 0) {
        console.log(`Destroying room ${room.id}...`);
        rooms.splice(rooms.indexOf(room), 1);
      }
      io.emit('rooms', rooms);
    });
  });
});

server.listen({port: 3000}, () => {
  console.log('Listening on port 3000.');
});
