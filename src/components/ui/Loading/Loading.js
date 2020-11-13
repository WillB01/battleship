import React from 'react';
import styles from './Loading.module.scss';

import { GiShipWheel } from 'react-icons/gi';

export const GameLoading = ({ children }) => {
  return (
    <div className={styles.loading}>
      {children}
      <GiShipWheel />
    </div>
  );
};

export const Loading = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
      <div className={styles.lds}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
