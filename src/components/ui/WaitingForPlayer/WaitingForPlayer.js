import React from 'react';
import styles from './WaitingForPlayer.module.scss';
import video from '../../../assets/video/coverr-drone-shot-in-tierra-del-fuego-argentina-18-5280.mp4';

import Loading from '../Loading/Loading';

const WaitingForPlayer = () => {
  return (
    <div className={styles.waitingForPlayer}>
      <video autoPlay muted loop id="myVideo">
        <source src={video} type="video/mp4"></source>
      </video>
      <div className="center heading--1">
        <Loading> waiting player two</Loading>
      </div>
    </div>
  );
};

export default WaitingForPlayer;
