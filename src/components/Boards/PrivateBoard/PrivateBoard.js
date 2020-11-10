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
      ships.push({ id: i, size: size });
    });

    setShips(ships);
  }, []);

  const onDragEndHandler = (
    e,
    dragElement,
    ship,
    direction,
    shipClickIndex
  ) => {
    refs.map(board => {
      board.map(square => {
        if (isEventInElement(e, square.current)) {
          dragElement.style.visibility = 'hidden';
          square.current.style.background = 'orange';
        }
      });
    });
  };

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
            const index = originalX - shipClickIndex;
            for (let i = 0; i < ship.size; i++) {
              blocksToHover.push(board[index + i].current);
            }
          }
        });
      });
    } catch (e) {
      error = true;
    }

    blocksToHover.map(item => {
      if (!error) {
        item.style.background = 'hotpink';
      }
      setTimeout(function () {
        item.style.background = 'blue';
      }, 100);
    });
  };

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
