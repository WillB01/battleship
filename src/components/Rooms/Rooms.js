import React, { useContext, useEffect } from 'react';
import { roomActionTypes } from '../../actions/actions';
import socketActions from '../../server/socketActions';

import CreateRooms from './CreateRoom';
import { RoomsContext } from '../../context/storeContext';

const Rooms = ({ socket }) => {
  const { state, dispatch } = useContext(RoomsContext);

  useEffect(() => {
    console.log(socketActions);
    socket.on(socketActions.NEW_ROOM, data => {
      console.log('DATA', data);
      if (data === null) {
        console.log('TRUE', data);

        data = {
          rooms: [...state.rooms],
        };
      }
      dispatch({
        type: roomActionTypes.CREATE_ROOM,
        payload: {
          rooms: data.rooms,
        },
      });
    });

    socket.on(socketActions.JOIN_ROOM, data => {
      const rooms = [...state.rooms];

      const updatedRooms = rooms.map(r =>
        r.name === data.roomName ? { ...r, opponentId: data.opponentId } : r
      );

      console.log('[UPDATED ROOMS JOIN]', updatedRooms);

      dispatch({
        type: roomActionTypes.OPPONENT_JOINS,
        payload: updatedRooms,
      });
    });
  }, [state, socket]);

  const onClickHandler = room => {
    socket.emit('joinRoom', { roomName: room.name, opponentId: socket.id });
  };

  console.log('[STATE]', state.rooms);
  return (
    <div>
      <CreateRooms socket={socket} />
      {state.rooms &&
        state.rooms.map((room, i) => {
          return (
            <div key={room.name} onClick={() => onClickHandler(room)}>
              {room.name}
            </div>
          );
        })}
    </div>
  );
};

export default Rooms;
