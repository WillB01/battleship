export const getOfflineHosts = (games, sockets) => {
  const removeIds = [];
  games.forEach(v => {
    console.log(v);
    if (!sockets.includes(v.hostId)) {
      removeIds.push(v.firebaseId);
    }
  });

  return removeIds;
};

export const isUserOnline = (socketId, sockets) => {
  for (const key in sockets) {
    if (sockets[key] === socketId) {
      return true;
    }
  }
  return false;
};
