import React, { useContext, useState, useEffect } from 'react';
import { addNewRoom } from '../../../database/crud';

import { roomActionTypes, gameActionTypes } from '../../../actions/actions';
import { RoomsContext, GameContext } from '../../../context/storeContext';
import socketActions from '../../../services/socketActions';
import useInput from '../../shared/useInput';

import styles from './CreateRoom.module.scss';

const CreateRooms = ({ socket }) => {
  const { state: rState } = useContext(RoomsContext);
  const { state, dispatch } = useContext(GameContext);
  const [roomText, setRoomText] = useState('');
  const [nicknameText, setNicknameText] = useState('');
  const [showLabel, setShowLabel] = useState([false, false]);
  const [showSelf, setShowSelf] = useState(true);

  useEffect(() => {
    socket.on(socketActions.WAITING_FOR_PLAYER_TWO, () => {
      setShowSelf(false);
    });
  }, []);

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

    addNewRoom(socket.id, nicknameText, roomText, err => {
      if (err) {
      } else {
        setShowSelf(false);
        socket.emit(socketActions.CREATE_ROOM, {
          roomName: roomText,
          rooms: updateRooms,
          id: socket.id,
        });
      }
    });
  };

  const onChangeHandler = (value, labelIndex) => {
    if (labelIndex === 0) {
      setRoomText(value);
    } else {
      setNicknameText(value);
    }

    showLabel[labelIndex] = true;
    if (value === '') {
      showLabel[labelIndex] = false;
    }
  };

  const useGameInput = useInput(
    onClickHandler,
    onChangeHandler,
    roomText,
    'Game name',
    0
  );

  const useNameInput = useInput(
    onClickHandler,
    onChangeHandler,
    nicknameText,
    'Your name',
    1
  );

  return (
    <>
      {showSelf && (
        <div className={`${styles.createRoom} ${showLabel}`}>
          <div className={styles.createRoom__item}>
            {useGameInput}
            {showLabel[0] && <div className={styles.label}>Game name:</div>}
          </div>
          <div className={styles.createRoom__item}>
            {useNameInput}
            {showLabel[1] && <div className={styles.label}>Your name:</div>}
          </div>

          <button onClick={onClickHandler}>Host game</button>
        </div>
      )}
    </>
  );
};

export default CreateRooms;
