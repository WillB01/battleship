import React, { useContext, useState } from 'react';

import { roomActionTypes } from '../../actions/actions';
import { RoomsContext } from '../../context/storeContext';

const CreateRooms = ({ socket }) => {
  const { state, dispatch } = useContext(RoomsContext);
  const [inputText, setInputText] = useState('');

  const onClickHandler = () => {
    const updateRooms = [...state.rooms];
    socket.emit('createRoom', {
      roomName: inputText,
      rooms: updateRooms,
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
