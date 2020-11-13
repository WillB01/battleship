import React, { useEffect, useRef, useContext } from 'react';

import { isUserOnline } from '../../../services/helpers';
import { GameContext } from '../../../context/storeContext';
import { gamesRef } from '../../../database/crud';

import styles from './WaitingForPlayer.module.scss';
import video from '../../../assets/video/coverr-drone-shot-in-tierra-del-fuego-argentina-18-5280.mp4';

import { GameLoading } from '../Loading/Loading';

const WaitingForPlayer = ({ socket }) => {
  const {
    state: { currentGame },
  } = useContext(GameContext);

  const statusRef = useRef('waiting for player');

  useEffect(() => {
    socket.on('JOIN-HOST-HANDLER', () => {
      statusRef.current = 'player is joining';
    });
  }, [socket.on]);

  useEffect(() => {
    socket.on('USER-DISCONNECTS', sockets => {
      gamesRef
        .child(`${currentGame.id}`)
        .once('value')
        .then(snapshot => {
          const playerTwoId = snapshot.val().game.playerTwo.id;

          if (!playerTwoId) {
            return;
          }

          if (!isUserOnline(playerTwoId, sockets)) {
            statusRef.current = 'waiting for player';
            const ref = gamesRef
              .child(`${currentGame.id}`)
              .update({
                status: 'HOSTED',
                'game/playerTwo': {
                  id: '',
                },
              })
              .then(() => {
                statusRef.current = 'waiting for super player';
                socket.emit('UPDATE-GAME-LIST');
              })
              .catch(error => {
                console.log(error);
              });
          }
        });
    });
  }, [socket.on]);

  return (
    <div className={styles.waitingForPlayer}>
      <video autoPlay muted loop id="myVideo">
        <source src={video} type="video/mp4"></source>
      </video>
      <div className="center heading--1">
        <GameLoading>{statusRef.current}</GameLoading>
      </div>
    </div>
  );
};

export default WaitingForPlayer;
