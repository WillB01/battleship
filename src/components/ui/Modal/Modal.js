import React from 'react';
import styles from './Modal.module.scss';

import { motion } from 'framer-motion';

const variants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 50% 50%)`,
    opacity: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    visibility: 'visible',
  }),
  closed: {
    clipPath: 'circle(0px at 50% 50%)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

const Modal = ({ children, isOpen }) => {
  return (
    <motion.div
      transition={{ duration: 0.6 }}
      initial={'closed'}
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      className={styles.container}
    >
      <div className="center">{children}</div>
    </motion.div>
  );
};

export default Modal;
