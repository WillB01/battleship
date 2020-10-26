const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));

const PORT = process.env.PORT || 3231;

const socketManager = require('./socketManager');

app.use(express.static(__dirname + '/../../build'));

io.on('connect', (socket) => {
  socket.emit('hello', 'can you hear me?');
});

server.listen(PORT, () => {
  console.log('Connected to port:' + PORT);
});
