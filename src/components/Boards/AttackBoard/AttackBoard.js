import React, { useReducer, useContext, useEffect, useState } from 'react';

import styles from './AttackBoard.module.scss';

import { GameContext } from '../../../context/storeContext';
import {
  headingTop,
  headingSide,
  shipSizes,
} from '../../../services/boardBlueprint';
import { socket } from '../../../server/socket';
import {
  getPlayerKey,
  getOpponentPlayerKey,
  checkIfSkipSunk,
} from '../../../services/helpers';
import { GiVikingLonghouse } from 'react-icons/gi';

import socketActions from '../../../services/socketActions';

const AttackBoard = () => {
  const {
    state: { game, attackBoard, privateBoard },
    dispatch,
  } = useContext(GameContext);

  useEffect(() => {
    const enemyPlayer = getOpponentPlayerKey(game.playerOne.id, socket.id);
    let updateAttackBoard = { ...attackBoard };

    const enemyShipLocation = game[enemyPlayer].shipLocation;

    updateAttackBoard.board = updateAttackBoard.board.map((_, y) => {
      return _.map((square, x) => {
        for (const key in enemyShipLocation) {
          if (
            enemyShipLocation[key].y === y &&
            enemyShipLocation[key].x === x
          ) {
            return (square = [
              enemyShipLocation[key].size,
              enemyShipLocation[key].id,
            ]);
          }
        }
      });
    });

    dispatch({
      type: 'ADD-SHIPS-TO-ATTACK-BOARD',
      payload: {
        attackBoard: updateAttackBoard.board,
        player: getPlayerKey(game.playerOne.id, socket.id),
      },
    });
  }, []);

  const boardClickHandler = (y, x, square) => {
    if (square === 'HIT' || square === 'MISS' || square === 'SUNK') {
      return;
    }

    if (
      (game.playerTurn === 'PLAYER-ONE' && socket.id === game.playerTwo.id) ||
      (game.playerTurn === 'PLAYER-ONE' && square === 'HIT')
    ) {
      return;
    }
    if (game.playerTurn === 'PLAYER-TWO' && socket.id === game.playerOne.id) {
      return;
    }
    const player = getPlayerKey(game.playerOne.id, socket.id);

    const playerAttackLocation = [...game[player].attackLocation];

    const updateGame = { ...game };
    const updateBoard = { ...attackBoard };

    if (square) {
      playerAttackLocation.push({
        x,
        y,
        shipSize: square[0],
        shipId: square[1],
      });
      updateBoard.board[y][x] = 'HIT';
      const sunkenShips = checkIfSkipSunk(
        playerAttackLocation,
        square[0],
        square[1]
      );
      if (sunkenShips) {
        sunkenShips.map(ship => {
          updateBoard.board[ship.y][ship.x] = 'SUNK';
        });
      }
    } else {
      playerAttackLocation.push({ x, y, shipSize: '' });
      updateBoard.board[y][x] = `MISS`;
    }

    updateGame.playerTurn =
      updateGame.playerTurn === 'PLAYER-ONE' ? 'PLAYER-TWO' : 'PLAYER-ONE';
    updateGame[player].attackLocation = playerAttackLocation;

    dispatch({
      type: 'UPDATE-ATTACK-BOARD',
      payload: { attackBoard: updateBoard.board, updateGame: updateGame },
    });

    ///////////////////

    socket.emit(
      socketActions.ATTACK_SHIP,
      updateGame,
      updateBoard.board,
      updateGame.playerOne.id === socket.id
        ? updateGame.playerTwo.id
        : updateGame.playerOne.id
    );
  };

  return (
    <>
      <div className={styles.playerBoard}>
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
        {attackBoard.board.map((_, y) => {
          return _.map((square, x) => {
            return (
              <div key={x} onClick={() => boardClickHandler(y, x, square)}>
                {square === 'HIT' || square === 'MISS' || square === 'SUNK'
                  ? square
                  : ''}
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default AttackBoard;
