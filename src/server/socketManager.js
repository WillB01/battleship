const io = require('./index.js').io;

module.exports = function (socket) {
  socket.on('TEST', (user) => {
    console.log(user);
  });
};
