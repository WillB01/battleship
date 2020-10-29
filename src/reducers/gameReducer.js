import { gameActionTypes } from '../actions/actions';
import { boardBlueprint } from '../services/boardBlueprint';

export const initialState = {
  board: boardBlueprint,
  game: {
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
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case gameActionTypes.SET_PLAYER_ONE:
      return {
        ...state,
        game: {
          ...state.game,
          playerOne: {
            ...state.game.playerOne,
            id: action.payload.id,
            name: action.payload.playerName,
          },
        },
      };

    case gameActionTypes.SET_PLAYER_TWO:
      return {
        ...state,
        game: {
          ...state.game,
          playerTwo: {
            ...state.playerTwo,
            id: action.payload.id,
            name: action.payload.playerName,
          },
        },
      };
    case 'START-GAME': {
      return {
        ...state,
        game: {
          ...state.game,
          name: action.payload.roomName,
          playerOne: {
            ...state.game.playerOne,
            id: action.payload.playerOneId,
            name: action.payload.playerOneName,
          },
          playerTwo: {
            ...state.game.playerTwo,
            id: action.payload.playerTwoId,
            name: action.payload.playerTwoName,
          },
        },
      };
    }
    default:
      return state;
  }
};
