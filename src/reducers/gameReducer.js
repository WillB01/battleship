import { gameActionTypes } from '../actions/actions';
import { boardBlueprint } from '../services/boardBlueprint';

export const initialState = {
  board: boardBlueprint,
  game: {
    name: '',
    playerTurn: 'PLAYER-ONE',
    playerOne: {
      id: '',
      name: '',
      attackLocation: [],
      shipLocation: [{ x: '', y: '' }],
    },
    playerTwo: {
      id: '',
      name: '',
      attackLocation: [{ x: '', y: '' }],
      shipLocation: [{ x: '', y: '' }],
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

    case 'START-GAME': {
      return {
        ...action.payload,
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
