import React, { useEffect, useRef, useContext, useState } from 'react';
import styles from './WaitingForPlayer.module.scss';

import { isUserOnline } from '../../../services/helpers';
import { HostContext } from '../../../context/storeContext';
import { fetchGameById } from '../../../database/crud';
import { socket } from '../../../server/socket';
import { GameLoading } from '../Loading/Loading';

import Waves from '../../ui/Waves/Waves';

const WaitingForPlayer = () => {
  const {
    hostState: { user },
    hostDispatch,
  } = useContext(HostContext);

  const [info, setInfo] = useState('waiting for player');

  useEffect(() => {
    socket.on('JOIN-HOST-HANDLER', () => {
      setInfo('player is joining');
    });
    return () => socket.off('JOIN-HOST-HANDLER');
  }, [socket.on]);

  useEffect(() => {
    socket.on('COMPLETES-PLAYER-TWO-FORM-HANDLER', data => {
      hostDispatch({ type: 'SET-USER-STATUS', payload: 'ACTIVE' });
    });
    return () => socket.off('COMPLETES-PLAYER-TWO-FORM-HANDLER');
  }, [socket.on]);

  useEffect(() => {
    socket.on('USER-DISCONNECTS', sockets => {
      fetchGameById(user.gameId)
        .then(snapshot => {
          const playerTwoId = snapshot.val().player.id;
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
                player: {
                  id: '',
                  status: '',
                  name: '',
                },
              },
              onComplate => {
                setInfo('waiting for super player');
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
    <div className={[styles.waitingForPlayer, 'center'].join(' ')}>
      <div className="center heading--1">{info}</div>
      <GameLoading></GameLoading>

      <div className={[styles.wavesContainer, 'center'].join(' ')}>
        <Waves />
      </div>
    </div>
  );
};

export default WaitingForPlayer;
