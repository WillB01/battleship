import React, { useContext } from 'react';

import styles from './GameDetails.module.scss';

import { GameContext } from '../../../context/storeContext';

const GameDetails = () => {
  const { state } = useContext(GameContext);

  console.log(state);
  console.log('game details', state);
  return (
    <div className={styles.gameDetails}>
      <div className={`${styles.item} ${styles.item__1}`}>
        game: {state.currentGame.name}
      </div>
      <div className={`${styles.item} ${styles.item__2}`}>
        <div>player one: {state.currentGame.game.playerOne.name}</div>
        <div>
          {state.currentGame.playerTurn === 'PLAYER-ONE' && <p>my turn</p>}
        </div>
      </div>
      <div className={`${styles.item} ${styles.item__3}`}>
        <div>player two: {state.currentGame.game.playerTwo.name}</div>
        <div>
          {state.currentGame.playerTurn === 'PLAYER-TWO' && <p>my turn</p>}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
