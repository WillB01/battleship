import React, { useContext } from 'react';

import { GameContext } from '../../../context/storeContext';

const GameDetails = ({ index }) => {
  const { state } = useContext(GameContext);
  const currentGame = state.games[index];
  return (
    <div>
      <div>{currentGame.name}</div>
      <div>{currentGame.game.playerOne.name}</div>
      <div>{currentGame.game.playerTwo.name}</div>
    </div>
  );
};

export default GameDetails;
