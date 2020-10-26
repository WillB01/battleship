import React from 'react';

import { actionTypes } from '../actions/board';
import { boardBlueprint } from '../services/boardBlueprint';

export const initialState = {
  board: boardBlueprint,
};

export const playerBoardReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TEST:
      return {
        ...state,
        board: action.payload,
      };
    default:
      return state;
  }
};
