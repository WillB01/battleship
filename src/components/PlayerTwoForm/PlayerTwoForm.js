import React, { useState, useContext } from 'react';
import styles from './PlayerTwoForm.module.scss';

import useInput from '../hooks/useInput/useInput';

import { GameContext } from '../../context/storeContext';
import { setGameActive, getGameById } from '../../database/crud';
import { GiShipWheel } from 'react-icons/gi';

const PlayerTwoForm = ({ socket, gameId }) => {
  const { state, dispatch } = useContext(GameContext);
  const [playerTwoName, setPlayerTwoName] = useState('');

  const onChangeHandler = value => {
    setPlayerTwoName(value);
  };

  const onClickHandler = () => {
    setGameActive(gameId, socket.id, playerTwoName);
    getGameById(gameId, (game, key) => {
      game = {
        ...game,
        id: key,
      };

      dispatch({ type: 'SET-CURRENT-GAME', payload: game });
      socket.emit('JOIN-GAME', game.name);
    });
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
      <GiShipWheel />
      {useNameInput}
      <button onClick={onClickHandler}>Let's go!</button>
    </div>
  );
};

export default PlayerTwoForm;
