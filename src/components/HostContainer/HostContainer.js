import React, { useContext, useState, useEffect } from 'react';

import CreateGame from '../CreateGame/CreateGame';
import GamesList from '../GamesList/GameList';
import PlayerTwoForm from '../PlayerTwoForm/PlayerTwoForm';
import Loading from '../ui/Loading/Loading';

import { GameContext } from '../../context/storeContext';
import { deleteGame, setGameStatus } from '../../database/crud';
import { isUserOnline } from '../../services/helpers';

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
    <>
      {!hideHostDetails[0] && !hideHostDetails[1] && (
        <div>
          {state.connectedUsers.length}
          <CreateGame socket={socket} />
          <GamesList socket={socket} onClick={onClickDisplayGamesHandler} />
        </div>
      )}
      {hideHostDetails[0] && (
        <div>
          <Loading> waiting player two</Loading>
        </div>
      )}
      {hideHostDetails[1] && (
        <PlayerTwoForm
          socket={socket}
          gameId={currentGameId}
          gameName={state.games[currentGameIndex].name}
        />
      )}
    </>
  );
};

export default HostContainer;
