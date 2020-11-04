import React, { useState, useEffect } from 'react';
import styles from './useInput.module.scss';

const useInput = (onClick, setInput, value, placeholder, id) => {
  useEffect(() => {}, [onClick, value]);

  const [showLabel, setShowLabel] = useState(false);

  const onChangeHandler = (value, id) => {
    setInput(value, id);

    if (value === '') {
      return setShowLabel(false);
    }

    setShowLabel(true);
  };

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="text"
        onChange={e => onChangeHandler(e.target.value, id)}
        onKeyPress={e => {
          e.key === 'Enter' && onClick();
        }}
        value={value}
        placeholder={placeholder}
      />
      <div
        className={`${styles.label} ${
          showLabel ? styles.label__showLabel : styles.label__hideLabel
        }`}
      >
        {placeholder}
      </div>
    </div>
  );
};

export default useInput;
