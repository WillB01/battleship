import React, { useContext, useState, useEffect } from 'react';

import CreateGame from '../CreateGame/CreateGame';
import GamesList from '../GamesList/GameList';

import { GameContext } from '../../context/storeContext';
import { getAllGames, getGameById, deleteGame } from '../../database/crud';
import { isUserOnline } from '../../services/helpers';

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
  }, [state]);

  const onClickDisplayGamesHandler = gameId => {
    setHideHostDetails([true, true]);
  };
  return (
    <>
      {!hideHostDetails[0] && !hideHostDetails[1] && (
        <div>
          {state.connectedUsers.length}
          <CreateGame socket={socket} />
          <GamesList socket={socket} onClick={onClickDisplayGamesHandler} />
        </div>
      )}
    </>
  );
};

export default HostContainer;
