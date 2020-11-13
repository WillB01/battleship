import React, {
  useContext,
  useState,
  useEffect,
  Children,
  useRef,
} from 'react';

import { GameContext } from '../../context/storeContext';

import socketActions from '../../services/socketActions';
import Board from '../Boards/SharedBoard/Board';
import PrivateBoard from '../Boards/PrivateBoard/PrivateBoard';

import styles from './Game.module.scss';

const Game = ({ socket, index }) => {
  const {
    state: { currentGame, privateBoard },
    dispatch,
  } = useContext(GameContext);

  const playerRef = useRef();

  useEffect(() => {
    dispatch({ type: 'SET-USER-STATUS', paylaod: 'ACTIVE' });
  }, []);

  useEffect(() => {
    socket.emit('JOIN-GAME', currentGame.id);
  }, []);

  useEffect(() => {
    playerRef.current =
      currentGame.game.playerOne.id === socket.id ? 'playerOne' : 'playerTwo';
  }, []);

  useEffect(() => {
    socket.on('PLAYER-IS-READY-TO-START-HANDLER', player => {
      dispatch({
        type: 'PLAYER-IS-READY-TO-START',
        payload: player,
      });
    });
  }, []);

  useEffect(() => {
    socket.on(socketActions.ATTACK_SHIP_HANDLER, game => {
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: game,
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

  const readyButtonHandler = () => {
    socket.emit('PLAYER-IS-READY-TO-START', {
      player: playerRef.current,
      id: currentGame.id,
    });
  };

  const isBothReady =
    currentGame.game.playerOne.ready && currentGame.game.playerTwo.ready;

  return (
    <div>
      {isBothReady && <Board onClick={boardClickHandler} socket={socket} />}

      {playerRef.current &&
        !currentGame.game[playerRef.current].ready &&
        privateBoard.isAllDropped && (
          <button onClick={readyButtonHandler}>ready up</button>
        )}
      <PrivateBoard socket={socket} />
    </div>
  );
};

export default Game;
