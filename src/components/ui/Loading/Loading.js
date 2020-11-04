import React from 'react';
import styles from './Loading.module.scss';

import { GiShipWheel } from 'react-icons/gi';

const Loading = ({ children }) => {
  return (
    <div className={styles.loading}>
      {children}
      <GiShipWheel />
    </div>
  );
};

export default Loading;
