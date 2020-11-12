import React, { useEffect, useRef, useState, useReducer } from 'react';

import io from 'socket.io-client';

import './App.scss';
import { GameContext } from './context/storeContext';
import { gameReducer, initialState } from './reducers/gameReducer';
import { updateSockets } from './database/crud';

import MainContainer from './components/Containers/MainContainer/MainContainer';

import { port } from './server/port';

const socket = io.connect(port);

const App = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <div className="App">
      <GameContext.Provider value={{ state, dispatch }}>
        <MainContainer socket={socket} />
      </GameContext.Provider>
    </div>
  );
};

export default App;
