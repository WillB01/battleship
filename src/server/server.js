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

  socket.on('GAME-HOSTED', game => {
    io.to(MAIN_ROOM).emit('GAME-HOSTED-HANDLER', game);
  });

  //JOIN PRIVATE GAME ROOM
  socket.on('JOIN-GAME', gameId => {
    socket.join(gameId);
    socket.leave(MAIN_ROOM);
  });

  // UPDATE GAME STATUS AND RERENDER
  socket.on('UPDATE-GAME-LIST', () => {
    io.to(MAIN_ROOM).emit('UPDATE-GAME-LIST-HANDLER');
  });

  //USER JOINS HOSTED GAME
  socket.on('JOIN-HOST', playerOneId => {
    io.to(playerOneId).emit('JOIN-HOST-HANDLER');
    io.to(MAIN_ROOM).emit('UPDATE-GAME-LIST-HANDLER');
  });
  ///////////////////////////////
  //ADD SHIP LOCATION
  /////////////////////////////
  socket.on('ADD-SHIP-LOCATION', game => {
    io.to(game.currentGame.id).emit('ADD-SHIP-LOCATION-HANDLER', game);
  });

  socket.on('PLAYER-IS-READY-TO-START', game => {
    console.log(game);
    io.to(game.id).emit('PLAYER-IS-READY-TO-START-HANDLER', game.player);
  });

  /////////////////////////////////
  /////////////////////////////////

  ///////////////////////////////
  // Board click
  /////////////////////////////
  socket.on(actions.ATTACK_SHIP, data => {
    //TODO REFACTOR
    // PLAYER ONE //////////////

    const { boardType, game, gameId } = data;

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

      return io.to(gameId).emit(actions.ATTACK_SHIP_HANDLER, game);
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

      return io.to(gameId).emit(actions.ATTACK_SHIP_HANDLER, game);
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
