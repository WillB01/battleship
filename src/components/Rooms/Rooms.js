import React, { useContext, useEffect, useState, Fragment } from 'react';
import io from 'socket.io-client';

import { roomActionTypes, gameActionTypes } from '../../actions/actions';
import {
  getAllRooms,
  removeRoom,
  getRoomById,
  createGame,
  changeRoomStatus,
} from '../../database/crud';
import socketActions from '../../services/socketActions';
import CreateRooms from './CreateRoom/CreateRoom';

import { getOfflineHosts } from '../../services/helpers';
import { RoomsContext } from '../../context/storeContext';

import styles from './Rooms.module.scss';

const Rooms = ({ socket, sockets }) => {
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
    getAllRooms(data => {
      dispatch({ type: 'SET-ALL-ROOMS', payload: data });
    });
  }, []);

  // useEffect(() => {
  //   socket.on(socketActions.CREATE_ROOM_HANDLER, () => {
  //     // getAllRooms();
  //   });
  // }, []);

  useEffect(() => {
    socket.on('DELETE-ROOM', sockets => {
      removeRoom(sockets, state.rooms);
    });
  }, [sockets]);

  useEffect(() => {
    socket.on('removeRoom', data => {
      data.rooms.splice(data.roomIndex, 1);
      dispatch({ type: 'REMOVE-ROOM', payload: data.rooms });
    });
  }, []);

  const onClickHandler = id => {
    setRoomToJoin(id);
    setShowNameInput(true);
    changeRoomStatus('ACTIVE', id);
  };

  const joinRoom = () => {
    getRoomById(roomToJoin, ({ roomId, roomName, hostName, hostId }) => {
      const key = createGame({
        roomId: roomId,
        roomName: roomName,
        playerOneId: hostId,
        playerOneName: hostName,
        playerTwoId: socket.id,
        playerTwoName: playerTwoInput,
      });
      setShowNameInput(false);
      setShowSelf(false);

      socket.emit('GAME-CREATED', { roomName, gameId: key });
    });
  };

  return (
    <>
      {showSelf && (
        <>
          {!showNameInput && <CreateRooms socket={socket} />}

          <div className={styles.rooms}>
            {showNameInput && (
              <div>
                <input
                  type="text"
                  placeholder="Your name"
                  onChange={e => setPlayerTwoInput(e.target.value)}
                />
                <button onClick={joinRoom}>lets go!</button>
              </div>
            )}
            {!showNameInput &&
              state.rooms &&
              state.rooms.map((room, i) => {
                if (room.hostId === socket.id) {
                  return;
                }
                return (
                  <Fragment key={`${Math.random()}-${i}`}>
                    {!showNameInput && (
                      <div>
                        <div
                          onClick={
                            room.status !== 'ACTIVE'
                              ? () => onClickHandler(room.firebaseId)
                              : null
                          }
                        >
                          <span
                            className={
                              room.status === 'ACTIVE'
                                ? styles.active
                                : styles.available
                            }
                          >
                            {room.roomName} - {room.hostName} {room.hostId}
                          </span>
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default Rooms;
