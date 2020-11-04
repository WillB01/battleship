import React, { useEffect, useContext } from 'react';
import styles from './GameList.module.scss';

import { GiBattleship } from 'react-icons/gi';
import { DiYeoman } from 'react-icons/di';

import { isUserOnline } from '../../services/helpers';
import { GameContext } from '../../context/storeContext';

import img from '../../assets/img/war-ship-2.jpg';

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
      <div className={styles.img}></div>
      {state.games.length !== 0 &&
        state.games.map((game, i) => {
          return (
            <div key={game.id} className={styles.game}>
              <div
                className={`${addStyle(game.status, game.game.playerOne.id)}`}
              ></div>
              <div className={`${styles.content}`}>
                <div className={`${styles.content__item}`}>
                  {/* <GiBattleship /> */}
                  {game.name}
                </div>
                <div className={styles.line}></div>
                <div className={`${styles.content__item}`}>
                  {game.game.playerOne.name}
                  {/* <DiYeoman /> */}
                </div>
                <button
                  onClick={() =>
                    game.status === 'HOSTED' ? onClick(game.id, i) : null
                  }
                >
                  join game
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GamesList;
