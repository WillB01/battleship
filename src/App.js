import React, { useEffect, useRef, useState } from 'react';

import io from 'socket.io-client';
import './App.css';
import { PlayerBoardContext } from './context/storeContext';
import {
  playerBoardReducer,
  initialState,
} from './reducers/playerBoardReducer.js';
import Game from './components/Game/Game';
const { useContext, useReducer } = React;

const App = () => {
  const [yourIdD, setYourId] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // sockets test
  const socketRef = useRef();

  useEffect(() => {
    const port =
      window.location.hostname === 'localhost' ? 'http://localhost:3231/' : '/';
    socketRef.current = io.connect(port);

    socketRef.current.on('test', 'bajs anus');

    socketRef.current.on('hello', (id) => {
      console.log(id);
      socketRef.current.on('clickHandler', (data) => {
        setYourId(data);
      });
    });
  }, []);

  const temp = (data) => {
    console.log(data);

    socketRef.current.emit('boardClick', data);
  };

  const [state, dispatch] = useReducer(playerBoardReducer, initialState);
  // console.log(yourIdD);

  return (
    <div className='App'>
      <PlayerBoardContext.Provider value={{ state, dispatch }}>
        <Game temp={temp} />
        {yourIdD}
      </PlayerBoardContext.Provider>
    </div>
  );
};

export default App;
