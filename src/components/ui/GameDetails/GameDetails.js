import React, { useContext } from 'react';

import styles from './GameDetails.module.scss';

import { GameContext } from '../../../context/storeContext';

const GameDetails = ({ index }) => {
  const { state } = useContext(GameContext);
  const currentGame = state.games[index];
  return (
    <div className={styles.gameDetails}>
      <div className={`${styles.item} ${styles.item__1}`}>
        game: {currentGame.name}
      </div>
      <div className={`${styles.item} ${styles.item__2}`}>
        <div>player one: {currentGame.game.playerOne.name}</div>
        <div>
          {currentGame.game.playerTurn === 'PLAYER-ONE' && <p>my turn</p>}
        </div>
      </div>
      <div className={`${styles.item} ${styles.item__3}`}>
        <div>player two: {currentGame.game.playerTwo.name}</div>
        <div>
          {currentGame.game.playerTurn === 'PLAYER-TWO' && <p>my turn</p>}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
