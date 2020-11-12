import React, { useContext, useState, useEffect } from 'react';
import styles from './HostContainer.module.scss';

import CreateGame from '../../CreateGame/CreateGame';
import GamesList from '../../GamesList/GameList';
import PlayerTwoForm from '../../PlayerTwoForm/PlayerTwoForm';
import WaitingForPlayer from '../../ui/WaitingForPlayer/WaitingForPlayer';

import { GameContext } from '../../../context/storeContext';
import { deleteGame, getGameById, setGameStatus } from '../../../database/crud';
import { isUserOnline } from '../../../services/helpers';
import { HiOutlineUsers } from 'react-icons/hi';

const HostContainer = ({ socket }) => {
  const {
    state: { currentGame, games, connectedUsers },
  } = useContext(GameContext);

  const [currentGameId, setCurrentGameId] = useState('');
  const [showPlayerTwoForm, setShowPlayerTwoForm] = useState(false);

  // delete games that has ofline hosts
  useEffect(() => {
    if (games.length === 0) {
      return;
    }
    games.map(game => {
      if (!isUserOnline(game.game.playerOne.id, connectedUsers)) {
        deleteGame(game.id);
      }
    });
  }, [connectedUsers]);

  const onClickDisplayGamesHandler = (gameId, gameIndex) => {
    console.log('hello');
    setGameStatus(gameId, 'PLAYER-TWO-JOINING');
    setCurrentGameId(gameId);
    setShowPlayerTwoForm(true);
  };

  return (
    <div className={styles.hostContainer}>
      {currentGame.status === 'INACTIVE' && !showPlayerTwoForm && (
        <>
          <div className={styles.information}>
            <div className={`${styles.information__heading} heading--1`}>
              Host or join a game of battleship!
            </div>
            <div className={styles.information__users}>
              <HiOutlineUsers />
              <p>{connectedUsers.length}</p>
            </div>
          </div>
          <CreateGame socket={socket} />
          <GamesList socket={socket} onClick={onClickDisplayGamesHandler} />
        </>
      )}
      {currentGame.status === 'HOSTED' && <WaitingForPlayer />}
      {showPlayerTwoForm && (
        <PlayerTwoForm socket={socket} gameId={currentGameId} />
      )}
    </div>
  );
};

export default HostContainer;
