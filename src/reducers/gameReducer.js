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
  switch (action.type) {
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
      return {
        ...action.payload.state,
      };
    }
    default:
      return state;
  }
};
