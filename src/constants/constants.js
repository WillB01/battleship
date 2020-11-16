export const inititalActiveGame = {
  id: '',
  name: '',
  status: 'ACTIVE',
  playerTurn: 'PLAYER-ONE',
  playerOne: {
    id: '',
    name: '',
    attackLocation: [{ x: '', y: '' }],
    shipLocation: [{ x: '', y: '', id: '', size: '' }],
    ready: false,
  },
  playerTwo: {
    id: '',
    name: '',
    attackLocation: [{ x: '', y: '' }],
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
