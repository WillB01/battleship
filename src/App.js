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

  const socketRef = useRef();

  useEffect(() => {
    console.log(window.location.hostname);
    const url =
      window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : window.location.hostname;
    socketRef.current = io.connect(url); // proxy fixes this

    socketRef.current.on('your id', (id) => {
      setYourId(id);
    });
  }, []);

  const [state, dispatch] = useReducer(playerBoardReducer, initialState);
  console.log(yourIdD);

  return (
    <div className='App'>
      <PlayerBoardContext.Provider value={{ state, dispatch }}>
        <Game />
      </PlayerBoardContext.Provider>
    </div>
  );
};

export default App;
