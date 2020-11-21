import { gameActionTypes } from '../actions/actions';
import {
  privateBoardTemp,
  boardBlueprint,
  shipSizes,
} from '../services/boardBlueprint';
import { updateShipLocation } from '../database/crud';
import { inititalActiveGame } from '../constants/constants';

export const initialState = {
  game: {
    ...inititalActiveGame,
  },
  attackBoard: {
    board: [...boardBlueprint],
  },
  privateBoard: {
    board: [...privateBoardTemp],
    ships: [],
    isAllDropped: false,
  },
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      return {
        ...state,
        game: action.payload,
      };
    }

    case 'SET-WINNER': {
      return {
        ...state,
        game: {
          ...state.game,
          winner: action.payload.player,
        },
      };
    }

    case 'ADD-SHIPS-TO-ATTACK-BOARD': {
      return {
        ...state,
        attackBoard: {
          ...state.attackBoard,
          board: action.payload.attackBoard,
        },
      };
    }

    case 'ATTACK-PLAYER': {
      return {
        ...state,
        game: action.payload,
      };
    }

    case 'UPDATE-ATTACK-BOARD': {
      return {
        ...state,
        attackBoard: {
          ...state.attackBoard,
          board: action.payload.attackBoard,
        },
        game: action.payload.updateGame,
      };
    }

    case 'UPDATE-PRIVATE-BOARD': {
      return {
        ...state,
        privateBoard: {
          ...state.privateBoard,
          board: action.payload.board,
        },
        game: action.payload.game || state.game,
      };
    }

    ///////////////////////
    // PRIVATE BOARD /////
    /////////////////////

    case 'ADD-SHIP-LOCATION': {
      return {
        ...state,
        game: action.payload,
      };
    }

    case 'SET-ALL-SHIPS-IS-DROPPED': {
      return {
        ...state,
        privateBoard: {
          ...state.privateBoard,
          isAllDropped: true,
        },
      };
    }

    case 'RESET-PRIVATE-BOARD': {
      const updateCurrentGame = { ...state.game };
      updateCurrentGame[action.payload].shipLocation = [
        { x: '', y: '', id: '', size: '' },
      ];

      const updateShips = [];
      shipSizes.map((size, i) => {
        updateShips.push({
          id: i,
          size: size,
          dropped: false,
          hide: false,
          x: undefined,
          y: undefined,
        });
      });

      return {
        ...state,
        game: state.game,
        privateBoard: {
          ...state.privateBoard,
          isAllDropped: false,
          ships: updateShips,
        },
      };
    }

    case 'SET-SHIPS': {
      const updateShips = [];
      shipSizes.map((size, i) => {
        updateShips.push({
          id: i,
          size: size,
          dropped: false,
          hide: false,
          x: undefined,
          y: undefined,
        });
      });

      return {
        ...state,
        privateBoard: {
          ...state.privateBoard,
          ships: updateShips,
        },
      };
    }

    case 'UPDATE-SHIPS': {
      return {
        ...state,
        privateBoard: {
          ...state.privateBoard,
          ships: action.payload,
        },
      };
    }

    ///////////////////////
    // PRIVATE BOARD /////
    /////////////////////

    case 'PLAYER-IS-READY-TO-START': {
      const player = action.payload;
      // const updateCurrentGame = { ...state.game };
      // updateCurrentGame[player].ready = true;

      return {
        ...state,
        game: {
          ...state.game,
          [player]: {
            ...state.game[player],
            ready: true,
          },
        },
      };
    }
    default:
      return state;
  }
};
