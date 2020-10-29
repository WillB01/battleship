import React, { useContext, useEffect, useState } from 'react';
import { roomActionTypes, gameActionTypes } from '../../actions/actions';
import socketActions from '../../services/socketActions';

import { RoomsContext } from '../../context/storeContext';

const Rooms = ({ socket }) => {
  const { state, dispatch } = useContext(RoomsContext);
  const [showSelf, setShowSelf] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerTwoInput, setPlayerTwoInput] = useState('');

  useEffect(() => {
    socket.on(socketActions.CREATE_ROOM_HANDLER, data => {
      dispatch({
        type: roomActionTypes.CREATE_ROOM,
        payload: {
          rooms: data.rooms,
        },
      });
    });
  }, [socket.on]);

  useEffect(() => {
    socket.on(socketActions.JOIN_ROOM_HANDLER, data => {
      const rooms = [...state.rooms];

      for (const key in rooms) {
        if (rooms[key].name === data.roomName) {
          setShowSelf(false);
          break;
        }
      }
    });
  }, []);

  useEffect(() => {
    socket.on('removeRoom', data => {
      data.rooms.splice(data.roomIndex, 1);
      dispatch({ type: 'REMOVE-ROOM', payload: data.rooms });
    });
  }, []);

  const onClickHandler = (room, roomIndex, rooms) => {
    setShowNameInput(true);
  };

  const joinRoom = (room, roomIndex, rooms) => {
    socket.emit(socketActions.JOIN_ROOM, {
      roomName: room.name,
      roomIndex,
      rooms,
      playerOneId: room.hostId,
      playerTwoId: socket.id,
      playerOneName: room.hostName,
      playerTwoName: playerTwoInput,
    });
  };

  return (
    <div>
      {showSelf && (
        <>
          {state.rooms &&
            state.rooms.map((room, i) => {
              if (room.hostId === socket.id) {
                return;
              }
              return (
                <>
                  <div
                    key={room.name}
                    onClick={() => onClickHandler(room, i, state.rooms)}
                  >
                    <span>
                      {room.name} - {room.hostName}
                    </span>
                  </div>
                  {showNameInput && (
                    <div key={room.name}>
                      <input
                        type="text"
                        onChange={e => setPlayerTwoInput(e.target.value)}
                      />
                      <button onClick={() => joinRoom(room, i, state.rooms)}>
                        lets go!
                      </button>
                    </div>
                  )}
                </>
              );
            })}
        </>
      )}
    </div>
  );
};

export default Rooms;
