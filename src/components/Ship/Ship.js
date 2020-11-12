import React, { useState, useRef, useEffect } from 'react';
import styles from './Ship.module.scss';

import { motion } from 'framer-motion';

const Ship = ({
  onDragEnd,
  onDragStart,
  onDrag,
  ship,
  onTap,
  isDragging,
  ships,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [direction, setDirection] = useState('row');
  const [isSelected, setIsSelected] = useState(false);

  const elementRef = useRef(null);
  const shipClickIndex = useRef('');

  useEffect(() => {
    const blocks = crateBlocks(ship.size);
    setBlocks(blocks);
  }, []);

  const rotateHandler = () => {
    setDirection(direction === 'row' ? 'column' : 'row');
  };

  const onTapHandler = i => {
    shipClickIndex.current = i;
    setIsSelected(true);
  };

  const onDragStartHandler = () => {
    onDragStart(ship.id);
  };

  const onHandEndHandler = e => {
    onDragEnd(e, elementRef.current, ship, direction, shipClickIndex.current);
    setIsSelected(false);
  };

  const onDragHandler = e => {
    onDrag(e, elementRef.current, ship, direction, shipClickIndex.current);
  };

  const crateBlocks = length => {
    const blocks = [];
    for (let i = 0; i < length; i++) {
      blocks.push(
        <motion.div
          onTapStart={() => onTapHandler(i)}
          onClick={() => setIsSelected(false)}
          animate={{}}
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
          zIndex: direction === 'column' ? 10 : 1,
          cursor: isSelected ? 'grabbing' : 'grab',
        }}
        animate={{ position: 'absolute' }}
        ref={elementRef}
        drag
        dragMomentum={false}
        onDragStart={onDragStartHandler}
        onDragEnd={onHandEndHandler}
        onDrag={onDragHandler}
      >
        {blocks.map(block => block)}
      </motion.div>

      <div
        className={styles.rotateBtn}
        style={{
          visibility: !ship.dropped ? 'visible' : 'hidden',
        }}
        onClick={rotateHandler}
      >
        rotate icon
      </div>
    </div>
  );
};

export default Ship;
