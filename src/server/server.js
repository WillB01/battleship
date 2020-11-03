const express = require('express');
const { type } = require('os');
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
  io.to(MAIN_ROOM).emit('getConnectedSockets', sockets);
});

io.on('connection', socket => {
  socket.on('disconnect', socket => {
    const sockets = Object.keys(io.sockets.sockets);
    io.to(MAIN_ROOM).emit('getConnectedSockets', sockets);
  });

  //JOIN PRIVATE GAME ROOM
  socket.on('JOIN-GAME', gameName => {
    socket.join(gameName);
    socket.leave(MAIN_ROOM);
  });

  ///////////////////////////////
  // Board click
  /////////////////////////////
  socket.on(actions.ATTACK_SHIP, data => {
    // refactor duplicate code
    //player one
    if (
      data.state.game.playerOne.id === socket.id &&
      data.state.game.playerTurn === 'PLAYER-ONE'
    ) {
      data.state.game.playerOne.attackLocation.push({
        x: data.x,
        y: data.y,
      });

      data.state.game.playerTurn = 'PLAYER-TWO';

      data.state.board[data.y][data.x - 1] = 'p1';

      return io.to(data.gameName).emit(actions.ATTACK_SHIP_HANDLER, data);
    }

    //player two
    if (
      data.state.game.playerTwo.id === socket.id &&
      data.state.game.playerTurn === 'PLAYER-TWO'
    ) {
      data.state.game.playerTwo.attackLocation.push({
        x: data.x,
        y: data.y,
      });

      data.state.game.playerTurn = 'PLAYER-ONE';

      data.state.board[data.y][data.x - 1] = 'p2';

      return io.to(data.gameName).emit(actions.ATTACK_SHIP_HANDLER, data);
    }
  });
  /////////////////////////////////
  /////////////////////////////////

  //////////////////////////////
  //CHAT//////////////////////
  /////////////////////////
  socket.on('sendMessage', data => {
    if (data.type === 'private') {
      console.log('DATAAAAA', data);

      io.to(data.gameName).emit('sendMessageHandler', data);
    }
    if (data.type === 'public') {
      io.to(MAIN_ROOM).emit('sendMessageHandler', data);
    }
  });
});

server.listen(PORT, () => {
  console.log('Connected to port:' + PORT);
});
