import React, { useReducer, useContext, useEffect, useState } from 'react';

import styles from './AttackBoard.module.scss';

import { GameContext } from '../../../context/storeContext';
import { headingTop, headingSide } from '../../../services/boardBlueprint';
import { socket } from '../../../server/socket';
import { getPlayerKey, getOpponentPlayerKey } from '../../../services/helpers';

import socketActions from '../../../services/socketActions';
import { GiVikingLonghouse } from 'react-icons/gi';

const AttackBoard = () => {
  const {
    state: { game, attackBoard, privateBoard },
    dispatch,
  } = useContext(GameContext);

  const boardClickHandler = (x, y, boardType) => {
    socket.emit(socketActions.ATTACK_SHIP, {
      boardType: boardType,
      x: x,
      y: y,
      game: game,
      attackBoard: attackBoard.board,
      // privateBoard:, privateBoard.board
    });
  };

  const renderAttackLocation = (y, x) => {
    const enemyPlayer = getOpponentPlayerKey(game.playerOne.id, socket.id);
    const player = getPlayerKey(game.playerOne.id, socket.id);

    const enemyAttackLocation = game[player].attackLocation;
    const playerShipLocation = game[enemyPlayer].shipLocation;

    for (const key in enemyAttackLocation) {
      const enemyX = enemyAttackLocation[key].x;
      const enemyY = enemyAttackLocation[key].y;
      if (enemyX === x && enemyY === y) {
        for (const k in playerShipLocation) {
          const playerX = playerShipLocation[k].x;
          const playerY = playerShipLocation[k].y;
          if (playerX === enemyX && playerY === enemyY) {
            return <div>HIT</div>;
          }
        }

        return <div>{enemyPlayer} attack</div>;
      }
    }
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
        {attackBoard.board.map((item, i) => {
          return item.map((itemItem, ii) => {
            return (
              <div key={ii} onClick={() => boardClickHandler(ii, i, itemItem)}>
                {renderAttackLocation(i, ii)}
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default AttackBoard;
