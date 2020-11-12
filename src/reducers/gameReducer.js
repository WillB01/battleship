import { gameActionTypes } from '../actions/actions';
import {
  boardBlueprint,
  privateBoardTemp,
  shipSizes,
} from '../services/boardBlueprint';
import { updateShipLocation } from '../database/crud';

export const initialState = {
  connectedUsers: [],
  games: [],
  currentGame: { status: 'INACTIVE' },
  privateBoard: {
    board: [...privateBoardTemp],
    ships: [],
    isAllDropped: false,
  },
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
          game: action.payload,
        },
      };
    }
    case 'SET-CURRENT-GAME': {
      return {
        ...state,
        currentGame: action.payload,
      };
    }

    ///////////////////////
    // PRIVATE BOARD /////
    /////////////////////

    case 'ADD-SHIP-LOCATION': {
      const { currentGame, shipLocation, player } = action.payload;

      const updateCurrentGame = { ...currentGame };
      updateCurrentGame.game[player].shipLocation.push(shipLocation);

      if (updateCurrentGame.game[player].shipLocation.length === 6) {
        updateCurrentGame.game[player].shipLocation.shift();
      }

      return {
        ...state,
        currentGame: currentGame,
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
      const updateCurrentGame = { ...state.currentGame };
      updateCurrentGame.game[action.payload].shipLocation = [
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
        currentGame: updateCurrentGame,
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
      const updateCurrentGame = { ...state.currentGame };
      updateCurrentGame.game[player].ready = true;

      return {
        ...state,
        currentGame: updateCurrentGame,
      };
    }
    default:
      return state;
  }
};
