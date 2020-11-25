import React, { useContext, useState, useEffect, useReducer } from 'react';
import styles from './CreateGame.module.scss';

import { gamesRef } from '../../database/crud';
import { HostContext } from '../../context/storeContext';
import { boardBlueprint } from '../../services/boardBlueprint';
import { Loading } from '../ui/Loading/Loading';
import { socket } from '../../server/socket';
import { initialHostGame } from '../../constants/constants';

import useInput from '../hooks/useInput/useInput';
import { RiShip2Line } from 'react-icons/ri';

const CreateGame = () => {
  const [gameName, setGameName] = useState('');
  const [playerOneName, setPlayerOneName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { hostDispatch } = useContext(HostContext);

  const onClickHandler = () => {
    // TODO validation
    if (gameName === '' || playerOneName === '') {
      return;
    }
    setIsLoading(true);

    const newGame = {
      ...initialHostGame,
      status: 'HOSTED',
      name: gameName,
      host: {
        id: socket.id,
        status: 'HOSTED',
        name: playerOneName,
      },
    };

    gamesRef
      .push(newGame)
      .then(childRef => {
        childRef.once('value', snapshot => {
          const dbGame = { ...snapshot.val(), id: snapshot.key };
          childRef.update(dbGame, onComplete => {
            hostDispatch({
              type: 'SET-NEW-USER',
              payload: {
                id: socket.id,
                status: 'HOSTED',
                gameId: dbGame.id,
                host: true,
              },
            });
            socket.emit('UPDATE-GAME-LIST');
          });
        });
      })
      .catch(err => {
        console.log(err);
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
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={`${styles.createRoom}`}>
          <div className={`${styles.item} ${styles.item__icon}`}>
            <RiShip2Line />
          </div>

          <div className={`${styles.item} ${styles.item__1}`}>
            {useGameInput}
          </div>
          <div className={`${styles.item} ${styles.item__2}`}>
            {useNameInput}
          </div>
          <button
            className={`${styles.item} ${styles.item__btn}`}
            onClick={onClickHandler}
          >
            Host game
          </button>
        </div>
      )}
    </>
  );
};

export default CreateGame;
