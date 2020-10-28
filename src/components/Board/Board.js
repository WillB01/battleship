import React, { useReducer, useContext, useEffect, useState } from 'react';
import { GameContext } from '../../context/storeContext';
import { headingTop, headingSide } from '../../services/boardBlueprint';
import styles from './Board.module.scss';

const Board = ({ onClick }) => {
  const { state, dispatch } = useContext(GameContext);

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
        {state.board.map((item, i) => {
          return item.map((itemItem, ii) => {
            itemItem = ii;
            return (
              <div key={ii} onClick={() => onClick(itemItem, i)}>
                {itemItem}
              </div>
            );
          });
        })}
      </div>
    </>
  );
};

export default Board;
