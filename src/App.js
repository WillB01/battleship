import React, { useEffect, useRef, useState } from 'react';

import io from 'socket.io-client';
import './App.css';
import { PlayerBoardContext, RoomsContext } from './context/storeContext';
import {
  playerBoardReducer,
  initialState,
} from './reducers/playerBoardReducer.js';
import { roomReducer, roomInitialState } from './reducers/roomsReducer.js';
import Game from './components/Game/Game';
import { port } from './server/port';

const { useContext, useReducer } = React;

const socket = io.connect(port);

const App = () => {
  const [yourIdD, setYourId] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // sockets test

  useEffect(() => {
    socket.on('test', 'bajs anus');

    socket.on('hello', id => {
      console.log(id);
      socket.on('clickHandler', data => {
        setYourId(data);
      });
    });
  }, []);

  const temp = data => {
    console.log(data);

    socket.emit('boardClick', data);
  };

  const [state, dispatch] = useReducer(playerBoardReducer, initialState);
  const [roomState, roomDispatch] = useReducer(roomReducer, roomInitialState);
  // console.log(yourIdD);

  console.log('socket', socket);

  return (
    <div className="App">
      <RoomsContext.Provider
        value={{ state: roomState, dispatch: roomDispatch }}
      >
        <PlayerBoardContext.Provider value={{ state, dispatch }}>
          <Game temp={temp} socket={socket} />
          {yourIdD}
        </PlayerBoardContext.Provider>
      </RoomsContext.Provider>
    </div>
  );
};

export default App;
