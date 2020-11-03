import React, { useEffect, useContext } from 'react';

import { GiBattleship } from 'react-icons/gi';
import { DiYeoman } from 'react-icons/di';

import styles from './GameList.module.scss';
import { isUserOnline } from '../../services/helpers';
import { GameContext } from '../../context/storeContext';

const GamesList = ({ socket, onClick }) => {
  const { state } = useContext(GameContext);

  const addStyle = (status, playerOneId) => {
    // const isHostOnline = isUserOnline(playerOneId, state.connectedUsers);
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
    <div className={styles.gameList}>
      {state.games.length !== 0 &&
        state.games.map((game, i) => {
          return (
            <div
              key={game.id}
              className={`${addStyle(game.status, game.game.playerOne.id)} ${
                styles.gameList__item
              }`}
              onClick={() =>
                game.status === 'HOSTED' ? onClick(game.id, i) : null
              }
            >
              <div>
                <GiBattleship />
                {game.name}
              </div>
              <div>
                <DiYeoman />
                {game.game.playerOne.name}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GamesList;
