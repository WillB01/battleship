import React, { useContext, useState, useEffect, Children } from 'react';

import socketActions from '../../services/socketActions';

import Board from '../Boards/SharedBoard/Board';
import PrivateBoard from '../Boards/PrivateBoard/PrivateBoard';

import { GameContext } from '../../context/storeContext';
import { getGameById } from '../../database/crud';

import styles from './Game.module.scss';

const Game = ({ socket, index }) => {
  const {
    state: { currentGame },
    dispatch,
  } = useContext(GameContext);

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
      gameName: currentGame.name,
      game: currentGame.game,
    });
  };

  console.log('GAME STATE', currentGame);

  return (
    <div>
      <PrivateBoard socket={socket} />
      <Board onClick={boardClickHandler} socket={socket} />
    </div>
  );
};

export default Game;
