import React, { useContext, useState, useEffect } from 'react';
import { createGame } from '../../database/crud';
import { GameContext } from '../../context/storeContext';
import socketActions from '../../services/socketActions';
import useInput from '../hooks/useInput/useInput';

import styles from './CreateGame.module.scss';

const CreateGame = ({ socket }) => {
  const [gameName, setGameName] = useState('');
  const [playerOneName, setPlayerOneName] = useState('');
  const [showSelf, setShowSelf] = useState(true);

  useEffect(() => {
    socket.on(socketActions.WAITING_FOR_PLAYER_TWO, () => {
      setShowSelf(false);
    });
  }, []);

  const onClickHandler = () => {
    // TODO validation
    if (gameName === '' || playerOneName === '') {
      return;
    }

    createGame({
      status: 'HOSTED',
      gameName: gameName,
      playerOneId: socket.id,
      playerOneName: playerOneName,
      playerTwoId: '',
      playerTwoName: '',
    });
    setShowSelf(false);
    socket.emit('JOIN-GAME', gameName);
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
    <>
      {showSelf && (
        <div className={`${styles.createRoom}`}>
          <div className={styles.createRoom__item}>{useGameInput}</div>
          <div className={styles.createRoom__item}>{useNameInput}</div>
          <button onClick={onClickHandler}>Host game</button>
        </div>
      )}
    </>
  );
};

export default CreateGame;
