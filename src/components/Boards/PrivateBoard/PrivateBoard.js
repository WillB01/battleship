import React, {
  useContext,
  useEffect,
  useState,
  createRef,
  useMemo,
} from 'react';

import styles from '../PrivateBoard/PrivateBoard.module.scss';
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

import Ship from '../../Ship/Ship';

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

  let refs = useMemo(() => Array.from({ length: 10 }).map(() => ''), []);
  refs = refs.map(item => {
    return (item = Array.from({ length: 10 }).map(() => createRef()));
  });

  useEffect(() => {
    dispatch({ type: 'SET-SHIPS' });
  }, []);

  const resetBoard = () => {
    refs.map((board, i) => {
      board.map((square, ii) => {
        square.current.style.background = constants.squareColor;
      });
    });

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
                  refs[indexY + i][originalX].current.style.background ===
                  constants.squareColor
                ) {
                  blocksToHover.push({
                    element: refs[indexY + i][originalX].current,
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

      blocksToHover.map(block => {
        block.element.style.background = constants.shipDropColor;
      });

      dispatch({ type: 'UPDATE-SHIPS', payload: updateShips });
      setIsDragging(false);
      addShipLocation(blocksToHover);
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

    dispatch({ type: 'UPDATE-SHIPS', payload: updateShips });
    setIsDragging(true);
  };

  useEffect(() => {
    socket.on('ATTACK-SHIP-HANDLER', (newGame, attackBoard) => {
      dispatch({
        type: 'UPDATE-PRIVATE-BOARD',
        payload: { board: attackBoard, game: newGame },
      });
    });
  }, [socket.on]);

  return (
    <div className={styles.container}>
      <div className={styles.privateBoard}>
        {headingTop.map((item, i) => {
          return (
            <div key={i} style={{ gridColumn: `${i + 2} / span 1` }}>
              {item}
            </div>
          );
        })}
        {headingSide.map((item, i) => {
          return (
            <div key={i} style={{ gridRow: `${i + 2} / span 1` }}>
              {item}
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
                style={{
                  background: constants.squareColor,
                }}
              >
                <div className={`${styles.square__item}`}>
                  {/* {renderAttackLocation(i, ii)} */}
                  {square === 'HIT' || square === 'MISS' || square === 'SUNK'
                    ? square
                    : ''}
                </div>
              </div>
            ))
          )}
      </div>

      {!game[getPlayerKey(game.playerOne.id, socket.id)].ready && (
        <button onClick={resetBoard}>reset</button>
      )}

      <div className={styles.shipContainer}>
        {ships &&
          ships.map((ship, i) => {
            return (
              <Ship
                key={ship.id}
                onDragEnd={onDragEndHandler}
                onDragStart={() => onDragStartHandler(ship.id)}
                onDrag={onDragHandler}
                ship={ship}
                isDragging={isDragging}
                ships={ships}
              />
            );
          })}
      </div>
    </div>
  );
};
