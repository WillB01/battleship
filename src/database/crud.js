import React from 'react';
import config from '../config';

import firebase from 'firebase';
import { boardBlueprint } from '../services/boardBlueprint';

firebase.initializeApp(config);

//////////////////////////////
///ROOMS//////////////////////
//////////////////////////////

export const addNewRoom = (hostId, hostName, roomName, cb) => {
  firebase.database().ref('/').child('/rooms').push(
    {
      hostId,
      hostName,
      roomName,
      status: 'WAITING-PLAYER-TWO',
    },
    cb()
  );
};

export const changeRoomStatus = (status, id) => {
  const ref = firebase.database().ref(`/rooms/${id}`);
  ref.update({ status: status });
};

export const getAllRooms = cb => {
  const db = firebase.database().ref('/rooms');

  if (cb) {
    db.on('value', snapshot => {
      const data = [];
      snapshot.forEach((child, i) => {
        data.push({ ...child.val(), firebaseId: child.key });
      });
      cb(data);
    });
  }
};

export const removeRoom = (sockets, data) => {
  if (!data) {
    return;
  }

  const db = firebase.database().ref('/rooms');
  const removeIds = [];
  data.forEach(v => {
    console.log(v);
    if (!sockets.includes(v.hostId)) {
      removeIds.push(v.firebaseId);
    }
  });

  if (removeIds) {
    removeIds.forEach(id => {
      if (id) {
        db.child(id).set(null);
      }
    });
  }
};

export const getRoomById = (roomId, cb) => {
  const ref = firebase.database().ref(`/rooms/${roomId}`);
  ref.on('value', snapshot => cb({ ...snapshot.val(), roomId }));
};

///////////////////////////////////////////

//////////////////////////////
///GAME//////////////////////
//////////////////////////////

export const createGame = (
  { roomId, roomName, playerOneId, playerOneName, playerTwoId, playerTwoName },
  cb
) => {
  const ref = firebase
    .database()
    .ref('/')
    .child('/games')
    .push({
      roomId: roomId,
      board: boardBlueprint,
      game: {
        name: roomName,
        playerTurn: 'PLAYER-ONE',
        playerOne: {
          id: playerOneId,
          name: playerOneName,
          attackLocation: [{ x: '', y: '' }],
          shipLocation: [{ x: '', y: '' }],
        },
        playerTwo: {
          id: playerTwoId,
          name: playerTwoName,
          attackLocation: [{ x: '', y: '' }],
          shipLocation: [{ x: '', y: '' }],
        },
      },
    });
  return ref.key;
};

export const getGameById = (id, cb) => {
  const ref = firebase.database().ref(`/games/${id}`);
  ref.on('value', snapshot => cb({ ...snapshot.val() }));
};
