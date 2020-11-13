import React, { useContext, useState, useEffect } from 'react';
import styles from './MainContainer.module.scss';

import HostContainer from '../HostContainer/HostContainer';
import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';
import WaitingForPlayer from '../../ui/WaitingForPlayer/WaitingForPlayer';
import PlayerTwoForm from '../../PlayerTwoForm/PlayerTwoForm';
import GamesList from '../../GamesList/GameList';

import { GameContext } from '../../../context/storeContext';

const MainContainer = ({ socket }) => {
  const {
    state: { currentGame, games, userStatus },
  } = useContext(GameContext);

  return (
    <>
      {userStatus === 'INACTIVE' && <HostContainer socket={socket} />}

      {userStatus === 'INACTIVE' && <GamesList socket={socket} />}

      {userStatus === 'HOSTED' && <WaitingForPlayer socket={socket} />}

      {userStatus === 'JOINING' && <PlayerTwoForm socket={socket} />}

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
