const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));

const PORT = process.env.PORT || 3231;

app.use(express.static(__dirname + '/../../build'));

io.on('connect', socket => {
  socket.join('mainRoom');
});

io.on('connection', socket => {
  // creates new room for users
  socket.on('createRoom', data => {
    socket.join(data.roomName);
    data.rooms.push({ name: data.roomName, hostId: socket.id, opponentId: '' });
    io.to('mainRoom').emit('newRoom', data);
    socket.leave('mainRoom');
    console.log('ROOM', socket.rooms);
  });
  ///////////////////////////////
  // join room
  socket.on('joinRoom', data => {
    io.of('/')
      .in(data.roomName)
      .clients((error, clients) => {
        if (error) throw error;

        console.log('[NUMBER OF CLIENTS]', clients, clients.length);

        if (clients.length === 2) {
          return;
        }

        socket.join(data.roomName);
        io.to('mainRoom').emit('joinRoom', data);
        socket.leave('mainRoom');

        // io.sockets.emit('newRoom', data);
        console.log('ROOM', data.roomName);
        // Returns an array of client IDs like ["Anw2LatarvGVVXEIAAAD"]
      });
  });
  //////////////////////////////////////

  socket.on('boardClick', data => {
    // console.log('[SERVER KEWL]', data);
    // io.sockets.emit('clickHandler', data);
    console.log(data);

    // io.to('room1').br('clickHandler', data);
  });
});

server.listen(PORT, () => {
  console.log('Connected to port:' + PORT);
});
