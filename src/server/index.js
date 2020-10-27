const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));

const PORT = process.env.PORT || 3231;

app.use(express.static(__dirname + '/../../build'));

io.on('connection', (socket) => {
  socket.emit('hello', 'can you hear me?');

  socket.on('boardClick', (data) => {
    console.log('[SERVER KEWL]', data);
    io.sockets.emit('clickHandler', data);
  });
});

server.listen(PORT, () => {
  console.log('Connected to port:' + PORT);
});
