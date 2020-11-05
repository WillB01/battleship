import React, { useReducer, useContext, useEffect, useState } from 'react';
import { GameContext } from '../../context/storeContext';
import { headingTop, headingSide } from '../../services/boardBlueprint';
import styles from './Board.module.scss';
import socketActions from '../../services/socketActions';

const Board = ({ onClick, index }) => {
  const { state, dispatch } = useContext(GameContext);

  const { board } = state.games[index].game;

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
        {board.map((item, i) => {
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

export default Board;
