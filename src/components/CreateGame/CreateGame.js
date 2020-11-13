import React, { useContext, useState, useEffect, useReducer } from 'react';
import styles from './CreateGame.module.scss';

import { GiShipWheel } from 'react-icons/gi';
import { createGame, getGameById, gamesRef } from '../../database/crud';
import { GameContext } from '../../context/storeContext';
import { boardBlueprint } from '../../services/boardBlueprint';

import socketActions from '../../services/socketActions';
import useInput from '../hooks/useInput/useInput';
import { Loading } from '../ui/Loading/Loading';

const CreateGame = ({ socket }) => {
  const [gameName, setGameName] = useState('');
  const [playerOneName, setPlayerOneName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useContext(GameContext);

  const onClickHandler = () => {
    // TODO validation
    if (gameName === '' || playerOneName === '') {
      return;
    }
    setIsLoading(true);

    const data = {
      status: 'HOSTED',
      name: gameName,
      game: {
        board: boardBlueprint,
        playerTurn: 'PLAYER-ONE',
        playerOne: {
          id: socket.id,
          name: playerOneName,
          attackLocation: [{ x: '', y: '', type: '' }],
          shipLocation: [{ x: '', y: '', id: '', size: '' }],
          ready: false,
        },
        playerTwo: {
          id: '',
          name: '',
          attackLocation: [{ x: '', y: '' }],
          shipLocation: [{ x: '', y: '', id: '', size: '' }],
          ready: false,
        },
      },
    };

    gamesRef
      .push(data)
      .then(childRef => {
        childRef.once('value', snapshot => {
          setIsLoading(false);
          const game = { id: snapshot.key, ...snapshot.val() };
          socket.emit('GAME-HOSTED', game);
          dispatch({ type: 'CREATE-GAME', payload: game });
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
          <div className={`${styles.item} ${styles.item__icon}`}>heading</div>

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
