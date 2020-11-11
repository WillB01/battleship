import React, {
  useReducer,
  useContext,
  useEffect,
  useState,
  useRef,
  createRef,
  useMemo,
} from 'react';
import styles from '../PrivateBoard/PrivateBoard.module.scss';
import boardStyles from '../SharedBoard/Board.module.scss';

import { isOccupied, isEventInElement } from '../../../services/helpers';

import * as constants from './privateBoardConstants';

import Ship from '../../Ship/Ship';
import { motion, AnimateSharedLayout, createBatcher } from 'framer-motion';

import { GameContext } from '../../../context/storeContext';
import {
  headingTop,
  headingSide,
  boardBlueprint,
  privateBoardTemp,
  shipSizes,
} from '../../../services/boardBlueprint';
import { HiOutlineReceiptRefund } from 'react-icons/hi';

const PrivateBoard = ({ socket, index }) => {
  return (
    <>
      <RenderBoard />
    </>
  );
};

export default PrivateBoard;

const RenderBoard = () => {
  const [board, setBoard] = useState([]);
  const [ships, setShips] = useState([]);
  const [reset, setReset] = useState(false);
  const [allShipsDropped, setAllShipsAllDropped] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState(false);

  let refs = useMemo(() => Array.from({ length: 10 }).map(() => ''), []);
  refs = refs.map(item => {
    return (item = Array.from({ length: 10 }).map(() => createRef()));
  });

  useEffect(() => {
    const board = [...privateBoardTemp];
    setBoard(board);
  }, [reset]);

  useEffect(() => {
    const updateShips = [];
    shipSizes.map((size, i) => {
      updateShips.push({ id: i, size: size, dropped: false, hide: false });
    });

    setShips(updateShips);
  }, [reset]);

  useEffect(() => {
    const isAllDropped = ships.every(ship => ship.dropped === true);
    setAllShipsAllDropped(isAllDropped);
  }, [ships]);

  const resetBoard = () => {
    const updateShips = [];
    shipSizes.map((size, i) => {
      updateShips.push({ id: i, size: size, dropped: false });
    });

    refs.map((board, i) => {
      board.map((square, ii) => {
        square.current.style.background = constants.squareColor;
      });
    });

    setShips(ships);
    setReset(true);
    setIsDragging(false);
    setDraggingId('');
  };

  //TODO Refactor and fix better drop validation then background color!!!!!!////
  //////////////////////
  ///////////////////////////////////////////
  const onDragEndHandler = (
    e,
    dragElement,
    ship,
    direction,
    shipClickIndex
  ) => {
    const blocksToHover = [];
    const blocksToAddBoard = [];
    let error = false;
    try {
      refs.map((board, i) => {
        board.map((square, ii) => {
          const el = square.current;

          const originalY = parseInt(el.dataset.pos[0]);
          const originalX = parseInt(el.dataset.pos[2]);

          if (isEventInElement(e, square.current)) {
            const indexX = originalX - shipClickIndex;
            const indexY = originalY - shipClickIndex;

            for (let i = 0; i < ship.size; i++) {
              if (direction === constants.directionRow) {
                if (
                  board[indexX + i].current.style.background ===
                  constants.squareColor
                ) {
                  blocksToHover.push({
                    element: board[indexX + i].current,
                    shipLocation: { x: originalX, y: originalY },
                  });
                }
              }
              if (direction === constants.directionColumn) {
                if (
                  refs[indexY + i][originalX].current.style.background ===
                  constants.squareColor
                ) {
                  blocksToHover.push({
                    element: refs[indexY + i][originalX].current,
                    shipLocation: { x: originalX, y: originalY },
                  });
                }
              }
            }
          }
        });
      });
    } catch (e) {
      error = true;
    }

    if (!error && blocksToHover.length === ship.size) {
      const updateShips = [...ships];
      updateShips.map((s, i) => {
        if (s.id === ship.id) {
          s.dropped = true;
          s.hide = true;
        } else {
          s.hide = false;
        }

        return s;
      });

      console.log(updateShips);

      blocksToHover.map(block => {
        // setTimeout(() => {
        block.element.style.background = constants.shipDropColor;
        // }, 5);
      });

      setShips(updateShips);
      setIsDragging(false);

      //temp change to playership location later
      ////////////////////////////////////////
      const updatedBoard = [...board];
    }
  };

  //TODO Refactor and fix better drop validation then background color!!!!!!////
  //////////////////////
  ///////////////////////////////////////////
  const onDragHandler = (e, dragElement, ship, direction, shipClickIndex) => {
    const blocksToHover = [];
    let error = false;

    try {
      refs.map((board, i) => {
        board.map((square, ii) => {
          const el = square.current;

          const originalY = parseInt(el.dataset.pos[0]);
          const originalX = parseInt(el.dataset.pos[2]);

          if (isEventInElement(e, square.current)) {
            const indexX = originalX - shipClickIndex;
            const indexY = originalY - shipClickIndex;

            for (let i = 0; i < ship.size; i++) {
              if (direction === constants.directionRow) {
                if (
                  board[indexX + i].current.style.background ===
                  constants.squareColor
                ) {
                  blocksToHover.push(board[indexX + i].current);
                }
              }
              if (direction === constants.directionColumn) {
                if (
                  refs[indexY + i][originalX].current.style.background ===
                  constants.squareColor
                ) {
                  blocksToHover.push(refs[indexY + i][originalX].current);
                }
              }
            }
          }
        });
      });
    } catch (e) {
      error = true;
    }

    if (blocksToHover.length === ship.size) {
      blocksToHover.map(item => {
        if (!error) {
          item.style.background = constants.squareHoverColor;

          // item.children[0].style.background = 'hotpink';
          // item.children[0].style.position = 'absoulute';
          // item.children[0].style.transform = 'scale(2)';

          // item.style.fontSize = '2.2rem';
        }
        setTimeout(() => {
          item.style.background = constants.squareColor;
          // item.children[0].style.transform = 'scale(0)';
          // item.style.fontSize = '1rem';
        }, 1);
      });
    }
  };

  const onDragStartHandler = id => {
    let updateShips = [...ships];
    updateShips.map(ship => {
      if (ship.id === id) {
        ship.hide = false;
      } else {
        ship.hide = true;
      }
    });

    setShips(updateShips);
    setIsDragging(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.privateBoard}>
        {board &&
          board.map((item, i) => {
            return item.map((itemItem, ii) => {
              return (
                <div
                  className={styles.square}
                  key={`${i}${ii}`}
                  ref={el => (refs[i][ii].current = el)}
                  data-pos={[i, ii]}
                  style={{
                    background: constants.squareColor,
                  }}
                >
                  <div className={`${styles.square__item}`}></div>
                </div>
              );
            });
          })}
      </div>
      <button onClick={resetBoard}>reset</button>
      {allShipsDropped && <button>rady up</button>}

      {!allShipsDropped && (
        <div className={styles.shipContainer}>
          {ships &&
            ships.map((ship, i) => {
              return (
                !ship.hide && (
                  <Ship
                    key={ship.id}
                    onDragEnd={onDragEndHandler}
                    onDragStart={() => onDragStartHandler(ship.id)}
                    onDrag={onDragHandler}
                    ship={ship}
                    onTap={() => setReset(false)}
                    reset={reset}
                    isDragging={isDragging}
                  />
                )
              );
            })}
        </div>
      )}
    </div>
  );
};
