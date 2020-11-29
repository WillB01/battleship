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

import { dropColors } from './privateBoardConstants';

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

import Ship from '../../Ship/Ship';
import SquareContent from '../SquareContent/SquareContent';

import Cube from '../../ui/Cube/Cube';

const PrivateBoard = ({ reset }) => {
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
      <RenderBoard addShipLocation={addShipLocation} reset={reset} />
    </>
  );
};

export default PrivateBoard;

const RenderBoard = ({ addShipLocation, reset }) => {
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
        dropColors.map((__, i) => {
          square.current.classList.remove(dropColors[i]);
        });
      });
    });

    // zIndexRef.current = 1;

    setSelectedShip('');
    setIsDragging(false);
    dispatch({
      type: 'RESET-PRIVATE-BOARD',
      payload: getPlayerKey(game.playerOne.id, socket.id),
    });
  };

  useEffect(() => {
    resetBoard();
  }, [reset]);

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

    let error = false;
    let doDispatch = false;
    try {
      blocksToAddRef.current.map(block => {
        if (isEventInElement(e, blocksToAddRef.current[shipClickIndex].hover)) {
          if (blocksToAddRef.current.length === ship.size) {
            block.hover.classList.remove(`${styles.hover}`);
            block.hover.classList.add('drop');
            block.hover.classList.add(dropColors[ship.id]);
            // block.hover.classList.add(`drop drop__${selectedShip.shipIndex}`);
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
    const blocksToHover = [];
    let error = false;
    try {
      refs.map((board, i) => {
        board.map((square, ii) => {
          const el = square.current;
          if (
            board[shipClickIndex].current.classList.contains(`${styles.hover}`)
          ) {
            return;
          }
          const originalY = parseInt(
            el.dataset.pos[0] || el.children[0].dataset.pos[0]
          );
          const originalX = parseInt(
            el.dataset.pos[2] || el.children[0].dataset.pos[0]
          );
          if (isEventInElement(e, square.current)) {
            const indexX = originalX - shipClickIndex;
            const indexY = originalY - shipClickIndex;
            for (let i = 0; i < ship.size; i++) {
              if (direction === constants.directionRow) {
                if (!board[indexX + i].current.classList.contains('drop')) {
                  blocksToHover.push({
                    hover: board[indexX + i].current,
                    shipLocation: {
                      x: indexX + i,
                      y: originalY,
                      id: ship.id,
                      size: ship.size,
                    },
                  });
                }
              }
              if (direction === constants.directionColumn) {
                if (
                  !refs[indexY + i][originalX].current.classList.contains(
                    'drop'
                  )
                ) {
                  blocksToHover.push({
                    hover: refs[indexY + i][originalX].current,
                    shipLocation: {
                      x: originalX,
                      y: indexY + i,
                      id: ship.id,
                      size: ship.size,
                    },
                  });
                }
              }
            }
          }
        });
      });
    } catch (e) {
      console.log(e);
      error = true;
    }
    if (blocksToHover.length === ship.size) {
      blocksToHover.map(block => {
        if (!error) {
          block.hover.classList.add(`${styles.hover}`);
        }

        setTimeout(() => {
          block.hover.classList.remove(`${styles.hover}`);
        }, 20);
      });

      if (!error) {
        blocksToAddRef.current = blocksToHover;
      }
    }
  };

  useEffect(() => {
    socket.on('ATTACK-SHIP-HANDLER', (newGame, attackBoard) => {
      dispatch({
        type: 'UPDATE-PRIVATE-BOARD',
        payload: { board: attackBoard, game: newGame },
      });
    });
  }, [socket.on]);

  const shipOnTop = (shipClickIndex, shipIndex, direction) => {
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
                  {/* <Cube
                    color={[
                      '#F280B6',
                      '#F2CEE2',
                      '#2165BF',
                      '#3587F2',
                      '#204359',
                      '#03A6A6',
                    ]}
                  /> */}
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
                  key={`${i}${ii}`}
                  ref={el => (refs[i][ii].current = el)}
                  data-pos={[i, ii]}
                >
                  <SquareContent square={square} type={'private'} />
                  {/* <motion.div className={`${styles.square__circle}`}>
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
                  </motion.div> */}
                </div>
              ))
            )}
        </div>

        {!game[getPlayerKey(game.playerOne.id, socket.id)].ready &&
          !privateBoard.isAllDropped && (
            <button className={styles.btn} onClick={resetBoard}>
              reset
            </button>
          )}
      </div>
    </>
  );
};
