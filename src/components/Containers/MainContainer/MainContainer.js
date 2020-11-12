import React, { useContext, useState, useEffect } from 'react';
import styles from './MainContainer.module.scss';

import HostContainer from '../HostContainer/HostContainer';
import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';

import { GameContext } from '../../../context/storeContext';
import {
  getAllGames,
  updateSockets,
  getGameById,
} from '../../../database/crud';

import PrivateBoard from '../../Boards/PrivateBoard/PrivateBoard';

const MainContainer = ({ socket }) => {
  const {
    state: { currentGame },
    dispatch,
  } = useContext(GameContext);
  const [gameIndex, setGameIndex] = useState('');

  useEffect(() => {
    socket.on('getConnectedSockets', sockets => {
      updateSockets(sockets);
      dispatch({ type: 'UPDATED-SOCKETS', payload: sockets });
    });
  }, []);

  useEffect(() => {
    getAllGames(games => {
      if (!games) {
        return;
      }
      dispatch({ type: 'SET-GAMES', payload: games });
    });
  }, []);

  return (
    <>
      {(currentGame.status === 'INACTIVE' ||
        currentGame.status === 'HOSTED') && <HostContainer socket={socket} />}
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
