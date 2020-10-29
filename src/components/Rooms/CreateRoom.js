import React, { useContext, useState } from 'react';

import { roomActionTypes, gameActionTypes } from '../../actions/actions';
import { RoomsContext, GameContext } from '../../context/storeContext';
import socketActions from '../../services/socketActions';

const CreateRooms = ({ socket }) => {
  const { state: rState } = useContext(RoomsContext);
  const { state, dispatch } = useContext(GameContext);
  const [roomText, setRoomText] = useState('');
  const [nicknameText, setNicknameText] = useState('');

  const onClickHandler = () => {
    const updateRooms = [...rState.rooms];

    for (const key in updateRooms) {
      if (updateRooms[key].name === roomText) {
        return alert('NO');
      }
    }

    // TODO validation
    if (roomText === '' || nicknameText === '') {
      return;
    }

    dispatch({
      type: gameActionTypes.SET_PLAYER_ONE,
      payload: {
        id: socket.id,
        roomName: roomText,
        playerName: nicknameText,
      },
    });

    socket.emit(socketActions.CREATE_ROOM, {
      roomName: roomText,
      rooms: updateRooms,
      id: socket.id,
      hostName: nicknameText,
    });
  };

  return (
    <>
      <button onClick={onClickHandler}>Host game</button>
      <input
        type="text"
        placeholder="game name"
        onChange={e => setRoomText(e.target.value)}
      />
      <input
        type="text"
        placeholder="nick-name"
        onChange={e => setNicknameText(e.target.value)}
      />
    </>
  );
};

export default CreateRooms;
