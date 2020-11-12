import React, { useContext, useState, useEffect, Children } from 'react';

import socketActions from '../../services/socketActions';

import Board from '../Boards/SharedBoard/Board';
import PrivateBoard from '../Boards/PrivateBoard/PrivateBoard';

import { GameContext } from '../../context/storeContext';

import styles from './Game.module.scss';

const Game = ({ socket, index }) => {
  const {
    state: { currentGame },
    dispatch,
  } = useContext(GameContext);

  useEffect(() => {
    socket.on(socketActions.ATTACK_SHIP_HANDLER, game => {
      console.log(game);
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: {
          game,
        },
      });
    });
  }, []);

  useEffect(() => {
    socket.on('ADD-SHIP-LOCATION-HANDLER', data => {
      dispatch({ type: 'ADD-SHIP-LOCATION', payload: { ...data } });
    });
  }, []);

  const boardClickHandler = (x, y, boardType) => {
    socket.emit(socketActions.ATTACK_SHIP, {
      boardType: boardType,
      x: x,
      y: y,
      gameId: currentGame.id,
      game: currentGame.game,
    });
  };

  console.log('GAME STATE', currentGame);

  return (
    <div>
      <Board onClick={boardClickHandler} socket={socket} />
      <PrivateBoard socket={socket} />
    </div>
  );
};

export default Game;
