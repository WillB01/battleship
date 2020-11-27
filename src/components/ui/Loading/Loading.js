import React from 'react';
import styles from './Loading.module.scss';

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
