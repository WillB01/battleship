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

  const socket = io();

  // sockets test

  //  const socketRef = useRef();

  useEffect(() => {
    socket.on('hello', ({ message }) => alert(message));
    // const url =
    //   window.location.hostname === 'localhost' ? 'http://localhost:8000' : '/';
    // socketRef.current = io.connect(); // proxy fixes this

    // socketRef.current =

    // socketRef.current.on('your id', (id) => {
    //   setYourId(id);
    // });
  }, []);

  const [state, dispatch] = useReducer(playerBoardReducer, initialState);
  // console.log(yourIdD);

  return (
    <div className='App'>
      <PlayerBoardContext.Provider value={{ state, dispatch }}>
        <Game />
      </PlayerBoardContext.Provider>
    </div>
  );
};

export default App;
