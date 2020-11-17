import {
  privateBoardTemp,
  boardBlueprint,
  shipSizes,
} from '../services/boardBlueprint';

export const inititalActiveGame = {
  id: '',
  name: '',
  status: 'ACTIVE',
  playerTurn: 'PLAYER-ONE',
  winner: '',
  playerOne: {
    id: '',
    name: '',
    attackLocation: [{ x: '', y: '', shipSize: '', shipId: '' }],
    shipLocation: [{ x: '', y: '', id: '', size: '' }],
    ready: false,
  },
  playerTwo: {
    id: '',
    name: '',
    attackLocation: [{ x: '', y: '', shipSize: '', shipId: '' }],
    shipLocation: [{ x: '', y: '', id: '', size: '' }],
    ready: false,
  },
};

export const initialHostGame = {
  id: '',
  status: '',
  name: '',
  host: {
    id: '',
    status: '',
    name: '',
  },
  player: {
    id: '',
    status: '',
    name: '',
  },
};
