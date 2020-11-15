import React, { useContext } from 'react';

import Heading from '../../Heading/Heading';
import WaitingForPlayer from '../../ui/WaitingForPlayer/WaitingForPlayer';
import PlayerTwoForm from '../../PlayerTwoForm/PlayerTwoForm';
import GamesList from '../../GamesList/GameList';
import CreateGame from '../../CreateGame/CreateGame';

import { HostContext } from '../../../context/storeContext';

const HostContainer = () => {
  const {
    hostState: { user },
  } = useContext(HostContext);

  return (
    <>
      {user.status === 'INACTIVE' && <Heading />}

      {user.status === 'INACTIVE' && <CreateGame />}

      {user.status === 'INACTIVE' && <GamesList />}

      {user.status === 'HOSTED' && <WaitingForPlayer />}

      {user.status === 'JOINING' && <PlayerTwoForm />}
    </>
  );
};

export default HostContainer;
