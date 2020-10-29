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
      console.log('my id', socket.id);
      console.log(data);
      console.log('STATE', state);
    });
  }, []);

  useEffect(() => {
    socket.on(socketActions.JOIN_ROOM_HANDLER, data => {
      setShowBoard(true);
      dispatch({
        type: 'START-GAME',
        payload: { ...data },
      });
    });

    socket.on(socketActions.WAITING_FOR_PLAYER_TWO, () => {
      setGameHosted(true);
    });
  }, []);

  const boardClickHandler = (x, y) => {
    socket.emit(socketActions.ATTACK_SHIP, {
      x: x,
      y: y,
      gameName: state.game.name,
      attackingPlayerId: socket.id,
    });
  };

  return (
    <>
      {state.game.name}
      {showBoard && <div>player 1: {state.game.playerOne.name}</div>}
      {showBoard && <div>player 2: {state.game.playerTwo.name}</div>}

      {gameHosted && !showBoard && <h1>wating for player two</h1>}
      {showBoard && <Board onClick={boardClickHandler} />}
    </>
  );
};

export default Game;
