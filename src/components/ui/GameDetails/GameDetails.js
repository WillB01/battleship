import React, { useContext } from 'react';

import styles from './GameDetails.module.scss';

import { GameContext } from '../../../context/storeContext';

const GameDetails = () => {
  const {
    state: { game },
  } = useContext(GameContext);

  return (
    <div className={styles.gameDetails}>
      <div className={`${styles.item} ${styles.item__1}`}>{game.name}</div>
      <div className={`${styles.item} ${styles.item__2}`}>
        <div>{game.playerOne.name}</div>
      </div>
      <div>vs</div>
      <div className={`${styles.item} ${styles.item__3}`}>
        <div>{game.playerTwo.name}</div>
      </div>
    </div>
  );
};

export default GameDetails;
