import React, { useContext } from 'react';
import Game from '../Game/Game';
import Rooms from '../Rooms/Rooms';
import CreateRooms from '../Rooms/CreateRoom';

import { GameContext, RoomsContext } from '../../context/storeContext';

const Container = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);
  const { rState, rDispatch } = useContext(GameContext);

  console.log(state);

  return (
    <>
      {!state.game.playerTwo.id && <CreateRooms socket={socket} />}
      {!state.game.playerOne.id && <Rooms socket={socket} />}
      <Game socket={socket} />
    </>
  );
};

export default Container;
