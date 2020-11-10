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

const PrivateBoard = ({ socket, index }) => {
  return (
    <>
      <RenderBoard />
    </>
  );
};

export default PrivateBoard;

const RenderBoard = ({ shipPositions }) => {
  const [board, setBoard] = useState([]);
  const [ships, setShips] = useState([]);
  const [dropSuccess, setDropSuccess] = useState([]);

  let refs = useMemo(() => Array.from({ length: 10 }).map(() => 'test'), []);
  refs = refs.map(item => {
    return (item = Array.from({ length: 10 }).map(() => createRef()));
  });

  useEffect(() => {
    const test = [...privateBoardTemp];
    setBoard(test);
  }, []);

  useEffect(() => {
    const ships = [];
    shipSizes.map((size, i) => {
      ships.push({ id: i, size: size, dropped: false });
    });

    setShips(ships);
  }, [dropSuccess]);

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
              if (direction === 'row') {
                if (board[indexX + i].current.style.background === 'blue') {
                  blocksToHover.push(board[indexX + i].current);
                }
              }
              if (direction === 'column') {
                if (
                  refs[indexY + i][originalX].current.style.background ===
                  'blue'
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

    if (!error && blocksToHover.length === ship.size) {
      const updateShips = [...ships];

      updateShips.map((s, i) => {
        if (s.id === ship.id) {
          return (ship.dropped = true);
        }
      });

      setShips(updateShips);

      blocksToHover.map(item => {
        setTimeout(function () {
          item.style.background = 'orange';
        }, 5);
      });
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
              if (direction === 'row') {
                if (board[indexX + i].current.style.background === 'blue') {
                  blocksToHover.push(board[indexX + i].current);
                }
              }
              if (direction === 'column') {
                if (
                  refs[indexY + i][originalX].current.style.background ===
                  'blue'
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
          item.style.background = 'hotpink';
        }
        setTimeout(function () {
          item.style.background = 'blue';
        }, 1);
      });
    }
  };

  console.log(ships);

  return (
    <>
      <div className={styles.privateBoard}>
        {board &&
          board.map((item, i) => {
            return item.map((itemItem, ii) => {
              return (
                <div
                  key={`${i}${ii}`}
                  style={{
                    background: 'blue',
                  }}
                  ref={el => (refs[i][ii].current = el)}
                  data-pos={[i, ii]}
                >
                  {i}
                  {ii}
                </div>
              );
            });
          })}
      </div>
      <button>reset</button>
      {ships.map((ship, i) => {
        return (
          <Ship
            onDragEnd={onDragEndHandler}
            onDrag={onDragHandler}
            ship={ship}
          />
        );
      })}
    </>
  );
};
