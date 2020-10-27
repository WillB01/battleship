import React, { useReducer, useContext } from 'react';
import { PlayerBoardContext } from '../../context/storeContext';
import { headingTop, headingSide } from '../../services/boardBlueprint';
import styles from './Board.module.scss';

const PlayerBoard = ({ type, temp }) => {
  const { state, dispatch } = useContext(PlayerBoardContext);

  return (
    <div className={styles.playerBoard}>
      {headingTop.map((item, i) => {
        return <div style={{ gridColumn: `${i + 2} / span 1` }}>{item}</div>;
      })}
      {headingSide.map((item, i) => {
        return <div style={{ gridRow: `${i + 2} / span 1` }}>{item}</div>;
      })}
      {state.board.map((item, i) => {
        return item.map((itemItem, ii) => {
          itemItem = ii;
          return (
            <div key={ii} onClick={() => temp(itemItem)}>
              {itemItem}
            </div>
          );
        });
      })}
    </div>
  );
};

export default PlayerBoard;
