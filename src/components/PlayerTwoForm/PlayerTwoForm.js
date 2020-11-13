import React, { useState, useContext, useEffect } from 'react';
import styles from './PlayerTwoForm.module.scss';

import useInput from '../hooks/useInput/useInput';

import { GameContext } from '../../context/storeContext';
import { setGameActive, getGameById, gameRef } from '../../database/crud';
import { GiShipWheel } from 'react-icons/gi';
// import { deleteGame, gamesRef } from '../../../database/crud';

const PlayerTwoForm = ({ socket, gameId }) => {
  const {
    state: { currentGame },
    dispatch,
  } = useContext(GameContext);
  const [playerTwoName, setPlayerTwoName] = useState('');

  const onChangeHandler = value => {
    setPlayerTwoName(value);
  };

  const onClickHandler = () => {
    console.log(currentGame);

    // const gameRef = gamesRef.child(`${game.id}`);
    // gamesRef.up
    //   .update({
    //     status: 'HOSTED',
    //     'game/playerTwo': {
    //       id: '',
    //     },
    //   })
    //   .then(() => ref.once('value'))
    //   .then(snapshot => {
    //     console.log(snapshot.val());
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // setGameActive(currentGame.id, socket.id, playerTwoName);
    // getGameById(currentGame.id, (game, key) => {
    //   game = {
    //     ...game,
    //     id: key,
    //   };
    //   dispatch({ type: 'SET-CURRENT-GAME', payload: game });
    //   dispatch({ type: 'SET-USER-STATUS', payload: 'ACTIVE' });
    // });
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
