import React, { useEffect, useRef, useState, useContext } from 'react';
import { gameActionTypes } from '../../actions/actions';
import { RoomsContext, GameContext } from '../../context/storeContext';

import Game from '../Game/Game';
import Rooms from '../Rooms/Rooms';

const Container = ({ socket }) => {
  const { state: rState } = useContext(RoomsContext);
  const { state, dispatch } = useContext(GameContext);

  return (
    <>
      <Rooms socket={socket} />
      <Game socket={socket} />
    </>
  );
};

export default Container;
