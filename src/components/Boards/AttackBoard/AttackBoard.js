import React, { useReducer, useContext, useEffect, useState } from 'react';
import { GameContext } from '../../../context/storeContext';
import { headingTop, headingSide } from '../../../services/boardBlueprint';
import styles from './AttackBoard.module.scss';
import socketActions from '../../../services/socketActions';

const AttackBoard = ({ onClick }) => {
  const { state, dispatch } = useContext(GameContext);

  const { attackBoard } = state;

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
              <div key={ii} onClick={() => onClick(ii, i, itemItem)}>
                {itemItem}
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default AttackBoard;
