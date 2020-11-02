import React, { useContext, useState, useEffect } from 'react';

import socketActions from '../../services/socketActions';

import Board from '../Board/Board';

import { GameContext } from '../../context/storeContext';

import styles from './Game.module.scss';

const Game = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);
  const [showBoard, setShowBoard] = useState(false);
  const [gameHosted, setGameHosted] = useState(false);

  useEffect(() => {
    //clean up later
    socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: {
          state: data.state,
        },
      });
    });
  }, []);

  useEffect(
    () => {
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
    },
    [],
    () => socket.close()
  );

  const boardClickHandler = (x, y) => {
    if (state.board[y][x - 1] === undefined) {
      alert('no');
    }
    socket.emit(socketActions.ATTACK_SHIP, {
      x: x,
      y: y,
      gameName: state.game.name,
      attackingPlayerId: socket.id,
      state: state,
    });
  };

  return (
    <>
      {state.game.name}
      {showBoard && <div>player 1: {state.game.playerOne.name}</div>}
      {showBoard && <div>player 2: {state.game.playerTwo.name}</div>}

      {gameHosted && !showBoard && (
        <div className={styles.wating}>
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
          wating for player two
        </div>
      )}
      {showBoard && <Board onClick={boardClickHandler} socket={socket} />}
    </>
  );
};

export default Game;
