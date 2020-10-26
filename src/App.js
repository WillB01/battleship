import React from 'react';
import './App.css';

import { PlayerBoardContext } from './context/storeContext';
import {
  playerBoardReducer,
  initialState,
} from './reducers/playerBoardReducer.js';
import Game from './components/Game/Game';
const { useContext, useReducer } = React;

const App = () => {
  const [state, dispatch] = useReducer(playerBoardReducer, initialState);

  return (
    <div className='App'>
      <PlayerBoardContext.Provider value={{ state, dispatch }}>
        <Game />
      </PlayerBoardContext.Provider>
    </div>
  );
};

export default App;
