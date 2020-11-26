import React from 'react';
import styles from './Waves.module.scss';

const Waves = () => {
  return (
    <>
      <div className={styles.smallWaveContainer}>
        <div className={[styles.smallWave, styles.waveOne].join(' ')}></div>
        <div className={[styles.smallWave, styles.waveTwo].join(' ')}></div>
        <div className={[styles.smallWave, styles.waveThree].join(' ')}></div>
        <div className={[styles.smallWave, styles.waveFour].join(' ')}></div>
      </div>
      <div className={styles.water}></div>
      <div className={styles.waterTwo}></div>
      <div className={styles.waterThree}></div>
    </>
  );
};

export default Waves;
