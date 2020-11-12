import React from 'react';
import config from '../config';

import firebase from 'firebase';
import { boardBlueprint } from '../services/boardBlueprint';

firebase.initializeApp(config);
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
          attackLocation: [{ x: '', y: '', type: '' }],
          shipLocation: [{ x: '', y: '', id: '', size: '' }],
        },
        playerTwo: {
          id: playerTwoId,
          name: playerTwoName,
          attackLocation: [{ x: '', y: '' }],
          shipLocation: [{ x: '', y: '', id: '', size: '' }],
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
  ref.on('value', snapshot => cb({ ...snapshot.val() }, snapshot.key));
};

export const setGameStatus = (id, status) => {
  const ref = firebase.database().ref(`/games/${id}`);
  ref.update({ status: status });
};

export const deleteGame = gameId => {
  const ref = firebase.database().ref(`/games/${gameId}`);
  ref.set(null);
};

export const setGameActive = (gameId, playerTwoId, playerTwoName) => {
  getGameById(gameId, game => {
    game.status = 'ACTIVE';
    game.game.playerTwo = {
      ...game.game.playerTwo,
      id: playerTwoId,
      name: playerTwoName,
    };
    const ref = firebase.database().ref(`/games/${gameId}`);
    ref.update(game);
  });
};

export const updateShipLocation = (gameId, shipLocation, player) => {
  const ref = firebase.database().ref(`/games/${gameId}`);
  const shipLocationRef = ref.child(`game/${player}/shipLocation`);

  shipLocationRef.push(shipLocation);
};

////////////////////////////////
///GAME PLAY///////////////////
//////////////////////////////

////////////////////////////////
///SOCKETS/////////////////////
//////////////////////////////
export const updateSockets = sockets => {
  firebase.database().ref('/').child('/sockets').set(sockets);
};
