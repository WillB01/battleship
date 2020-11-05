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
    socket.on(socketActions.ATTACK_SHIP_HANDLER, game => {
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: {
          index,
          game,
        },
      });
    });
  }, []);

  const boardClickHandler = (x, y, boardType) => {
    socket.emit(socketActions.ATTACK_SHIP, {
      boardType: boardType,
      x: x,
      y: y,
      gameName: state.games[index].name,
      game: state.games[index].game,
    });
  };

  console.log('game render state', state);

  return (
    <div>
      <Board onClick={boardClickHandler} socket={socket} index={index} />
    </div>
  );
};

export default Game;
