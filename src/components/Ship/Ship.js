import React, { useState, useRef, useEffect } from 'react';
import styles from './Ship.module.scss';

import {
  motion,
  transform,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';

const Ship = ({
  onDragEnd,
  onDragStart,
  onDrag,
  ship,
  onTap,
  reset,
  isDragging,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [direction, setDirection] = useState('row');
  const [isSelected, setIsSelected] = useState(false);
  const [isRotate, setIsRotate] = useState(false);

  const elementRef = useRef(null);
  const shipClickIndex = useRef('');

  useEffect(() => {
    const blocks = crateBlocks(ship.size);
    setBlocks(blocks);
  }, [isSelected]);

  const rotateHandler = () => {
    setDirection(direction === 'row' ? 'column' : 'row');
  };

  const onTapHandler = i => {
    shipClickIndex.current = i;
    onTap();
  };

  const onDragStartHandler = () => {
    onDragStart(ship.id);
  };

  const onHandEndHandler = e => {
    onDragEnd(e, elementRef.current, ship, direction, shipClickIndex.current);
    setIsSelected(false);
  };

  const crateBlocks = length => {
    const blocks = [];
    for (let i = 0; i < length; i++) {
      blocks.push(
        <motion.div
          onTapStart={() => {
            onTapHandler(i);
            setIsSelected(true);
          }}
          style={{
            cursor: isSelected ? 'grabbing' : 'grab',
          }}
          className={styles.ship__square}
          key={i}
        ></motion.div>
      );
    }
    return blocks;
  };

  return (
    <div className={styles.container}>
      <motion.div
        style={{
          display: 'flex',
          flexDirection: direction,
          visibility: !ship.dropped ? 'visible' : 'hidden',

          position: 'absolute',
          zIndex: direction === 'column' ? 10 : 1,
        }}
        ref={elementRef}
        drag
        onDragStart={onDragStartHandler}
        onDragEnd={onHandEndHandler}
        onDrag={e =>
          onDrag(e, elementRef.current, ship, direction, shipClickIndex.current)
        }
      >
        {blocks.map(block => block)}
      </motion.div>
      <div
        className={styles.rotateBtn}
        style={{
          visibility: !ship.dropped && !isDragging ? 'visible' : 'hidden',
        }}
        onClick={rotateHandler}
      >
        rotate icon
      </div>
    </div>
  );
};

export default Ship;
