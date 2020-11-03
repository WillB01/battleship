import React, { useState, useEffect } from 'react';
import styles from './useInput.module.scss';

const useInput = (onClick, setInput, value, placeholder, id) => {
  useEffect(() => {}, [onClick, value]);

  return (
    <input
      className={styles.input}
      type="text"
      onChange={e => setInput(e.target.value, id)}
      onKeyPress={e => {
        e.key === 'Enter' && onClick();
      }}
      value={value}
      placeholder={placeholder}
    />
  );
};

export default useInput;
