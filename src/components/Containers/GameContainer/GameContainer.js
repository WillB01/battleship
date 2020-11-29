import React, { useContext, useEffect } from 'react';
import styles from './GameContainer.module.scss';

import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';

import { fetchActiveGameById } from '../../../database/crud';
import { GameContext } from '../../../context/storeContext';
import { socket } from '../../../server/socket';
import { getPlayerKey, checkIfWin } from '../../../services/helpers';

const GameContainer = ({ gameId }) => {
  const {
    state: { game, privateBoard },
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

  const showButtons =
    !game[getPlayerKey(game.playerOne.id, socket.id)].ready &&
    privateBoard.isAllDropped;

  return (
    <>
      <div className={styles.gameContainer}>
        {!showButtons && <GameDetails />}
        <Game socket={socket} />
      </div>
      {!showButtons && <Chat type={'private'} gameId={gameId} />}
    </>
  );
};

export default GameContainer;
