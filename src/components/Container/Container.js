import React, { useContext, useState, useEffect } from 'react';

import HostContainer from '../HostContainer/HostContainer';
import Game from '../Game/Game';
import Chat from '../Chat/Chat';

import { GameContext } from '../../context/storeContext';
import { getAllGames, getGameById, updateSockets } from '../../database/crud';

const Container = ({ socket }) => {
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
      {gameIndex === '' && <HostContainer socket={socket} />}
      {gameIndex !== '' && (
        <>
          <Game socket={socket} />
          <Chat
            socket={socket}
            type={'private'}
            gameName={state.games[gameIndex].name}
          />
        </>
      )}
    </>
  );
};

export default Container;
