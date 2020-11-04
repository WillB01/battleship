import { gameActionTypes } from '../actions/actions';
import { boardBlueprint } from '../services/boardBlueprint';

// export const initialState = {
//   status: '',
//   roomId: '',
//   board: boardBlueprint,
//   game: {
//     name: '',
//     playerTurn: 'PLAYER-ONE',
//     playerOne: {
//       id: '',
//       name: '',
//       attackLocation: [],
//       shipLocation: [{ x: '', y: '' }],
//     },
//     playerTwo: {
//       id: '',
//       name: '',
//       attackLocation: [{ x: '', y: '' }],
//       shipLocation: [{ x: '', y: '' }],
//     },
//   },
// };

export const initialState = {
  connectedUsers: [],
  games: [],
};

export const gameReducer = (state, action) => {
  const { games } = state;

  switch (action.type) {
    case 'UPDATED-SOCKETS': {
      return {
        ...state,
        connectedUsers: action.payload,
      };
    }
    case 'SET-GAMES': {
      return {
        ...state,
        games: action.payload,
      };
    }

    case 'START-GAME': {
      return {
        ...state,
        games: action.payload,
      };
    }
    case 'ATTACK-PLAYER': {
      games[action.payload.index].game = action.payload.game;

      return {
        ...state,
        games: games,
      };
    }
    default:
      return state;
  }
};
