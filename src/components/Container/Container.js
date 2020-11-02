import React, { useContext, useState, useEffect } from 'react';
import Game from '../Game/Game';
import Rooms from '../Rooms/Rooms';
import CreateRooms from '../Rooms/CreateRoom/CreateRoom';
import Chat from '../Chat/Chat';
import axios from 'axios';
import Firebase from 'firebase';

import { GameContext, RoomsContext } from '../../context/storeContext';

const Container = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);
  const { rState, rDispatch } = useContext(GameContext);

  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    socket.on('getConnectedSockets', sockets => {
      const ref = Firebase.database().ref('/');

      ref.on('value', snapshot => {
        console.log(snapshot.val());
      });
      setConnectedUsers(sockets);
    });
  }, []);

  return (
    <>
      {!state.game.playerTwo.id && !state.game.playerTwo.id && (
        <div>
          online: {connectedUsers - 1 === 0 ? 0 : connectedUsers - 1} other
          players
        </div>
      )}
      {!state.game.playerTwo.id && <CreateRooms socket={socket} />}
      {!state.game.playerOne.id && <Rooms socket={socket} />}
      <Game socket={socket} />
      {state.game.playerTwo.id !== '' && (
        <Chat
          socket={socket}
          type={state.game.playerTwo.id === '' ? 'public' : 'private'}
          gameName={state.game.name}
        />
      )}
    </>
  );
};

export default Container;
