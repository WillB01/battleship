import React, { useEffect, useRef, useState, useReducer } from 'react';

import './App.scss';
// import { GameContext, HostContext } from './context/storeContext';
// import { gameReducer, initialState } from './reducers/gameReducer';
// import { hostReducer, hostInitialState } from './reducers/hostReducer';

import MainContainer from './components/Containers/MainContainer/MainContainer';

const App = () => {
  // const [state, dispatch] = useReducer(gameReducer, initialState);
  // const [hostState, hostDispatch] = useReducer(hostReducer, hostInitialState);

  return (
    <div className="App">
      <MainContainer />
    </div>
  );
};

export default App;
