import React, { useContext, useState, useEffect, Children } from 'react';

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
//
//   };

//   return { renderPicker };
// };

const Game = ({ socket, index }) => {
  const { state, dispatch } = useContext(GameContext);

  useEffect(() => {
    //clean up later
    socket.on(socketActions.ATTACK_SHIP_HANDLER, data => {
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: {
          index: index,
          game: data.game,
        },
      });
    });
  }, []);

  const boardClickHandler = (x, y) => {
    if (state.games[index].game.board[y][x - 1] === undefined) {
      alert('no');
    }
    console.log(state.games[index].game);
    socket.emit(socketActions.ATTACK_SHIP, {
      x: x,
      y: y,
      gameName: state.games[index].name,
      attackingPlayerId: socket.id,
      game: state.games[index].game,
    });
  };

  return (
    <div>
      <Board onClick={boardClickHandler} socket={socket} index={index} />
    </div>
  );
};

export default Game;
