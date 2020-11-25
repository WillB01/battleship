import React, { useState, useRef, useEffect } from 'react';
import styles from './Ship.module.scss';

import { motion } from 'framer-motion';
import { BiRotateRight } from 'react-icons/bi';

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

  const onTapHandler = (i, ship) => {
    //todo att in privatebord
    // set ships and hin get location from boardhober instead off lopping
    shipClickIndex.current = i;
    setIsSelected(true);
  };

  const onHandEndHandler = e => {
    onDragEnd(e, elementRef.current, ship, direction, shipClickIndex.current);
    setIsSelected(false);
  };

  const onDragHandler = e => {
    onDrag(e, elementRef.current, ship, direction, shipClickIndex.current);
  };

  const shipContainer = {
    column: {
      transition: {
        duration: 0.1,
        delayChildren: 0.1,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    row: {
      transition: {
        ease: 'cubic-bezier(.5,-.75,.7,2)',
        duration: 0.1,
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const shipBlock = style => {
    return {
      column: {
        background: '#f2c288',
        y: style.pos,
        x: -style.pos,
        zIndex: 21,
        // y: 10,
        transition: {
          duration: 0.1,
        },
        rotate: [90, 0],
      },
      row: {
        background: '#054a44',
        zIndex: 20,
        y: 0,
        x: 0,

        transition: {
          duration: 0.1,
        },
        rotate: [90, 0],
      },
    };
  };

  const rotateButtonVariants = {
    column: {
      // background: 'red',
      transition: {
        duration: 0.1,
      },
      rotate: [0, 90],
    },
    row: {
      // background: 'blue',
      transition: {
        duration: 0.1,
      },
      rotate: [90, 0],
      x: 0,
    },
  };

  let xCounter = 0;
  const crateBlocks = length => {
    const blocks = [];
    for (let i = 0; i < length; i++) {
      if (i !== 0) {
        // xCounter += 35;
        xCounter += 25;
      }

      blocks.push([i, { pos: xCounter }]);
    }
    return blocks;
  };

  const spring = {
    type: 'spring',
    damping: 10,
    stiffness: 100,
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.rotateBtn}
        variants={rotateButtonVariants}
        animate={direction}
        initial="visible"
        transition={spring}
        style={{
          visibility: !ship.dropped ? 'visible' : 'hidden',
        }}
        onClick={rotateHandler}
      >
        <BiRotateRight />
      </motion.div>
      <motion.div
        className={styles.shipWrapper}
        style={{
          display: 'flex',
          visibility: !ship.dropped ? 'visible' : 'hidden',

          cursor: isSelected ? 'grabbing' : 'grab',
        }}
        ref={elementRef}
        drag
        dragMomentum={false}
        onDragEnd={onHandEndHandler}
        onDrag={onDragHandler}
        onDragStart={() => onDragStart(shipClickIndex.current, direction)}
        variants={shipContainer}
        initial="row"
        animate={direction}
        transition={spring}
      >
        {blocks.map((block, i) => (
          <motion.div
            style={{ zIndex: isSelected && 20 }}
            onTapStart={() => onTapHandler(block[0], ship)}
            onClick={() => setIsSelected(false)}
            initial="visible"
            variants={shipBlock(block[1])}
            className={styles.ship__square}
            key={block[0]}
          ></motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ship;
