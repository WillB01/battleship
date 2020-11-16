import React, { useContext, useState, useEffect, useReducer } from 'react';

import GameContainer from '../GameContainer/GameContainer';
import HostContainer from '../HostContainer/HostContainer';

import { GameContext, HostContext } from '../../../context/storeContext';
import { gameReducer, initialState } from '../../../reducers/gameReducer';
import { hostReducer, hostInitialState } from '../../../reducers/hostReducer';

const MainContainer = ({ socket }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [hostState, hostDispatch] = useReducer(hostReducer, hostInitialState);

  return (
    <>
      <HostContext.Provider value={{ hostState, hostDispatch }}>
        <HostContainer />
      </HostContext.Provider>

      {hostState.user.status === 'ACTIVE' && (
        <GameContext.Provider value={{ state, dispatch }}>
          <GameContainer gameId={hostState.user.gameId} />
        </GameContext.Provider>
      )}
    </>
  );
};

export default MainContainer;
