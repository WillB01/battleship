import React, { useContext, useState } from 'react';

import { roomActionTypes, gameActionTypes } from '../../actions/actions';
import { RoomsContext, GameContext } from '../../context/storeContext';
import socketActions from '../../server/socketActions';

const CreateRooms = ({ socket }) => {
  const { state: rState } = useContext(RoomsContext);
  const { state, dispatch } = useContext(GameContext);
  const [inputText, setInputText] = useState('');

  const onClickHandler = () => {
    const updateRooms = [...rState.rooms];

    for (const key in updateRooms) {
      if (updateRooms[key].name === inputText) {
        return alert('NO');
      }
    }

    dispatch({
      type: gameActionTypes.SET_PLAYER_ONE,
      payload: {
        id: socket.id,
        roomName: inputText,
        playerName: 'willy',
      },
    });

    socket.emit(socketActions.CREATE_ROOM, {
      roomName: inputText,
      rooms: updateRooms,
      id: socket.id,
    });
  };

  return (
    <>
      <button onClick={onClickHandler}>Host game</button>
      <input
        type="text"
        placeholder="game name"
        onChange={e => setInputText(e.target.value)}
      />
    </>
  );
};

export default CreateRooms;
