import React, { useContext, useState, useEffect } from 'react';
import styles from './HostContainer.module.scss';

import CreateGame from '../../CreateGame/CreateGame';
import GamesList from '../../GamesList/GameList';
import PlayerTwoForm from '../../PlayerTwoForm/PlayerTwoForm';
import WaitingForPlayer from '../../ui/WaitingForPlayer/WaitingForPlayer';

import { GameContext } from '../../../context/storeContext';
import { deleteGame, setGameStatus } from '../../../database/crud';
import { isUserOnline } from '../../../services/helpers';
import { HiOutlineUsers } from 'react-icons/hi';

const HostContainer = ({ socket }) => {
  const { state } = useContext(GameContext);

  const [hideHostDetails, setHideHostDetails] = useState([false, false]);
  const [currentGameIndex, setCurrentGameIndex] = useState('');
  const [currentGameId, setCurrentGameId] = useState('');

  // logic to show hosting details
  useEffect(() => {
    if (!state.games && socket.id) {
      return;
    }

    state.games.forEach(({ game }) => {
      if (game.playerOne.id === socket.id) {
        setHideHostDetails([true, false]);
      }
    });
  }, [state, socket.id]);

  // delete games that has ofline hosts
  useEffect(() => {
    if (state.games.length === 0) {
      return;
    }
    state.games.map(game => {
      if (!isUserOnline(game.game.playerOne.id, state.connectedUsers)) {
        deleteGame(game.id);
      }
    });
  }, [state.connectedUsers]);

  const onClickDisplayGamesHandler = (gameId, gameIndex) => {
    setGameStatus(gameId, 'PLAYER-TWO-JOINING');
    setCurrentGameIndex(gameIndex);
    setCurrentGameId(gameId);
    setHideHostDetails([false, true]);
  };
  return (
    <div className={styles.hostContainer}>
      {!hideHostDetails[0] && !hideHostDetails[1] && (
        <>
          <div className={styles.information}>
            <div className={`${styles.information__heading} heading--1`}>
              Host or join a game of battleship!
            </div>
            <div className={styles.information__users}>
              <HiOutlineUsers />
              <p>{state.connectedUsers.length}</p>
            </div>
          </div>
          <CreateGame socket={socket} />
          <GamesList socket={socket} onClick={onClickDisplayGamesHandler} />
        </>
      )}
      {hideHostDetails[0] && <WaitingForPlayer />}
      {hideHostDetails[1] && (
        <PlayerTwoForm
          socket={socket}
          gameId={currentGameId}
          gameName={state.games[currentGameIndex].name}
        />
      )}
    </div>
  );
};

export default HostContainer;
