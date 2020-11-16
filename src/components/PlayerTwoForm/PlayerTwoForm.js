import React, { useState, useContext, useEffect } from 'react';
import styles from './PlayerTwoForm.module.scss';

import useInput from '../hooks/useInput/useInput';

import { isUserOnline } from '../../services/helpers';
import { HostContext } from '../../context/storeContext';
import { fetchGameById, activeGamesRef } from '../../database/crud';
import { socket } from '../../server/socket';
import { GiShipWheel } from 'react-icons/gi';
import { inititalActiveGame } from '../../constants/constants';

const PlayerTwoForm = () => {
  const {
    hostState: { user, connectedUsers },
    hostDispatch,
  } = useContext(HostContext);
  const [playerTwoName, setPlayerTwoName] = useState('');

  const onChangeHandler = value => {
    setPlayerTwoName(value);
  };

  const onClickHandler = () => {
    fetchGameById(user.gameId)
      .then(snapshot => {
        if (!snapshot.exists()) {
          console.log('no game');
          console.log(user.gameId);
          return;
        }

        const id = snapshot.key;
        const dbGame = snapshot.val();

        const updateGame = {
          ...inititalActiveGame,
          id: id,
          name: dbGame.name,
          playerOne: {
            ...inititalActiveGame.playerOne,
            id: dbGame.host.id,
            name: dbGame.host.name,
          },
          playerTwo: {
            ...inititalActiveGame.playerTwo,
            id: dbGame.player.id,
            name: playerTwoName,
          },
        };

        if (!isUserOnline(dbGame.host.id, connectedUsers)) {
          console.log('NO PLAYER ONE');
        }

        activeGamesRef
          .child(id)
          .set(updateGame)
          .then(() => {
            snapshot.ref.remove().then(() => {
              hostDispatch({ type: 'SET-USER-STATUS', payload: 'ACTIVE' });
              socket.emit('COMPLETES-PLAYER-TWO-FORM', dbGame.host.id);
            });
          });
      })
      .catch(err => {
        console.log(err);
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
