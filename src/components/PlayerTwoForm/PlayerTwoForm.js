import React, { useState, useContext } from 'react';
import styles from './PlayerTwoForm.module.scss';

import useInput from '../hooks/useInput/useInput';

import { GameContext } from '../../context/storeContext';
import { setGameActive } from '../../database/crud';

const PlayerTwoForm = ({ socket, gameId, gameName }) => {
  const { state } = useContext(GameContext);
  const [playerTwoName, setPlayerTwoName] = useState('');

  const onChangeHandler = value => {
    setPlayerTwoName(value);
  };

  const onClickHandler = () => {
    socket.emit('JOIN-GAME', gameName);
    setGameActive(gameId, socket.id, playerTwoName);
  };

  const useNameInput = useInput(
    onClickHandler,
    onChangeHandler,
    playerTwoName,
    'Your name',
    ''
  );

  return (
    <div className={styles.playerTwoForm}>
      {useNameInput}
      <button onClick={onClickHandler}>Let's go!</button>
    </div>
  );
};

export default PlayerTwoForm;
