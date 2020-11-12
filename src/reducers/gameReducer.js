import { gameActionTypes } from '../actions/actions';
import { boardBlueprint } from '../services/boardBlueprint';
import { updateShipLocation } from '../database/crud';

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
  currentGame: { status: 'INACTIVE' },
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

    case 'ATTACK-PLAYER': {
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          game: action.payload.game,
        },
      };
    }
    case 'SET-CURRENT-GAME': {
      return {
        ...state,
        currentGame: action.payload,
      };
    }

    case 'ADD-SHIP-LOCATION': {
      const { currentGame, shipLocation, player } = action.payload;

      const updateCurrentGame = { ...currentGame };
      updateCurrentGame.game[player].shipLocation.push(shipLocation);

      return {
        ...state,
        currentGame: currentGame,
      };
    }
    default:
      return state;
  }
};
