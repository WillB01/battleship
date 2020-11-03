import React, { useContext, useState, useEffect } from 'react';

import CreateGame from '../CreateGame/CreateGame';
import GamesList from '../GamesList/GameList';
import PlayerTwoForm from '../PlayerTwoForm/PlayerTwoForm';

import { GameContext } from '../../context/storeContext';
import {
  getAllGames,
  getGameById,
  deleteGame,
  setGameActive,
  setGameStatus,
} from '../../database/crud';
import { isUserOnline } from '../../services/helpers';

const HostContainer = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);

  const [hideHostDetails, setHideHostDetails] = useState([false, false]);
  const [connectedUsers, setConnectedUsers] = useState(0);
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

  const onClickDisplayGamesHandler = gameId => {
    setGameStatus(gameId, 'PLAYER-TWO-JOINING');
    setCurrentGameId(gameId);
    setHideHostDetails([false, true]);
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
      {hideHostDetails[0] && <div>waiting player two</div>}
      {hideHostDetails[1] && (
        <PlayerTwoForm socket={socket} gameId={currentGameId} />
      )}
    </>
  );
};

export default HostContainer;
