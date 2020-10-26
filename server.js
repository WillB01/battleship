// const express = require('express');
// const http = require('http');
// const app = express();
// const server = http.createServer(app);
// const socket = require('socket.io');
// const io = socket(server);

// io.on('connection', (socket) => {
//   socket.emit('your id', socket.id);
//   socket.on('send message', (body) => {
//     io.emit('message', body);
//   });
// });

// server.listen(process.env.PORT || 8000, () =>
//   console.log('server is running on port 8000')
// );

// const path = require('path');
// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const port = process.env.PORT || 8080;

// app.use(express.static(path.join(__dirname, '../../build')));

// app.get('/', (req, res, next) => res.sendFile(__dirname + './index.html'));

// // sockets test
// io.on('connection', (socket) =>
//   socket.emit('hello', { message: 'hello from server!' })
// );

// server.listen(port);
