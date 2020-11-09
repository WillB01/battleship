import React, { useReducer, useContext, useEffect, useState } from 'react';
import styles from '../PrivateBoard/PrivateBoard.module.scss';
import boardStyles from '../SharedBoard/Board.module.scss';

import Square from './Square';

import { motion } from 'framer-motion';

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
  const [shipDirection, setShipDirection] = useState('');
  const [isResetGame, setResetShips] = useState(false);

  const [draggedPosition, setDraggedPosition] = useState({});

  const setShipY = (x, y, shipSize) => {
    console.log('HELLO');
    console.log('draggedpos', x, y, shipSize);
    const updateBoard = [...board];
    for (let i = 0; i < shipSize; i++) {
      try {
        updateBoard[y - 1 + i][x] = 'i';
      } catch {
        return alert('err');
      }
    }
    console.log(updateBoard);
    setBoard(updateBoard);
    setCurrentShip(null);
    setShipDirection('');
  };

  const setShipX = (x, y, shipSize) => {
    const updateBoard = [...board];

    x = x - shipClickPosition;

    for (let i = 0; i < shipSize; i++) {
      updateBoard[y][x + i] = [currentShip.id, shipSize];
    }
    setBoard(updateBoard);
    setCurrentShip(null);
    setShipDirection('');
  };

  useEffect(() => {
    const test = [...privateBoardTemp];
    setBoard(test);
  }, []);

  useEffect(() => {
    const ships = [];
    const newShips = [...shipSizes];
    newShips.map((size, i) => {
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
    setShipDirection(shipDirection === 'column' ? 'row' : 'column');
    console.log(ship);
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
    setShipDirection('');
    setResetShips(true);
  };

  const onDragEndHandler = (info, ship) => {
    try {
      const square = document.elementFromPoint(info.point.x, info.point.y);

      const position = square.dataset.pos;
      selectShipHandler(ship);
      setDraggedPosition({ y: position[0], x: position[2] });
      setDraggingStatus('DRAGGING-END');
    } catch {
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
        {ships &&
          ships.map((ship, i) => {
            return (
              <Ship
                key={ship.id}
                id={ship.id}
                size={ship.size}
                onDrag={direction => {
                  setResetShips(false);
                  setDraggingStatus('DRAGGING');
                  setShipDirection(direction);
                }}
                onDragEnd={(e, info) => {
                  onDragEndHandler(info, ship);
                }}
                shipClickPosition={i => shipClickHandler(i)}
                handleDirection={direction => {
                  setShipDirection(direction);
                }}
                resetShips={isResetGame}
              />
            );
          })}
      </motion.div>
    </>
  );
};
