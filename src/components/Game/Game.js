import React, { useContext, useState, useEffect } from 'react';

import socketActions from '../../services/socketActions';

import Board from '../Board/Board';

import { GameContext } from '../../context/storeContext';
import { getGameById } from '../../database/crud';

import styles from './Game.module.scss';

// const Game = ({ socket }) => {
//   const { state, dispatch } = useContext(GameContext);
//   useEffect(() => {
//     //clean up later
//     socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
//       dispatch({
//         type: 'ATTACK-PLAYER',
//         payload: {
//           state: data.state,
//         },
//       });
//     });
//   }, []);

//   useEffect(() => {
//     socket.on('GAME-CREATED-HANDLER', data => {
//       getGameById(data.gameId, snapshot => {
//         dispatch({
//           type: 'START-GAME',
//           payload: snapshot,
//         });
//       });
//     });

//     return () => socket.close();
//   }, []);

//   useEffect(() => {
//     //clean up later
//     socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
//       dispatch({
//         type: 'ATTACK-PLAYER',
//         payload: {
//           state: data.state,
//         },
//       });
//     });
//   }, []);

//   const boardClickHandler = (x, y) => {
//     if (state.board[y][x - 1] === undefined) {
//       alert('no');
//     }
//     socket.emit(socketActions.ATTACK_SHIP, {
//       x: x,
//       y: y,
//       gameName: state.game.name,
//       attackingPlayerId: socket.id,
//       state: state,
//     });
//   };

//   const renderPicker = () => {
//     const { status } = state;
//     if (status === 'ACTIVE') {
//       return (
//         <div>
//           <div>player 1: {state.game.playerOne.name}</div>
//           <div>player 2: {state.game.playerTwo.name}</div>
//           <Board onClick={boardClickHandler} socket={socket} />
//         </div>
//       );
//     }
//     if (status === 'HOSTED') {
//       return (
//         <div className={styles.wating}>
//           <div className="lds-ripple">
//             <div></div>
//             <div></div>
//           </div>
//           wating for player two
//         </div>
//       );
//     }
//   };

//   return { renderPicker };
// };

const Game = ({ socket }) => {
  return <div>GAME</div>;
};

export default Game;
