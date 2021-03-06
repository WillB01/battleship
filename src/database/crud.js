import config from '../config';

import firebase from 'firebase';

firebase.initializeApp(config);
///////////////////////////////
///GAME///////////////////////
//////////////////////////////

export const gamesRef = firebase.database().ref('/games');
export const activeGamesRef = firebase.database().ref('/activeGames');

export const fetchGames = () => gamesRef.once('value', snapshot => snapshot);

export const fetchActiveGameById = gameId =>
  activeGamesRef.child(`${gameId}`).once('value', snapshot => snapshot);

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
