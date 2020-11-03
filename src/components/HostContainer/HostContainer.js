import React, { useContext, useState, useEffect } from 'react';

import CreateGame from '../CreateGame/CreateGame';
import GamesList from '../GamesList/GameList';

import { GameContext } from '../../context/storeContext';
import { getAllGames, getGameById } from '../../database/crud';

const HostContainer = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);

  const [hideHostDetails, setHideHostDetails] = useState([false, false]);
  const [connectedUsers, setConnectedUsers] = useState(0);

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

  useEffect(() => {
    socket.on('getConnectedSockets', sockets => {
      setConnectedUsers(sockets.length);
    });
  }, []);

  const onClickDisplayGamesHandler = gameId => {
    setHideHostDetails([true, true]);
  };
  return (
    <>
      {!hideHostDetails[0] && !hideHostDetails[1] && (
        <div>
          <CreateGame socket={socket} />
          <GamesList socket={socket} onClick={onClickDisplayGamesHandler} />
        </div>
      )}
    </>
  );
};

export default HostContainer;
