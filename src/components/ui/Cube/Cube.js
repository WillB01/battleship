import React from 'react';
import styles from './Cube.module.scss';

import { motion } from 'framer-motion';

//  transform: rotateX(125deg) rotateY(155deg);
const Cube = ({ color }) => {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.cube}
        style={{ rotateY: '30deg', rotateX: '40deg' }}
        // initial={{ rotateY: '30deg', rotateX: '40deg' }}
        // animate={{ rotateY: '360deg', rotateX: '360deg' }}
        // transition={{
        //   duration: 500,
        //   repeat: Infinity,
        //   delayChildren: 0.3,
        //   staggerChildren: 0.4,
        // }}
      >
        <motion.div style={{ background: color[0] }}></motion.div>
        <motion.div style={{ background: color[1] }}></motion.div>
        <motion.div style={{ background: color[2] }}></motion.div>
        <motion.div style={{ background: color[3] }}></motion.div>
        <motion.div style={{ background: color[4] }}></motion.div>
        <motion.div style={{ background: color[5] }}></motion.div>
      </motion.div>
    </div>
  );
};

export default Cube;
