import React, { useContext, useEffect } from 'react';
import styles from './Heading.module.scss';

import { HostContext } from '../../context/storeContext';
import { HiOutlineUsers } from 'react-icons/hi';
import { socket } from '../../server/socket';

const Heading = () => {
  const {
    hostState: { connectedUsers },
    hostDispatch,
  } = useContext(HostContext);

  useEffect(() => {
    socket.on('USER-DISCONNECTS', sockets => {
      hostDispatch({ type: 'SET-CONNECTED-USERS', payload: sockets });
    });

    socket.on(
      'USER-CONNECTS',
      sockets => {
        hostDispatch({ type: 'SET-CONNECTED-USERS', payload: sockets });
      },
      []
    );
  }, [socket.on]);

  return (
    <div className={styles.hostContainer}>
      <>
        <div className={styles.information}>
          <div className={`${styles.information__heading} heading heading--1`}>
            Host or join a game of battleship!
          </div>
          <div className={styles.information__users}>
            <HiOutlineUsers />
            <p>{connectedUsers.length}</p>
          </div>
        </div>
      </>
    </div>
  );
};

export default Heading;
