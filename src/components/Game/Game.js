import React, { useContext, useEffect } from 'react';

import { GameContext } from '../../context/storeContext';
import { socket } from '../../server/socket';
import { getPlayerKey } from '../../services/helpers';

import socketActions from '../../services/socketActions';
import PrivateBoard from '../Boards/PrivateBoard/PrivateBoard';
import AttackBoard from '../Boards/AttackBoard/AttackBoard';

const Game = () => {
  const {
    state: { game, privateBoard },
    dispatch,
  } = useContext(GameContext);

  useEffect(() => {
    socket.on('PLAYER-IS-READY-TO-START-HANDLER', player => {
      dispatch({
        type: 'PLAYER-IS-READY-TO-START',
        payload: player,
      });
    });
    return () => socket.off('PLAYER-IS-READY-TO-START-HANDLER');
  }, []);

  useEffect(() => {
    socket.on('ADD-SHIP-LOCATION-HANDLER', data => {
      dispatch({ type: 'ADD-SHIP-LOCATION', payload: { ...data } });
    });

    return () => socket.off('ADD-SHIP-LOCATION-HANDLER');
  }, []);

  useEffect(() => {
    socket.on(socketActions.ATTACK_SHIP_HANDLER, game => {
      dispatch({
        type: 'ATTACK-PLAYER',
        payload: game,
      });
    });
    return () => socket.off(socketActions.ATTACK_SHIP_HANDLER);
  }, []);

  const boardClickHandler = (x, y, boardType) => {
    socket.emit(socketActions.ATTACK_SHIP, {
      boardType: boardType,
      x: x,
      y: y,
      gameId: game.id,
      game: game,
    });
  };

  const readyButtonHandler = () => {
    socket.emit('PLAYER-IS-READY-TO-START', {
      player: getPlayerKey(game.playerOne.id, socket.id),
      id: game.id,
    });
  };

  const isBothReady = game.playerOne.ready && game.playerTwo.ready;

  return (
    <div>
      {isBothReady && <AttackBoard onClick={boardClickHandler} />}

      {!game[getPlayerKey(game.playerOne.id, socket.id)].ready &&
        privateBoard.isAllDropped && (
          <button onClick={readyButtonHandler}>ready up</button>
        )}
      <PrivateBoard />
    </div>
  );
};

export default Game;
