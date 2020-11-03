import React, { useContext, useState, useEffect } from 'react';

import HostContainer from '../HostContainer/HostContainer';

import { GameContext } from '../../context/storeContext';
import { getAllGames, getGameById, updateSockets } from '../../database/crud';

const Container = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);

  useEffect(() => {
    socket.on('getConnectedSockets', sockets => {
      updateSockets(sockets);
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
      <HostContainer socket={socket} />
      {/* <Game socket={socket} />
        <Chat
          socket={socket}
          type={game.playerTwo.id === '' ? 'public' : 'private'}
          gameName={game.name}
        />  */}
    </>
  );
};

export default Container;
