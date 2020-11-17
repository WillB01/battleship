import { socket } from '../server/socket';

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

function getArraysIntersection(a1, a2) {
  return a1.filter(function (n) {
    return a2.indexOf(n) !== -1;
  });
}

export const isOccupied = (board, clickPosition, shipSize, id) => {
  let tempStart = clickPosition.x;

  let start = clickPosition.x;

  const tempBoard = [];
  let tempNewArray = ['', '', '', '', '', '', '', '', '', ''];

  for (let i = 0; i < 10; i++) {
    if (board[clickPosition.y][i] !== '') {
      tempBoard[i] = board[clickPosition.y][i][0];
    } else {
      tempBoard[i] = '-';
    }
  }

  for (let i = 0; i < 10; i++) {
    if (board[clickPosition.y][i] !== '') {
      tempNewArray[i] = id;
    }
  }

  // for (let i = 0; i < tempNewArray.length; i++) {
  //   if (tempNewArray[i] === '') {
  //     tempNewArray = tempNewArray.splice(i, 1);
  //   }
  // }

  // tempBoard.map((item, i) => {
  //   tempNewArray[i]
  // })

  console.log(tempBoard);
  console.log(tempNewArray);

  return true;
};

export const isEventInElement = (event, element) => {
  const rect = element.getBoundingClientRect();
  const x = event.clientX;
  if (x < rect.left || x >= rect.right) return false;
  const y = event.clientY;
  if (y < rect.top || y >= rect.bottom) return false;
  return true;
};

export const getPlayerKey = (playerOneId, socketId) =>
  playerOneId === socketId ? 'playerOne' : 'playerTwo';

export const getOpponentPlayerKey = (playerOneId, socketId) =>
  playerOneId === socketId ? 'playerTwo' : 'playerOne';

export const checkIfSkipSunk = (playerAttackLocation, size, id) => {
  const temp = [...playerAttackLocation];
  const filteredLocations = temp.filter(
    location => location.shipSize === size && location.shipId === id
  );

  if (filteredLocations.length === size) {
    return filteredLocations;
  }

  return null;
};
