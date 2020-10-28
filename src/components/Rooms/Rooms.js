import React, { useContext, useEffect, useState } from 'react';
import { roomActionTypes, gameActionTypes } from '../../actions/actions';
import socketActions from '../../services/socketActions';

import CreateRooms from './CreateRoom';
import { RoomsContext } from '../../context/storeContext';

const Rooms = ({ socket }) => {
  const { state, dispatch } = useContext(RoomsContext);
  const [showSelf, setShowSelf] = useState(true);

  useEffect(() => {
    socket.on(socketActions.NEW_ROOM, data => {
      dispatch({
        type: roomActionTypes.CREATE_ROOM,
        payload: {
          rooms: data.rooms,
        },
      });
    });
  }, [socket.on]);

  useEffect(() => {
    socket.on(socketActions.JOIN_ROOM, data => {
      const rooms = [...state.rooms];

      for (const key in rooms) {
        if (rooms[key].name === data.roomName) {
          setShowSelf(false);
          rooms.splice(key);
          break;
        }
      }

      dispatch({
        type: roomActionTypes.OPPONENT_JOINS,
        payload: rooms,
      });
    });
  }, [state.rooms]);

  useEffect(() => {
    socket.on('removeRoom', data => {
      data.rooms.splice(data.roomIndex, 1);
      dispatch({ type: 'REMOVE-ROOM', payload: data.rooms });
    });
  }, []);

  const onClickHandler = (room, roomIndex, rooms) => {
    socket.emit('joinRoom', {
      roomName: room.name,
      roomIndex,
      rooms,
      playerOneId: room.hostId,
      playerTwoId: socket.id,
    });
  };

  return (
    <div>
      {showSelf && (
        <>
          <CreateRooms socket={socket} />
          {state.rooms &&
            state.rooms.map((room, i) => {
              if (room.hostId === socket.id) {
                return;
              }
              return (
                <div
                  key={room.name}
                  onClick={() => onClickHandler(room, i, state.rooms)}
                >
                  {room.name}
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};

export default Rooms;
