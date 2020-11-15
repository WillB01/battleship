import React, { useContext } from 'react';
import styles from '../MainContainer/MainContainer.module.scss';

import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';

import { GameContext } from '../../../context/storeContext';

const GameContainer = ({ socket }) => {
  const {
    state: { currentGame, games, userStatus },
    dispatch,
  } = useContext(GameContext);

  return (
    <>
      {currentGame.status === 'ACTIVE' &&
        (socket.id === currentGame.game.playerOne.id ||
          socket.id === currentGame.game.playerTwo.id) && (
          <div className={styles.gameContainer}>
            <GameDetails />
            <Game socket={socket} currentGame={currentGame} />
            <Chat socket={socket} type={'private'} gameId={currentGame.id} />
          </div>
        )}
    </>
  );
};

export default GameContainer;
