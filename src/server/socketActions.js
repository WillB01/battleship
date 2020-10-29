const socketActions = {
  CREATE_ROOM: 'CREATE-ROOM',
  CREATE_ROOM_HANDLER: 'CREATE-ROOM-HANDLER',
  JOIN_ROOM: 'JOIN-ROOM',
  JOIN_ROOM_HANDLER: 'JOIN-ROOM-HANDLER',
  WAITING_FOR_PLAYER_TWO: 'WAIT-FOR-PLAYER-TWO',
  ATTACK_SHIP: 'ATTACK-SHIP',
  ATTACK_SHIP_HANDLER: 'ATTACK-SHIP-HANDLER',
};

module.exports = {
  ...socketActions,
};
