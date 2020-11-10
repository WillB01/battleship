import React, { useState, useRef, useEffect } from 'react';
import styles from './Ship.module.scss';

import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';

const Ship = ({ onDragEnd, onDrag, ship }) => {
  const [blocks, setBlocks] = useState([]);
  const [direction, setDirection] = useState('row');
  const elementRef = useRef(null);
  const shipClickIndex = useRef('');

  useEffect(() => {
    const blocks = crateBlocks(ship.size);
    setBlocks(blocks);
  }, []);

  const rotateHandler = () => {
    setDirection(direction === 'row' ? 'column' : 'row');
  };

  const crateBlocks = length => {
    const blocks = [];
    for (let i = 0; i < length; i++) {
      blocks.push(
        <motion.div
          onTapStart={() => (shipClickIndex.current = i)}
          className={styles.ship__square}
          key={i}
        >
          i
        </motion.div>
      );
    }
    return blocks;
  };

  return (
    <div className={styles.container}>
      <motion.div
        style={{ display: 'flex', flexDirection: direction }}
        ref={elementRef}
        drag
        onDragEnd={e =>
          onDragEnd(
            e,
            elementRef.current,
            ship,
            direction,
            shipClickIndex.current
          )
        }
        onDrag={e =>
          onDrag(e, elementRef.current, ship, direction, shipClickIndex.current)
        }
      >
        {blocks.map(block => block)}
      </motion.div>
      <div onClick={rotateHandler}>rotate</div>
    </div>
  );
};

export default Ship;
