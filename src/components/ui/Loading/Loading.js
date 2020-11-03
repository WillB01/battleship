import React from 'react';

import styles from './Loading.module.scss';

const Loading = ({ children }) => {
  return (
    <div className={styles.loading}>
      {children}
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
