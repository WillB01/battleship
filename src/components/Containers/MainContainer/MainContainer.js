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
  const { state, dispatch } = useContext(GameContext);
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

  console.log('IN GAME RENDER DAMP', state.currentGame);

  return (
    <>
      {/* <PrivateBoard socket={socket.id} index={0} /> */}

      {(state.currentGame.status === 'INACTIVE' ||
        state.currentGame.status === 'HOSTED') && (
        <HostContainer socket={socket} />
      )}
      {state.currentGame.status === 'ACTIVE' && (
        <div className={styles.gameContainer}>
          <GameDetails />
          <Game
            socket={socket}
            index={gameIndex}
            currentGame={state.currentGame}
          />
          <Chat
            socket={socket}
            type={'private'}
            gameName={state.currentGame.name}
          />
        </div>
      )}
    </>
  );
};

export default MainContainer;
