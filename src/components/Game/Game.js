import React, { useContext, useState, useEffect } from 'react';

import Board from '../Board/Board';
import Rooms from '../Rooms/Rooms';

import { RoomsContext } from '../../context/storeContext';

const Game = ({ temp, socket }) => {
  const { state, dispatch } = useContext(RoomsContext);
  const [showRows, setShowRows] = useState();

  useEffect(() => {
    const roomsState = [...state.rooms];
    let rooms = null;

    if (state.rooms.length === 0) {
      return setShowRows(<Rooms socket={socket} />);
    } else {
      for (const key in roomsState) {
        console.log('game', roomsState[key].hostId, socket.id);
        if (roomsState[key].hostId === socket.id) {
          console.log('yes');
          return setShowRows(null);
        }
        if (roomsState[key].opponentId === socket.id) {
          return setShowRows(null);
        }
      }

      return setShowRows(<Rooms socket={socket} />);
    }
  }, [state, setShowRows]);

  return (
    <>
      {showRows}
      <Board temp={temp} socket={socket} />
    </>
  );
};

export default Game;
