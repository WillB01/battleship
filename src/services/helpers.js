export const getOfflineHosts = (rooms, sockets) => {
  const removeIds = [];
  rooms.forEach(v => {
    console.log(v);
    if (!sockets.includes(v.hostId)) {
      removeIds.push(v.firebaseId);
    }
  });

  return removeIds;
};
