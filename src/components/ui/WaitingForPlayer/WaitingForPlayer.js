import React, { useEffect, useRef, useContext, useState } from 'react';

import { isUserOnline } from '../../../services/helpers';
import { GameContext } from '../../../context/storeContext';

import styles from './WaitingForPlayer.module.scss';
import video from '../../../assets/video/coverr-drone-shot-in-tierra-del-fuego-argentina-18-5280.mp4';

import Loading from '../Loading/Loading';

const WaitingForPlayer = ({ playerJoining, socket, games }) => {
  const {
    state: { currentGame },
  } = useContext(GameContext);

  const statusRef = useRef('waiting for player');

  useEffect(() => {
    if (playerJoining) {
      statusRef.current = 'player is joining';
    }
  }, [playerJoining]);

  useEffect(() => {
    socket.on('USER-DISCONNECTS', sockets => {
      if (!isUserOnline(currentGame.game.playerTwo.id, sockets)) {
        statusRef.current = 'waiting for player';
      }
    });
  }, []);

  return (
    <div className={styles.waitingForPlayer}>
      <video autoPlay muted loop id="myVideo">
        <source src={video} type="video/mp4"></source>
      </video>
      <div className="center heading--1">
        <Loading>{statusRef.current}</Loading>
      </div>
    </div>
  );
};

export default WaitingForPlayer;
