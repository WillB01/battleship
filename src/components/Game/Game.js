import React, { useContext, useEffect, useState } from 'react';

import styles from './Game.module.scss';

import { GameContext } from '../../context/storeContext';
import { socket } from '../../server/socket';
import { getPlayerKey, checkIfWin } from '../../services/helpers';

import socketActions from '../../services/socketActions';
import PrivateBoard from '../Boards/PrivateBoard/PrivateBoard';
import AttackBoard from '../Boards/AttackBoard/AttackBoard';
import MyTurn from '../ui/MyTurn/MyTurn';
import Modal from '../ui/Modal/Modal';

const Game = () => {
  const {
    state: { game, privateBoard },
    dispatch,
  } = useContext(GameContext);

  const [disabled, setDisabled] = useState(false);
  const [resetPrivateBoard, setResetPrivateBoard] = useState(false);

  useEffect(() => {
    socket.on('PLAYER-IS-READY-TO-START-HANDLER', player => {
      dispatch({
        type: 'PLAYER-IS-READY-TO-START',
        payload: player,
      });
    });
    return () => socket.off('PLAYER-IS-READY-TO-START-HANDLER');
  }, [socket.on]);

  useEffect(() => {
    socket.on('ADD-SHIP-LOCATION-HANDLER', data => {
      dispatch({ type: 'ADD-SHIP-LOCATION', payload: { ...data } });
    });

    return () => socket.off('ADD-SHIP-LOCATION-HANDLER');
  }, [socket.on]);

  useEffect(() => {
    socket.on('WINNER-HANDLER', game => {
      if (checkIfWin(game.playerOne.attackLocation)) {
        return dispatch({
          type: 'SET-WINNER',
          payload: { game, player: game.playerOne.name },
        });
      }
      if (checkIfWin(game.playerTwo.attackLocation)) {
        return dispatch({
          type: 'SET-WINNER',
          payload: { game, player: game.playerTwo.name },
        });
      }
    });
  }, [socket.on]);

  useEffect(() => {
    if (game.winner) {
      alert(game.winner + ' IS THE WINNER');
    }
  }, [game.winner]);

  const readyButtonHandler = () => {
    socket.emit('PLAYER-IS-READY-TO-START', {
      player: getPlayerKey(game.playerOne.id, socket.id),
      id: game.id,
    });
  };

  const isBothReady = game.playerOne.ready && game.playerTwo.ready;

  return (
    <>
      <div className={styles.boardContainer}>
        {game.playerOne.ready && game.playerTwo.ready && <MyTurn />}
        <PrivateBoard reset={resetPrivateBoard} />
        {game[getPlayerKey(game.playerOne.id, socket.id)].ready && (
          <AttackBoard />
        )}
      </div>
      <Modal
        isOpen={
          !game[getPlayerKey(game.playerOne.id, socket.id)].ready &&
          privateBoard.isAllDropped
        }
      >
        <div className={styles.button__container}>
          <button onClick={readyButtonHandler}>ready up</button>
          <button onClick={() => setResetPrivateBoard(!resetPrivateBoard)}>
            reset
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Game;
