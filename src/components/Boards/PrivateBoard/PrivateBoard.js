import React, {
  useContext,
  useEffect,
  useState,
  createRef,
  useMemo,
  useRef,
} from 'react';

import styles from '../PrivateBoard/PrivateBoard.module.scss';
import boardStyles from '../board.module.scss';

import * as constants from './privateBoardConstants';

import {
  isEventInElement,
  getPlayerKey,
  getOpponentPlayerKey,
  checkIfSkipSunk,
} from '../../../services/helpers';
import { GameContext } from '../../../context/storeContext';
import { headingTop, headingSide } from '../../../services/boardBlueprint';
import { socket } from '../../../server/socket';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';

import Ship from '../../Ship/Ship';
import Cube from '../../ui/Cube/Cube';

const PrivateBoard = () => {
  const {
    state: { game },
    dispatch,
  } = useContext(GameContext);

  const addShipLocation = ships => {
    const player = getPlayerKey(game.playerOne.id, socket.id);
    const updatedGame = { ...game };

    ships.map(ship => {
      updatedGame[player].shipLocation.push({
        x: ship.shipLocation.x,
        y: ship.shipLocation.y,
        id: ship.shipLocation.id,
        size: ship.shipLocation.size,
      });
    });

    if (updatedGame[player].shipLocation.length === 18) {
      updatedGame[player].shipLocation.shift();
      dispatch({ type: 'SET-ALL-SHIPS-IS-DROPPED' });
    }

    socket.emit('ADD-SHIP-LOCATION', updatedGame);
  };

  return (
    <>
      <RenderBoard addShipLocation={addShipLocation} />
    </>
  );
};

export default PrivateBoard;

