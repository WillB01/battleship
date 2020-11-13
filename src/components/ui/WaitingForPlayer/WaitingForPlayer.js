import React, { useEffect, useRef, useContext } from 'react';

import { isUserOnline } from '../../../services/helpers';
import { GameContext } from '../../../context/storeContext';
import { gamesRef, fetchGameById } from '../../../database/crud';

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
      fetchGameById(currentGame.id)
        .then(snapshot => {
          const playerTwoId = snapshot.val().game.playerTwo.id;

          if (!playerTwoId) {
            return;
          }

          if (!isUserOnline(playerTwoId, sockets)) {
            if (!snapshot.exists()) {
              console.log('error');
              return;
            }
            snapshot.ref.update(
              {
                status: 'HOSTED',
                'game/playerTwo': {
                  id: '',
                },
              },
              onComplate => {
                statusRef.current = 'waiting for super player';
                socket.emit('UPDATE-GAME-LIST');
              }
            );
          }
        })
        .catch(err => {
          console.log(err);
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
