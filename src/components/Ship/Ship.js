import React, { useState, useRef, useEffect } from 'react';
import styles from './Ship.module.scss';

import { isEventInElement } from '../../services/helpers';

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
  boardRef,
}) => {
  const [blocks, setBlocks] = useState([]);
  const [direction, setDirection] = useState('row');
  const [isSelected, setIsSelected] = useState(false);
  // const [isRotate, setIsRotate] = useState(false);
  const [startDrag, setStartDrag] = useState(true);

  const elementRef = useRef(null);
  const shipClickIndex = useRef('');

  useEffect(() => {
    const blocks = crateBlocks(ship.size);
    setBlocks(blocks);
  }, [isSelected, reset]);

  // useEffect(() => {
  //   // setIsRotate('row');
  //   setIsSelected(false);
  // }, [reset]);

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

  const onDragHandler = e => {
    // if (!isEventInElement(e, boardRef)) {
    //   setStartDrag(false);
    //   setIsSelected(false);
    //   setStartDrag(false);
    //   elementRef.current.style.transform = 'translate3d(0x, 0px, 0px)';
    //   return;
    // }
    onDrag(e, elementRef.current, ship, direction, shipClickIndex.current);
  };

  const crateBlocks = length => {
    const blocks = [];
    for (let i = 0; i < length; i++) {
      blocks.push(
        <motion.div
          onTapStart={() => {
            onTapHandler(i);
            setIsSelected(true);
            setStartDrag(true);
          }}
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
        // initial={{ background: 'red' }}
        // animate={{ background: 'blue', position: 'relative' }}
        style={{
          display: 'flex',
          flexDirection: direction,
          visibility: !ship.dropped ? 'visible' : 'hidden',
          position: reset ? 'relative' : 'absolute',
          zIndex: direction === 'column' ? 10 : 1,
          cursor: isSelected ? 'grabbing' : 'grab',
        }}
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
