import React from 'react';

import { roomActionTypes } from '../actions/actions';

export const roomInitialState = {
  rooms: [],
};

export const roomReducer = (state, action) => {
  switch (action.type) {
    case roomActionTypes.CREATE_ROOM:
      return {
        ...state,
        rooms: action.payload.rooms,
      };
    case roomActionTypes.OPPONENT_JOINS:
      return {
        ...state,
      };
    case 'REMOVE-ROOM':
      return {
        ...state,
        rooms: action.payload,
      };
    case 'SET-ALL-ROOMS':
      return {
        ...state,
        rooms: action.payload,
      };
    default:
      return state;
  }
};
