import React, { useReducer, useContext, useEffect, useState } from 'react';
import styles from '../PrivateBoard/PrivateBoard.module.scss';
import boardStyles from '../SharedBoard/Board.module.scss';

import { isOccupied } from '../../../services/helpers';

import Square from './Square';

import { motion, AnimateSharedLayout } from 'framer-motion';

import { GameContext } from '../../../context/storeContext';
import {
  headingTop,
  headingSide,
  boardBlueprint,
  privateBoardTemp,
  shipSizes,
} from '../../../services/boardBlueprint';

import Ship from '../../Ship/Ship';

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
  const [currentShip, setCurrentShip] = useState(null);
  const [ships, setShips] = useState([]);

  const [draggingStatus, setDraggingStatus] = useState('');
  const [shipClickPosition, setShipClickPosition] = useState(null);
  const [shipDirection, setShipDirection] = useState('row');
  const [isResetGame, setResetShips] = useState(false);

  const [draggedPosition, setDraggedPosition] = useState({});
  const [rotateOnBoard, setRotateOnBoard] = useState('');

  const [error, setError] = useState('');

  const setShipY = (x, y, shipSize) => {
    console.log('HELLO');
    console.log('draggedpos', x, y, shipSize);
    const updateBoard = [...board];

    let oldX = x;
    const originalX = x;
    oldX = oldX - shipClickPosition;

    try {
      for (let i = 0; i < shipSize; i++) {
        console.log(updateBoard[y - 1 + i][originalX]);
      }

      if (rotateOnBoard === 'ROTATE-COLUMN') {
        for (let i = 0; i < shipSize; i++) {
          updateBoard[y][oldX + i] = '';
        }
      }

      for (let i = 0; i < shipSize; i++) {
        updateBoard[y - 1 + i][originalX] = [currentShip.id, currentShip.size];
      }

      // updateBoard.map((item, i) =>
      //   item.map((itemItem, ii) => {
      //    updateBoard[i][ii][0] !==;
      //   })
      // );

      setCurrentShip(null);
      setShipDirection('column');
      setError('');
    } catch (err) {
      alert(err);
      setError('column');
    }
  };

  const setShipX = (x, y, shipSize) => {
    console.log('SECOND TIME');
    const updateBoard = [...board];

    console.log(x, y, shipSize);

    const originalX = x;
    x = x - shipClickPosition;

    try {
      if (rotateOnBoard === 'ROTATE-ROW') {
        for (let i = 0; i < shipSize; i++) {
          updateBoard[y - 1 + i][originalX] = '';
        }
      }

      for (let i = 0; i < shipSize; i++) {
        console.log(i);
        updateBoard[y][x + i] = [currentShip.id, shipSize];
      }

      setBoard(updateBoard);
      setCurrentShip(null);
      setShipDirection('row');
      setError('');
    } catch (e) {
      alert(e);
      setError('column');
    }
  };

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

  useEffect(() => {
    if (draggingStatus === 'DRAGGING-END') {
      if (shipDirection === '') {
        return;
      }

      if (shipDirection === 'row') {
        setShipX(draggedPosition.x, draggedPosition.y, currentShip.size);
      }
      if (shipDirection === 'column') {
        setShipY(draggedPosition.x, draggedPosition.y, currentShip.size);
      }
      setDraggingStatus('');
    }
  }, [draggingStatus]);

  const onClickHandler = (x, y, ship) => {
    const direction = shipDirection === 'column' ? 'row' : 'column';

    setRotateOnBoard(`ROTATE-${direction.toUpperCase()}`);

    setShipDirection(direction);

    setCurrentShip({ id: ship[0], size: ship[1] });
    setDraggingStatus({ x, y });

    setDraggingStatus('DRAGGING-END');
  };

  const selectShipHandler = ship => {
    setCurrentShip(ship);
  };

  const shipClickHandler = i => {
    setShipClickPosition(i);
  };

  const onResetHandler = () => {
    console.log('RESET');
    setDraggingStatus('');
    const updatedBoard = board.map(item => {
      return item.map((itemItem, ii) => {
        return (itemItem = ii);
      });
    });

    setBoard(updatedBoard);
    setCurrentShip(null);
    const ships = [];
    shipSizes.map((size, i) => {
      ships.push({ id: i, size: size });
    });

    setShips(ships);
    setShipClickPosition(null);
    setShipDirection('row');
    setResetShips(true);
  };

  const onDragEndHandler = (info, ship) => {
    try {
      const square = document.elementFromPoint(info.point.x, info.point.y);

      const position = square.dataset.pos;

      // const isOkay = isOccupied(
      //   board,
      //   { y: position[0], x: position[2] },
      //   ship.size,
      //   ship.id
      // );

      selectShipHandler(ship);
      setDraggedPosition({ y: position[0], x: position[2] });
      setDraggingStatus('DRAGGING-END');
    } catch {
      console.log('ERROR');
      onResetHandler();
    }
  };

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          padding: '1rem',
        }}
      >
        {board &&
          board.map((item, i) => {
            return item.map((itemItem, ii) => {
              return (
                <>
                  <Square
                    id={currentShip && currentShip.id}
                    x={ii}
                    y={i}
                    content={itemItem}
                    currentShip={currentShip}
                    onClick={onClickHandler}
                  />
                </>
              );
            });
          })}
      </div>
      <motion.div className={styles.shipContainer}>
        <button onClick={onResetHandler}>reset</button>
        {ships.map((ship, i) => {
          return (
            <Ship
              key={ship.id}
              id={ship.id}
              size={ship.size}
              onDrag={() => {
                setResetShips(false);
                setDraggingStatus('DRAGGING');
              }}
              onDragEnd={(e, info) => {
                onDragEndHandler(info, ship);
              }}
              shipClickPosition={i => shipClickHandler(i)}
              resetShips={isResetGame}
              directionHandler={dir => setShipDirection(dir)}
            />
          );
        })}
      </motion.div>
    </>
  );
};
