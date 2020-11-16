import { gameActionTypes } from '../actions/actions';
import {
  boardBlueprint,
  privateBoardTemp,
  shipSizes,
} from '../services/boardBlueprint';
import { updateShipLocation } from '../database/crud';

export const hostInitialState = {
  connectedUsers: [],
  games: [],
  user: { id: '', status: 'INACTIVE', gameId: '', host: false },
};

export const hostReducer = (state, action) => {
  switch (action.type) {
    case 'SET-CONNECTED-USERS': {
      return {
        ...state,
        connectedUsers: action.payload,
      };
    }
    case 'SET-NEW-USER': {
      return {
        ...state,
        user: action.payload,
      };
    }
    case 'SET-GAMES': {
      return {
        ...state,
        games: action.payload,
      };
    }

    case 'REMOVE-GAME': {
      const games = [...state.games];
      games.splice(action.payload, 1);
      return {
        ...state,
        games: games,
      };
    }

    case 'SET-USER-STATUS': {
      return {
        ...state,
        user: {
          ...state.user,
          status: action.payload,
        },
      };
    }

    default:
      return state;
  }
};
