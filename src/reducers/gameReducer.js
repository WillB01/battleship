import React from 'react';

import { gameActionTypes } from '../actions/actions';
import { boardBlueprint } from '../services/boardBlueprint';

export const initialState = {
  board: boardBlueprint,
  game: [
    {
      name: '',
      playerOne: {
        id: '',
        name: '',
        attackLocation: [{ x: '', y: '' }],
      },
      playerTwo: {
        id: '',
        name: '',
        attackLocation: [{ x: '', y: '' }],
      },
    },
  ],
};

const setPlayer = (state, action) => {
  let updateGame = [...state.game];
  let keyIndex = 0;

  for (const key in updateGame) {
    if (updateGame[key].name === action.payload.roomName) {
      keyIndex = key;
      break;
    }
  }

  if (action.type === gameActionTypes.SET_PLAYER_ONE) {
    console.log('TESTTTT');
    if (updateGame[0].name === '') {
      updateGame[0] = {
        name: action.payload.roomName,
        playerOne: {
          ...state.game[keyIndex].playerOne,
          id: action.payload.id,
          name: action.payload.playerName,
        },
        playerTwo: {
          ...state.game[keyIndex].playerTwo,
        },
      };
    } else {
      updateGame.push({
        name: action.payload.roomName,
        playerOne: {
          ...state.game[keyIndex].playerOne,
          id: action.payload.id,
          name: action.payload.playerName,
        },
        playerTwo: {
          ...state.game[keyIndex].playerTwo,
        },
      });
    }
  }

  if (action.type === gameActionTypes.SET_PLAYER_TWO) {
    updateGame[keyIndex].playerTwo = {
      ...state.game[keyIndex].playerTwo,
      id: action.payload.id,
      name: action.payload.playerName,
    };
  }

  return updateGame;
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case gameActionTypes.SET_PLAYER_ONE:
      const updatedGame = setPlayer(state, action);
      return {
        ...state,
        game: updatedGame,
      };

    case gameActionTypes.SET_PLAYER_TWO:
      const updatedGameTwo = setPlayer(state, action);
      console.log('HELLO');
      return {
        ...state,
        game: updatedGameTwo,
      };
    default:
      return state;
  }
};
