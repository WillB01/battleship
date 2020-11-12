import React, { useContext, useState, useEffect } from 'react';
import styles from './MainContainer.module.scss';

import HostContainer from '../HostContainer/HostContainer';
import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';
import WaitingForPlayer from '../../ui/WaitingForPlayer/WaitingForPlayer';

import { GameContext } from '../../../context/storeContext';

const MainContainer = ({ socket }) => {
  const {
    state: { currentGame },
  } = useContext(GameContext);

  return (
    <>
      {currentGame.status === 'INACTIVE' && <HostContainer socket={socket} />}

      {(currentGame.status === 'HOSTED' ||
        currentGame.status === 'PLAYER-TWO-JOINING') && (
        <WaitingForPlayer
          playerJoining={currentGame.status === 'PLAYER-TWO-JOINING'}
        />
      )}

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

export default MainContainer;
