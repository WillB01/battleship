import React, { useContext, useState, useEffect, Children } from 'react';

import socketActions from '../../services/socketActions';

import Board from '../Board/Board';

import { GameContext } from '../../context/storeContext';
import { getGameById } from '../../database/crud';

import styles from './Game.module.scss';

const Game = ({ socket, index }) => {
  const { state, dispatch } = useContext(GameContext);

  useEffect(() => {
    //clean up later
    socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: {
          index: index,
          game: data.game,
        },
      });
    });
  }, []);

  const boardClickHandler = (x, y, itemItem) => {
    // TODO REFACTOR
    console.log('ITEMITEM', itemItem);
    // player one hits enemy
    if (
      itemItem === 'p1' &&
      socket.id === state.games[index].game.playerOne.id
    ) {
      return alert('friendly fire');
    }

    if (
      itemItem === 'p2' &&
      socket.id === state.games[index].game.playerOne.id
    ) {
      alert('YEAH HIT');
    }

    // player two hits enemy
    if (
      itemItem === 'p2' &&
      socket.id === state.games[index].game.playerTwo.id
    ) {
      return alert('friendly fire');
    }

    if (
      itemItem === 'p1' &&
      socket.id === state.games[index].game.playerTwo.id
    ) {
      alert('YEAH HIT');
    }

    console.log(state.games[index].game);
    socket.emit(socketActions.ATTACK_SHIP, {
      x: x,
      y: y,
      gameName: state.games[index].name,
      attackingPlayerId: socket.id,
      game: state.games[index].game,
    });
  };

  return (
    <div>
      <Board onClick={boardClickHandler} socket={socket} index={index} />
    </div>
  );
};

export default Game;
