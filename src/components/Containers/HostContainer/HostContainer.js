import React, { useContext, useEffect } from 'react';
import styles from './HostContainer.module.scss';

import CreateGame from '../../CreateGame/CreateGame';

import { GameContext } from '../../../context/storeContext';
import { HiOutlineUsers } from 'react-icons/hi';

const HostContainer = ({ socket }) => {
  const {
    state: { connectedUsers },
    dispatch,
  } = useContext(GameContext);

  useEffect(() => {
    socket.on('USER-DISCONNECTS', sockets => {
      dispatch({ type: 'UPDATED-SOCKETS', payload: sockets });
    });

    socket.on(
      'USER-CONNECTS',
      sockets => {
        dispatch({ type: 'UPDATED-SOCKETS', payload: sockets });
      },
      []
    );
  }, [socket.on]);

  return (
    <div className={styles.hostContainer}>
      <>
        <div className={styles.information}>
          <div className={`${styles.information__heading} heading--1`}>
            Host or join a game of battleship!
          </div>
          <div className={styles.information__users}>
            <HiOutlineUsers />
            <p>{connectedUsers.length}</p>
          </div>
        </div>
        <CreateGame socket={socket} />
      </>
    </div>
  );
};

export default HostContainer;
