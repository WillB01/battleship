import React, { useContext, useState, useEffect } from 'react';

import socketActions from '../../services/socketActions';

import Board from '../Board/Board';

import { GameContext } from '../../context/storeContext';

const Game = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);
  const [showBoard, setShowBoard] = useState(false);
  const [gameHosted, setGameHosted] = useState(false);

  useEffect(() => {
    socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
      console.log('[AFTER CLICK]', state);
    });
  }, []);

  useEffect(() => {
    socket.on(socketActions.JOIN_ROOM, data => {
      setShowBoard(true);
      dispatch({
        type: 'START-GAME',
        payload: data.roomName,
      });
    });

    socket.on(socketActions.WAITING_FOR_PLAYER_TWO, () => {
      setGameHosted(true);
    });
  }, []);

  useEffect(() => {
    socket.on('gameHosted', () => {
      setGameHosted(true);
    });
  }, []);

  const boardClickHandler = (x, y, kewl) => {
    console.log('STATE', kewl);
    socket.emit(socketActions.ATTACK_SHIP, { x: x, y: y });
  };

  return (
    <>
      {state.game.name}
      {gameHosted && !showBoard && <h1>wating for player two</h1>}
      {showBoard && <Board onClick={boardClickHandler} />}
    </>
  );
};

export default Game;
