import React from 'react';
import config from '../config';

import firebase from 'firebase';
import { boardBlueprint } from '../services/boardBlueprint';

firebase.initializeApp(config);

//////////////////////////////
///ROOMS//////////////////////
//////////////////////////////

export const removeRoom = (sockets, data) => {
  if (!data) {
    return;
  }

  const db = firebase.database().ref('/rooms');
  const removeIds = [];
  data.forEach(r => {
    if (!sockets.includes(r.hostId)) {
      removeIds.push(r.firebaseId);
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

///////////////////////////////////////////

///////////////////////////////
///GAME///////////////////////
//////////////////////////////
export const createGame = (
  { status, gameName, playerOneId, playerOneName, playerTwoId, playerTwoName },
  cb
) => {
  const ref = firebase
    .database()
    .ref('/')
    .child('/games')
    .push({
      status: status,
      name: gameName,
      game: {
        board: boardBlueprint,
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

export const getAllGames = cb => {
  const db = firebase.database().ref('/games');

  return db.on('value', snapshot => {
    const data = [];
    snapshot.forEach((child, i) => {
      data.push({ ...child.val(), id: child.key });
    });
    cb(data);
  });
};

export const getGameById = (id, cb) => {
  const ref = firebase.database().ref(`/games/${id}`);
  ref.on('value', snapshot => cb({ ...snapshot.val() }));
};

export const setGameStatus = (id, status) => {
  const ref = firebase.database().ref(`/games/${id}`);
  ref.update({ status: status });
};

export const deleteGame = gameId => {
  const ref = firebase.database().ref(`/games/${gameId}`);
  ref.set(null);
};

////////////////////////////////
///SOCKETS/////////////////////
//////////////////////////////
export const updateSockets = sockets => {
  firebase.database().ref('/').child('/sockets').set(sockets);
};
