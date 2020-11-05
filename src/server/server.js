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
    //TODO REFACTOR
    // PLAYER ONE //////////////

    const { boardType, game, gameName } = data;

    const p1 = 'p1';
    const p1Ship = 'p1-ship';
    const p2 = 'p2';
    const p2Ship = 'p2-ship';

    if (game.playerOne.id === socket.id && game.playerTurn === 'PLAYER-ONE') {
      if (boardType === p1 || boardType === p2 || boardType === p1Ship) {
        console.log('ALREADY ATTACKED');
        return;
      }

      // if player hit enemy ship same player turn
      if (boardType === p2Ship) {
        game.playerTurn = 'PLAYER-ONE';
      } else {
        game.playerTurn = 'PLAYER-TWO';
      }

      game.board[data.y][data.x] = p1;

      game.playerOne.attackLocation.push({
        x: data.x,
        y: data.y,
        type: data.boardType,
      });

      return io.to(gameName).emit(actions.ATTACK_SHIP_HANDLER, game);
    }

    // PLAYER TWO //////////////
    if (game.playerTwo.id === socket.id && game.playerTurn === 'PLAYER-TWO') {
      if (boardType === p1 || boardType === p2 || boardType === p2Ship) {
        console.log('ALREADY ATTACKED');
        return;
      }

      // if player hit enemy ship same player turn
      if (boardType === p1Ship) {
        game.playerTurn = 'PLAYER-TWO';
      } else {
        game.playerTurn = 'PLAYER-ONE';
      }

      game.board[data.y][data.x] = p2;

      game.playerTwo.attackLocation.push({
        x: data.x,
        y: data.y,
        type: data.boardType,
      });

      return io.to(gameName).emit(actions.ATTACK_SHIP_HANDLER, game);
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
