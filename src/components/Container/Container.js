import React, { useContext, useState, useEffect } from 'react';
import Game from '../Game/Game';
import Rooms from '../Rooms/Rooms';
import CreateRooms from '../Rooms/CreateRoom';

import { GameContext, RoomsContext } from '../../context/storeContext';

const Container = ({ socket }) => {
  const { state, dispatch } = useContext(GameContext);
  const { rState, rDispatch } = useContext(GameContext);

  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {
    socket.on('getConnectedSockets', sockets => {
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
    </>
  );
};

export default Container;
