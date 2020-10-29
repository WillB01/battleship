const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));
const actions = require('./socketActions');

const PORT = process.env.PORT || 3231;
const MAIN_ROOM = 'MAIN_ROOM';

app.use(express.static(__dirname + '/../../build'));

io.on('connect', socket => {
  socket.join(MAIN_ROOM);
});

io.on('connection', socket => {
  ///////////////////////////////
  // create room
  /////////////////////////////
  socket.on(actions.CREATE_ROOM, data => {
    socket.join(data.roomName);
    data.rooms.push({
      name: data.roomName,
      hostId: data.id,
      hostName: data.hostName,
    });
    socket.leave(MAIN_ROOM);

    io.to(MAIN_ROOM).emit(actions.CREATE_ROOM_HANDLER, data);
    io.to(socket.id).emit(actions.WAITING_FOR_PLAYER_TWO);
  });
  ///////////////////////////////
  // join room
  /////////////////////////////
  socket.on(actions.JOIN_ROOM, data => {
    io.of('/')
      .in(data.roomName)
      .clients((error, clients) => {
        if (error) throw error;

        if (clients.length === 2) {
          return;
        }

        socket.join(data.roomName);
        io.to(data.roomName).emit(actions.JOIN_ROOM_HANDLER, data);
        io.emit('removeRoom', data);
        socket.leave(MAIN_ROOM);
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
