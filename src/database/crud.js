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
          ready: false,
        },
        playerTwo: {
          id: playerTwoId,
          name: playerTwoName,
          attackLocation: [{ x: '', y: '' }],
          shipLocation: [{ x: '', y: '', id: '', size: '' }],
          ready: false,
        },
      },
    });
  return ref.key;
};

export const gamesRef = firebase.database().ref('/games');

export const fetchGames = () => gamesRef.once('value', snapshot => snapshot);

export const fetchGameById = gameId =>
  gamesRef.child(`${gameId}`).once('value', snapshot => snapshot);

export const removeGameById = gameId => gamesRef.child(`${gameId}`).remove();

export const setGameStatus = (id, status) => {
  const ref = firebase.database().ref(`/games/${id}`);
  ref.update({ status: status });
};

export const updateShipLocation = (gameId, shipLocation, player) => {
  const ref = firebase.database().ref(`/games/${gameId}`);
  const shipLocationRef = ref.child(`game/${player}/shipLocation`);

  shipLocationRef.push(shipLocation);
};

export const addPlayerTwo = (gameId, playerTwoId) => {
  const ref = firebase.database().ref(`/games/${gameId}/game/playerTwo`);
  ref.update({ id: playerTwoId });
};

export const removePlayerTwo = (gameId, playerTwoId) => {
  const ref = firebase.database().ref(`/games/${gameId}/game/playerTwo`);
  ref.update({ id: '' });
};

////////////////////////////////
///GAME PLAY///////////////////
//////////////////////////////

////////////////////////////////
///SOCKETS/////////////////////
//////////////////////////////
export const setSockets = sockets => {
  firebase.database().ref('/').child('/sockets').set(sockets);
};
