import React from 'react';
import styles from './SquareContent.module.scss';

const SquareContent = ({ square }) => {
  const rednerSquare = () => {
    if (square === 'HIT') {
      return (
        <div className={styles.hit}>
          <div className={[styles.inner].join(' ')}></div>
          <div className={[styles.out].join(' ')}></div>
        </div>
      );
    }

    if (square === 'MISS') {
      return <div className={styles.miss}></div>;
    }

    if (square === 'SUNK') {
      return <div className={styles.sunk}></div>;
    }

    return <div className={`${styles.circle}`}></div>;
  };
  return <>{rednerSquare()}</>;
};

export default SquareContent;
