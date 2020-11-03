import React, { useEffect, useContext } from 'react';
import styles from './GameList.module.scss';
import { isUserOnline } from '../../services/helpers';
import { GameContext } from '../../context/storeContext';
import { getAllGames } from '../../database/crud';

const GamesList = ({ socket, onClick }) => {
  const { state } = useContext(GameContext);

  const addStyle = (status, playerOneId) => {
    const isHostOnline = isUserOnline(playerOneId, state.connectedUsers);
    if (status === 'HOSTED') {
      return styles.hosted;
    }
    if (status === 'ACTIVE') {
      return styles.active;
    }

    if (status === 'PLAYER-TWO-JOINING') {
      return styles.unavailable;
    }

    return '';
  };

  return (
    <div>
      {state.games.length !== 0 &&
        state.games.map((game, i) => {
          return (
            <div
              key={game.id}
              className={addStyle(game.status, game.game.playerOne.id)}
              onClick={() =>
                game.status === 'HOSTED' ? onClick(game.id, i) : null
              }
            >
              game: {game.name} || host: {game.game.playerOne.name}{' '}
              {game.status}
            </div>
          );
        })}
    </div>
  );
};

export default GamesList;
