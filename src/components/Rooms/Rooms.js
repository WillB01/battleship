import React, { useContext, useEffect, useState, Fragment } from 'react';
import { roomActionTypes, gameActionTypes } from '../../actions/actions';
import socketActions from '../../services/socketActions';

import { RoomsContext } from '../../context/storeContext';

const Rooms = ({ socket }) => {
  const { state, dispatch } = useContext(RoomsContext);
  const [showSelf, setShowSelf] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [roomToJoin, setRoomToJoin] = useState({
    room: {},
    roomIndex: '',
    rooms: [],
  });
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
  }, []);

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

  const onClickHandler = (room, i, rooms) => {
    setRoomToJoin({ room, roomIndex: i, rooms });
    setShowNameInput(true);
  };

  const joinRoom = () => {
    socket.emit(socketActions.JOIN_ROOM, {
      roomName: roomToJoin.room.name,
      roomIndex: roomToJoin.roomIndex,
      rooms: roomToJoin.rooms,
      playerOneId: roomToJoin.room.hostId,
      playerTwoId: socket.id,
      playerOneName: roomToJoin.room.hostName,
      playerTwoName: playerTwoInput,
    });
  };

  return (
    <div>
      {showSelf && (
        <>
          {showNameInput && (
            <div>
              <input
                type="text"
                onChange={e => setPlayerTwoInput(e.target.value)}
              />
              <button onClick={joinRoom}>lets go!</button>
            </div>
          )}
          {state.rooms &&
            state.rooms.map((room, i) => {
              if (room.hostId === socket.id) {
                return;
              }
              return (
                <Fragment key={`${Math.random()}-${i}`}>
                  {!showNameInput && (
                    <div>
                      <div onClick={() => onClickHandler(room, i, state.rooms)}>
                        <span>
                          {room.name} - {room.hostName}
                        </span>
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
        </>
      )}
    </div>
  );
};

export default Rooms;
