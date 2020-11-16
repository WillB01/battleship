import React, { useContext, useEffect } from 'react';
import styles from '../MainContainer/MainContainer.module.scss';

import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';

import { fetchActiveGameById } from '../../../database/crud';
import { GameContext } from '../../../context/storeContext';
import { socket } from '../../../server/socket';

const GameContainer = ({ gameId }) => {
  const {
    state: { game },
    dispatch,
  } = useContext(GameContext);

  useEffect(() => {
    fetchActiveGameById(gameId)
      .then(snapshot => {
        if (!snapshot.exists()) {
          console.log('no game');
          console.log(gameId);
          return;
        }

        const dbGame = snapshot.val();

        dispatch({ type: 'INIT', payload: dbGame });
        socket.emit('JOIN-GAME', gameId);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  console.log(game);

  return (
    <>
      <div className={styles.gameContainer}>
        {/* <GameDetails /> */}
        {/* <Game socket={socket} currentGame={currentGame} /> */}
        <Chat type={'private'} gameId={gameId} />
      </div>
    </>
  );
};

export default GameContainer;
