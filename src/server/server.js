const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));
const actions = require('./socketActions');

const PORT = process.env.PORT || 3231;
const MAIN_ROOM = 'MAIN_ROOM';

app.use(express.static(__dirname + '/../../build'));

io.on('connect', socket => {
  const sockets = Object.keys(io.sockets.sockets);
  socket.join(MAIN_ROOM);
  io.to(MAIN_ROOM).emit('USER-CONNECTS', sockets);
});

io.on('connection', socket => {
  socket.on('disconnect', socket => {
    const sockets = Object.keys(io.sockets.sockets);
    io.to(MAIN_ROOM).emit('USER-DISCONNECTS', sockets);
  });

  /////////////////////////////
  // OUTSIDE OF PLAYING GAME//
  ///////////////////////////

  // UPDATE GAME STATUS AND RERENDER
  socket.on('UPDATE-GAME-LIST', (gameId, socketId) => {
    socket.broadcast
      .to(MAIN_ROOM)
      .emit('UPDATE-GAME-LIST-HANDLER', gameId, socketId);
  });

  //USER JOINS HOSTED GAME
  socket.on('JOIN-HOST', playerOneId => {
    io.to(playerOneId).emit('JOIN-HOST-HANDLER');
    io.to(MAIN_ROOM).emit('UPDATE-GAME-LIST-HANDLER');
  });

  //PLAYER TWO IS RREADY TO PLAY
  socket.on('COMPLETES-PLAYER-TWO-FORM', hostId => {
    io.to(hostId).emit('COMPLETES-PLAYER-TWO-FORM-HANDLER');
  });

  /////////////////////////////////
  // OUTSIDE OF PLAYING GAME END//
  ///////////////////////////////

  /////////////////////////////////
  // ACTIVE GAME /////////////////
  ///////////////////////////////

  ///////////////////////////////
  //ADD SHIP LOCATION
  /////////////////////////////
  socket.on('ADD-SHIP-LOCATION', game => {
    io.to(game.id).emit('ADD-SHIP-LOCATION-HANDLER', game);
  });

  socket.on('PLAYER-IS-READY-TO-START', game => {
    io.to(game.id).emit('PLAYER-IS-READY-TO-START-HANDLER', game.player);
  });

  //JOIN PRIVATE GAME ROOM
  socket.on('JOIN-GAME', gameId => {
    socket.join(gameId);
    socket.leave(MAIN_ROOM);
  });

  ///////////////////////////////
  // Board click
  /////////////////////////////
  socket.on(actions.ATTACK_SHIP, (game, attackBoard, toPlayerId) => {
    io.to(toPlayerId).emit(
      actions.ATTACK_SHIP_HANDLER,
      game,
      attackBoard,
      toPlayerId
    );
    io.to(game.id).emit('WINNER-HANDLER', game);
    io.to(game.id).emit('MY-TURN', game);
  });

  /////////////////////////////////
  // ACTIVE GAME END /////////////
  ///////////////////////////////

  //////////////////////////////
  // CHAT /////////////////////
  ////////////////////////////
  socket.on('sendMessage', data => {
    if (data.type === 'private') {
      console.log('DATAAAAA', data);

      io.to(data.gameId).emit('sendMessageHandler', data);
    }
    if (data.type === 'public') {
      io.to(MAIN_ROOM).emit('sendMessageHandler', data);
    }
  });
});

server.listen(PORT, () => {
  console.log('Connected to port:' + PORT);
});
