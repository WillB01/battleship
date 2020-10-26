import React from 'react';

import { actionTypes } from '../actions/board';

export const initialState = {
  test: 'NEJ',
};

export const boardReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.TEST:
      return {
        ...state,
        test: action.payload,
      };
    default:
      return state;
  }
};
