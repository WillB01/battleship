import React, { useContext, useEffect, useState } from 'react';

import styles from './MyTurn.module.scss';

import { motion } from 'framer-motion';
import { socket } from '../../../server/socket';
import { GameContext } from '../../../context/storeContext';
import { getPlayerKey, getOpponentPlayerKey } from '../../../services/helpers';
import { GiFleshyMass } from 'react-icons/gi';

const MyTurn = () => {
  const {
    state: { game },
  } = useContext(GameContext);

  const [myTurn, setMyTurn] = useState(false);

  const spring = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
    duration: '0.3s',
    ease: [0.17, 0.67, 0.83, 0.67],
  };

  const variantsMyTurn = {
    hidden: { opacity: 0, width: '0%' },
    show: {
      opacity: 1,
      width: '10rem',
    },
  };

  const variantsEnemyTurn = {
    hidden: { opacity: 0, width: '0%' },
    show: {
      opacity: 1,
      width: '10rem',
    },
  };

  useEffect(() => {
    socket.on('MY-TURN', data => {
      const player = getPlayerKey(data.playerOne.id, socket.id);
      if (data[player].myTurn) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    });

    return () => socket.off('MY-TURN');
  }, [socket.on]);

  useEffect(() => {
    const player = getPlayerKey(game.playerOne.id, socket.id);
    if (game[player].myTurn) {
      setMyTurn(true);
    } else {
      setMyTurn(false);
    }
  }, []);

  return (
    <motion.div className={styles.container}>
      <motion.div
        className={styles.myTurn}
        // style={{ opacity: myTurn ? 0 : 1 }}
        variants={variantsEnemyTurn}
        initial={!myTurn ? 'show' : 'hidden'}
        animate={!myTurn ? 'show' : 'hidden'}
        transition={spring}
      ></motion.div>
      <motion.div
        className={styles.enemyTurn}
        // style={{ opacity: myTurn ? 1 : 0 }}
        variants={variantsMyTurn}
        initial={myTurn ? 'show' : 'hidden'}
        animate={myTurn ? 'show' : 'hidden'}
        transition={spring}
      ></motion.div>
    </motion.div>
  );
};

export default MyTurn;
