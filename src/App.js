import React from 'react';
import './App.css';

import { BoardContext } from './context/storeContext';
import { boardReducer, initialState } from './reducers/boardReducer.js';
import Game from './components/Game/Game';
const { useContext, useReducer } = React;

const App = () => {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <div className='App'>
      <BoardContext.Provider value={{ state, dispatch }}>
        <Game />
      </BoardContext.Provider>
    </div>
  );
};

export default App;
