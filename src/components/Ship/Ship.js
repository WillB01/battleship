import React, { useState, useEffect, useRef } from 'react';
import styles from './Ship.module.scss';
import {
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';

import { MdRotate90DegreesCcw } from 'react-icons/md';

const Ship = ({
  onDrag,
  size,
  id,
  onDragEnd,
  shipClickPosition,
  resetShips,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [direction, setDirection] = useState('row');
  const [absolute, setAbsolute] = useState(false);

  const [ships, startLocation] = useState([]);

  useEffect(() => {
    console.log('RESET');

    setAbsolute(false);
    setDirection('row');

    crateBlocks();
  }, [resetShips]);

  useEffect(() => {
    const blocks = crateBlocks(size);
    setBlocks(blocks);
  }, []);

  const crateBlocks = length => {
    const blocks = [];
    for (let i = 0; i < length; i++) {
      blocks.push(
        <motion.div
          onTapStart={() => shipClickPosition(i)}
          className={styles.ship__square}
          key={i}
        >
          i
        </motion.div>
      );
    }
    return blocks;
  };

  const updateDirection = () => {
    setDirection(direction === 'column' ? 'row' : 'column');
  };

  return (
    !absolute && (
      <motion.div
        style={{
          cursor: 'grab',
        }}
        drag
        whileTap={{ cursor: 'grabbing' }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
        onDragEnd={(event, info) => {
          setAbsolute(true);
          onDragEnd(event, info);
        }}
        onDragStart={() => onDrag(direction)}
        onTap={() => updateDirection()}
      >
        <div className={`${styles.ship}`}>
          <div>-</div>
          <div
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: direction,
            }}
          >
            {blocks}
          </div>
        </div>
      </motion.div>
    )
  );
};

export default Ship;
