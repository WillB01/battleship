import React, { useContext, useState, useEffect, useReducer } from 'react';
import styles from './CreateGame.module.scss';

import { GiShipWheel } from 'react-icons/gi';
import { createGame, getGameById } from '../../database/crud';
import { GameContext } from '../../context/storeContext';
import socketActions from '../../services/socketActions';
import useInput from '../hooks/useInput/useInput';

const CreateGame = ({ socket }) => {
  const [gameName, setGameName] = useState('');
  const [playerOneName, setPlayerOneName] = useState('');
  const [showSelf, setShowSelf] = useState(true);

  const { state, dispatch } = useContext(GameContext);

  const onClickHandler = () => {
    // TODO validation
    if (gameName === '' || playerOneName === '') {
      return;
    }

    const id = createGame({
      status: 'HOSTED',
      gameName: gameName,
      playerOneId: socket.id,
      playerOneName: playerOneName,
      playerTwoId: '',
      playerTwoName: '',
    });

    getGameById(id, (game, key) => {
      game = {
        ...game,
        id: key,
      };

      dispatch({ type: 'SET-CURRENT-GAME', payload: game });
      socket.emit('JOIN-GAME', gameName);
    });
  };

  const onChangeHandler = (value, labelIndex) => {
    if (value.length > 25) {
      return;
    }
    if (labelIndex === 0) {
      setGameName(value);
    } else {
      setPlayerOneName(value);
    }
  };

  const useGameInput = useInput(
    onClickHandler,
    onChangeHandler,
    gameName,
    'Game name',
    0
  );

  const useNameInput = useInput(
    onClickHandler,
    onChangeHandler,
    playerOneName,
    'Your name',
    1
  );

  return (
    <div className={`${styles.createRoom}`}>
      <div className={`${styles.item} ${styles.item__icon}`}>heading</div>

      <div className={`${styles.item} ${styles.item__1}`}>{useGameInput}</div>
      <div className={`${styles.item} ${styles.item__2}`}>{useNameInput}</div>
      <button
        className={`${styles.item} ${styles.item__btn}`}
        onClick={onClickHandler}
      >
        Host game
      </button>
    </div>
  );
};

export default CreateGame;
