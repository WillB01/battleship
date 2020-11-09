import React, { useContext, useState, useEffect } from 'react';
import styles from './MainContainer.module.scss';

import HostContainer from '../HostContainer/HostContainer';
import Game from '../../Game/Game';
import Chat from '../../Chat/Chat';
import GameDetails from '../../ui/GameDetails/GameDetails';

import { GameContext } from '../../../context/storeContext';
import { getAllGames, updateSockets } from '../../../database/crud';

import PrivateBoard from '../../Boards/PrivateBoard/PrivateBoard';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

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

  useEffect(() => {
    state.games.map((game, i) => {
      if (
        game.status === 'ACTIVE' &&
        (game.game.playerOne.id === socket.id ||
          game.game.playerTwo.id === socket.id)
      ) {
        return setGameIndex(i);
      }
    });
  }, [state.games]);

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <PrivateBoard socket={socket.id} index={0} />
      </DndProvider>

      {gameIndex === '' && <HostContainer socket={socket} />}
      {gameIndex !== '' && (
        <div className={styles.gameContainer}>
          <GameDetails index={gameIndex} />
          <Game socket={socket} index={gameIndex} />
          <Chat
            socket={socket}
            type={'private'}
            gameName={state.games[gameIndex].name}
          />
        </div>
      )}
    </>
  );
};

export default MainContainer;
