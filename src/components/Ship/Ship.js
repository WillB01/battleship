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
  directionHandler,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [direction, setDirection] = useState('row');
  const [absolute, setAbsolute] = useState(false);

  const [ships, startLocation] = useState([]);

  const [isDragging, setIsdragging] = useState(false);

  useEffect(() => {
    if (resetShips) {
      const blocks = crateBlocks(size);
      setBlocks(blocks);
      setIsdragging(false);
      setDirection('row');
      setAbsolute(false);
    }
  }, [resetShips]);

  useEffect(() => {
    const blocks = crateBlocks(size);
    setBlocks(blocks);
  }, [resetShips]);

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
    const dir = direction === 'column' ? 'row' : 'column';
    directionHandler(dir);
    setDirection(dir);
  };

  console.log(direction);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
    >
      <motion.div
        style={{
          cursor: 'grab',
          opacity: !absolute ? 1 : 0,
          fontSize: 25,
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: direction,
          width: 'min-content',
        }}
        drag
        whileTap={{ cursor: 'grabbing' }}
        onDragEnd={(event, info) => {
          setAbsolute(true);
          setIsdragging(false);
          onDragEnd(event, info);
        }}
        onDragStart={() => {
          setIsdragging(true);
          onDrag(direction);
        }}
      >
        {blocks}
      </motion.div>
      <motion.div
        animate={{ opacity: !isDragging && absolute ? 0 : 1 }}
        onTap={() => updateDirection()}
      >
        rotate icon
      </motion.div>
    </div>
  );
};

export default Ship;
