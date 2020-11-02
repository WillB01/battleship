import React, { useEffect, useRef, useState } from 'react';

import io from 'socket.io-client';

import './App.scss';
import { GameContext, RoomsContext } from './context/storeContext';
import { gameReducer, initialState } from './reducers/gameReducer';
import { roomReducer, roomInitialState } from './reducers/roomsReducer.js';

import Container from './components/Container/Container';

import { port } from './server/port';

const { useContext, useReducer } = React;

const socket = io.connect(port);

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [roomState, roomDispatch] = useReducer(roomReducer, roomInitialState);

  useEffect(() => {
    console.log('init app');
    console.log(process.env.REACT_APP_API_KEY);
    console.log(process.env.REACT_APP_URL);

    // getAllRooms(data => {
    //   console.log(data);
    //   // dispatch({ type: 'SET-ALL-ROOM', acion: data });
    // });
  }, []);

  return (
    <div className="App">
      <GameContext.Provider value={{ state, dispatch }}>
        <RoomsContext.Provider
          value={{ state: roomState, dispatch: roomDispatch }}
        >
          <Container socket={socket} />
        </RoomsContext.Provider>
      </GameContext.Provider>
    </div>
  );
};

export default App;
