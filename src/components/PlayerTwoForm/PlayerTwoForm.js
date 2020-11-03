import React, { useState } from 'react';

import useInput from '../hooks/useInput/useInput';

import { setGameActive } from '../../database/crud';

const PlayerTwoForm = ({ socket, gameId }) => {
  const [playerTwoName, setPlayerTwoName] = useState('');

  const onChangeHandler = value => {
    setPlayerTwoName(value);
  };

  const onClickHandler = () => {
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
    <div>
      {useNameInput}
      <button onClick={onClickHandler}>Let's go!</button>
    </div>
  );
};

export default PlayerTwoForm;
