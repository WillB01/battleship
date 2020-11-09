import React from 'react';
import styles from './PrivateBoard.module.scss';

import { motion } from 'framer-motion';

const Square = ({ x, y, content, onClick }) => {
  return (
    <>
      {content[0] !== undefined ? (
        <motion.div
          className={styles.ships}
          drag
          dragMomentum={false}
          onClick={() => onClick(x, y, content)}
          dragTransition={{
            bounceStiffness: 600,
            bounceDamping: 10,
          }}
        >
          {content[0]}
        </motion.div>
      ) : (
        <motion.div
          dragConstraints={{ left: 0, right: 300 }}
          className="cell center"
          className={`${styles.square}`}
          data-pos={[y, x]}
          key={x}
        >
          {x}
        </motion.div>
      )}
    </>
  );
};

export default Square;
