import React, { useContext, useState, useEffect } from 'react';

import socketActions from '../../server/socketActions';

import Board from '../Board/Board';

import { RoomsContext, GameContext } from '../../context/storeContext';

const Game = ({ socket }) => {
  const { state: rState } = useContext(RoomsContext);
  const { state, dispatch } = useContext(GameContext);
  const [showBoard, setShowBoard] = useState(false);
  const [gameHosted, setGameHosted] = useState(false);

  useEffect(() => {
    socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
      console.log('[AFTER CLICK]', state);
    });
  }, []);

  useEffect(() => {
    socket.on(socketActions.JOIN_ROOM, () => {
      setShowBoard(true);
    });
  }, []);

  useEffect(() => {
    socket.on(socketActions.WAITING_FOR_PLAYER_TWO, () => {
      setGameHosted(true);
    });
  }, []);

  useEffect(() => {
    socket.on('gameHosted', () => {
      setGameHosted(true);
    });
  }, []);

  const boardClickHandler = (x, y) => {
    socket.emit(socketActions.ATTACK_SHIP, { x: x, y: y });
  };

  return (
    <>
      {gameHosted && !showBoard && <h1>wating for player two</h1>}
      {showBoard && <Board onClick={boardClickHandler} />}
    </>
  );
};

export default Game;
