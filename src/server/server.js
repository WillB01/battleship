const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));
const actions = require('./socketActions');

const PORT = process.env.PORT || 3231;

app.use(express.static(__dirname + '/../../build'));

io.on('connect', socket => {
  socket.join('mainRoom');
});

io.on('connection', socket => {
  ///////////////////////////////
  // create room
  /////////////////////////////
  socket.on(actions.CREATE_ROOM, data => {
    console.log(actions);
    socket.join(data.roomName);
    data.rooms.push({ name: data.roomName, hostId: data.id });
    io.to('mainRoom').emit(actions.NEW_ROOM, data);
    socket.leave('mainRoom');
    io.to(socket.id).emit(actions.WAITING_FOR_PLAYER_TWO);
  });
  ///////////////////////////////
  // join room
  /////////////////////////////
  socket.on('joinRoom', data => {
    io.of('/')
      .in(data.roomName)
      .clients((error, clients) => {
        if (error) throw error;

        if (clients.length === 2) {
          return;
        }

        socket.join(data.roomName);
        io.to(data.roomName).emit(actions.JOIN_ROOM, data);
        io.to(data.roomName).emit('startGame');
        io.emit('removeRoom', data);

        socket.leave('mainRoom');
      });
  });
  ///////////////////////////////
  // Board click
  /////////////////////////////
  socket.on(actions.ATTACK_SHIP, data => {
    io.to(data.gameName).emit(actions.ATTACK_SHIP_HANDLER, data);
  });
});

server.listen(PORT, () => {
  console.log('Connected to port:' + PORT);
});
