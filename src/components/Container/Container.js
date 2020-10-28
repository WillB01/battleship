import React, { useEffect, useRef, useState, useContext } from 'react';
import { gameActionTypes } from '../../actions/actions';
import { RoomsContext, GameContext } from '../../context/storeContext';

import Game from '../Game/Game';
import Rooms from '../Rooms/Rooms';

const Container = ({ socket }) => {
  const { state: rState } = useContext(RoomsContext);
  const { state, dispatch } = useContext(GameContext);
  useEffect(() => {
    console.log('effetct', state);
    console.log('room state', rState);
  }, []);

  const setPlayerHandler = (playerType, id, roomName) => {
    // socket.emit('uppdateAfterSecondPlayer');
    if (playerType === 'PLAYER-TWO') {
      dispatch({
        type: gameActionTypes.SET_PLAYER_TWO,
        payload: {
          id: id,
          roomName: roomName,
          playerName: 'Arne',
        },
      });
    }
  };

  return (
    <>
      <Rooms socket={socket} setPlayer={setPlayerHandler} />
      <Game socket={socket} />
    </>
  );
};

export default Container;