const RenderBoard = ({ addShipLocation }) => {
  const {
    state: { game, attackBoard, privateBoard },
    dispatch,
  } = useContext(GameContext);

  const { board, ships } = privateBoard;
  const [isDragging, setIsDragging] = useState(false);
  const [selectedShip, setSelectedShip] = useState();

  let refs = useMemo(() => Array.from({ length: 10 }).map(() => ''), []);
  refs = refs.map(item => {
    return (item = Array.from({ length: 10 }).map(() => createRef()));
  });

  const blocksToAddRef = useRef();
  const zIndexRef = useRef(1);

  useEffect(() => {
    dispatch({ type: 'SET-SHIPS' });
  }, []);

  const resetBoard = () => {
    refs.map((board, i) => {
      board.map((square, ii) => {
        square.current.classList.remove('drop');
        square.current.classList.remove(`${styles.hover}`);
      });
    });

    zIndexRef.current = 1;

    setSelectedShip('');
    setIsDragging(false);
    dispatch({
      type: 'RESET-PRIVATE-BOARD',
      payload: getPlayerKey(game.playerOne.id, socket.id),
    });
  };

  const onDragEndHandler = (
    e,
    dragElement,
    ship,
    direction,
    shipClickIndex
  ) => {
    const blocksToHover = [];
    setSelectedShip('');
    zIndexRef.current = 0;
    console.log('DROP');

    let error = false;
    let doDispatch = false;
    try {
      blocksToAddRef.current.map(block => {
        if (isEventInElement(e, blocksToAddRef.current[shipClickIndex].hover)) {
          if (blocksToAddRef.current.length === ship.size) {
            block.hover.classList.remove(`${styles.hover}`);
            block.hover.classList.add('drop');
            doDispatch = true;
          }
        }
      });

      if (doDispatch) {
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
        dispatch({ type: 'UPDATE-SHIPS', payload: updateShips });
        setIsDragging(false);
        addShipLocation(blocksToAddRef.current);
      }
    } catch (e) {
      error = true;
      zIndexRef.current = 0;

      console.log(e);
    }
  };

  //TODO Refactor and fix better drop validation then background color!!!!!!////
  //////////////////////
  ///////////////////////////////////////////
  const onDragHandler = (e, dragElement, ship, direction, shipClickIndex) => {
    // fix for miboole
    // const blocksToHover = [];
    // let error = false;
    // try {
    //   refs.map((board, i) => {
    //     board.map((square, ii) => {
    //       const el = square.current;
    //       if (
    //         board[shipClickIndex].current.classList.contains(`${styles.hover}`)
    //       ) {
    //         return;
    //       }
    //       const originalY = parseInt(
    //         el.dataset.pos[0] || el.children[0].dataset.pos[0]
    //       );
    //       const originalX = parseInt(
    //         el.dataset.pos[2] || el.children[0].dataset.pos[0]
    //       );
    //       if (isEventInElement(e, square.current)) {
    //         const indexX = originalX - shipClickIndex;
    //         const indexY = originalY - shipClickIndex;
    //         for (let i = 0; i < ship.size; i++) {
    //           if (direction === constants.directionRow) {
    //             if (!board[indexX + i].current.classList.contains('drop')) {
    //               board[indexX + i].current.classList.add(`${styles.hover}`);
    //               blocksToHover.push({
    //                 hover: board[indexX + i].current,
    //                 shipLocation: {
    //                   x: indexX + i,
    //                   y: originalY,
    //                   id: ship.id,
    //                   size: ship.size,
    //                 },
    //               });
    //             }
    //           }
    //           if (direction === constants.directionColumn) {
    //             if (
    //               !refs[indexY + i][originalX].current.classList.contains(
    //                 'drop'
    //               )
    //             ) {
    //               blocksToHover.push({
    //                 hover: refs[indexY + i][originalX].current,
    //                 shipLocation: {
    //                   x: originalX,
    //                   y: indexY + i,
    //                   id: ship.id,
    //                   size: ship.size,
    //                 },
    //               });
    //             }
    //           }
    //         }
    //       }
    //     });
    //   });
    // } catch (e) {
    //   console.log(e);
    //   error = true;
    // }
    // if (blocksToHover.length === ship.size) {
    //   if (!error) {
    //     blocksToHover.map(block => {
    //       block.hover.classList.add(`${styles.hover}`);
    //       setTimeout(() => {
    //         block.hover.classList.remove(`${styles.hover}`);
    //       }, 100);
    //     });
    //     if (!error) {
    //       blocksToAddRef.current = blocksToHover;
    //     }
    //   }
    // }
  };

  useEffect(() => {
    socket.on('ATTACK-SHIP-HANDLER', (newGame, attackBoard) => {
      dispatch({
        type: 'UPDATE-PRIVATE-BOARD',
        payload: { board: attackBoard, game: newGame },
      });
    });
  }, [socket.on]);

  const addHover = (isAdd, y, x) => {
    let isError = false;
    const blocksToHover = [];
    const { direction, shipClickIndex, shipIndex } = selectedShip;
    const originalX = x;
    const originalY = y;
    const indexX = originalX - shipClickIndex;
    const indexY = originalY - shipClickIndex;
    const ship = ships[shipIndex];

    try {
      for (let i = 0; i < ship.size; i++) {
        if (direction === constants.directionRow) {
          if (!refs[y][indexX + i].current.classList.contains('drop')) {
            if (isAdd) {
              // refs[y][indexX + i].current.classList.add(`${styles.hover}`);

              blocksToHover.push({
                hover: refs[originalY][indexX + i].current,
                shipLocation: {
                  x: indexX + i,
                  y: originalY,
                  id: ship.id,
                  size: ship.size,
                },
              });
            } else {
              refs[y][indexX + i].current.classList.remove(`${styles.hover}`);
            }
          }
        }
        if (direction === constants.directionColumn) {
          if (!refs[indexY + i][originalX].current.classList.contains('drop')) {
            if (isAdd) {
              blocksToHover.push({
                hover: refs[indexY + i][originalX].current,
                shipLocation: {
                  x: originalX,
                  y: indexY + i,
                  id: ship.id,
                  size: ship.size,
                },
              });
            } else {
              refs[indexY + i][originalX].current.classList.remove(
                `${styles.hover}`
              );
            }
          }
        }
      }
    } catch (err) {
      isError = true;
      zIndexRef.current = 0;
      console.log(err);
    }

    if (blocksToHover.length === ship.size) {
      blocksToHover.map(block => {
        block.hover.classList.add(`${styles.hover}`);
      });
      blocksToAddRef.current = blocksToHover;
    }
  };

  const mouseLeaveHandler = (e, y, x) => {
    if (!selectedShip) {
      return;
    }
    addHover(false, y, x);
  };

  const mouseEnterHandler = (e, y, x) => {
    if (!selectedShip) {
      return;
    }
    zIndexRef.current = 60;
    addHover(true, y, x);
  };

  const shipOnTop = (shipClickIndex, shipIndex, direction) => {
    console.log('hello');
    zIndexRef.current = 60;

    setSelectedShip({ shipClickIndex, shipIndex, direction });
  };

  return (
    <>
      {!game[getPlayerKey(game.playerOne.id, socket.id)].ready && (
        <div className={styles.shipContainer}>
          {ships &&
            ships.map((ship, i) => {
              return (
                <Ship
                  key={ship.id}
                  onDragEnd={onDragEndHandler}
                  onDrag={onDragHandler}
                  onDragStart={(shipClickIndex, direction) =>
                    shipOnTop(shipClickIndex, i, direction)
                  }
                  ship={ship}
                  isDragging={isDragging}
                  ships={ships}
                  onTap={(shipClickIndex, direction) =>
                    shipOnTop(shipClickIndex, i, direction)
                  }
                />
              );
            })}
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.privateBoard}>
          {headingTop.map((item, i) => {
            return (
              <div
                key={i}
                className={boardStyles.heading}
                style={{ gridColumn: `${i + 2} / span 1` }}
              >
                <div className={boardStyles.heading__y}>
                  {item}
                  {/* <div className={boardStyles.lineY}></div> */}
                  <Cube
                    color={[
                      '#F280B6',
                      '#F2CEE2',
                      '#2165BF',
                      '#3587F2',
                      '#204359',
                      '#03A6A6',
                    ]}
                  />
                </div>
              </div>
            );
          })}
          {headingSide.map((item, i) => {
            return (
              <div
                key={i}
                className={boardStyles.heading}
                style={{ gridRow: `${i + 2} / span 1` }}
              >
                <div className={boardStyles.heading__x}>
                  <div className={boardStyles.private}>{item}</div>
                </div>
              </div>
            );
          })}
          {board &&
            board.map((_, i) =>
              _.map((square, ii) => (
                <div
                  className={styles.square}
                  style={{ zIndex: zIndexRef.current }}
                  key={`${i}${ii}`}
                  ref={el => (refs[i][ii].current = el)}
                  data-pos={[i, ii]}
                  onMouseLeave={e => mouseLeaveHandler(e, i, ii)}
                  onMouseEnter={e => mouseEnterHandler(e, i, ii)}
                >
                  <motion.div className={`${styles.square__circle}`}>
                    {square === 'MISS' && 'sometinh'}
                    {square === 'SUNK' && 'something'}
                    {square === 'HIT' && (
                      <Cube
                        size={'m'}
                        color={[
                          '#F2A663',
                          '#F2955E',
                          '#F27457',
                          '#F26052',
                          '#A64444',
                          '#f2c288',
                        ]}
                      />
                    )}
                  </motion.div>
                </div>
              ))
            )}
        </div>

        {!game[getPlayerKey(game.playerOne.id, socket.id)].ready && (
          <button className={styles.btn} onClick={resetBoard}>
            reset
          </button>
        )}
      </div>
    </>
  );
};
