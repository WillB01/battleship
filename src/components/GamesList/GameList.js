import React, { useEffect, useContext, useState } from 'react';
import styles from './GameList.module.scss';

import { isUserOnline } from '../../services/helpers';
import { HostContext } from '../../context/storeContext';
import { Loading } from '../ui/Loading/Loading';
import { socket } from '../../server/socket';

import {
  removeGameById,
  gamesRef,
  fetchGames,
  fetchGameById,
} from '../../database/crud';

const GamesList = () => {
  const {
    hostState: { games, connectedUsers },
    hostDispatch,
  } = useContext(HostContext);

  const [isLoading, setIsLoading] = useState(false);

  // Delete games with offline host
  useEffect(() => {
    if (games.length === 0) {
      return;
    }
    games.map((game, i) => {
      if (!isUserOnline(game.host.id, connectedUsers)) {
        removeGameById(game.id)
          .then(() => {
            hostDispatch({ type: 'REMOVE-GAME', payload: i });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
    return () => gamesRef.off('child_removed');
  }, [connectedUsers]);

  // Game hosted / created

  // initaial setstate for gamelist
  useEffect(() => {
    setIsLoading(true);
    fetchGames()
      .then(snapshot => {
        const games = [];
        snapshot.forEach(child => {
          games.push({ ...child.val(), id: child.key });
        });
        setIsLoading(false);
        hostDispatch({ type: 'SET-GAMES', payload: games });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  // uppdate games if player two disconnects from player two from / awaiting player
  useEffect(() => {
    socket.on('UPDATE-GAME-LIST-HANDLER', (gameId, socketId) => {
      fetchGames()
        .then(snapshot => {
          const games = [];
          snapshot.forEach(child => {
            games.push({ ...child.val(), id: child.key });
          });
          hostDispatch({ type: 'SET-GAMES', payload: games });
        })
        .catch(err => {
          console.log(err);
        });
    });
    return () => socket.off('UPDATE-GAME-LIST-HANDLER');
  }, [socket.on]);

  // join game and up date db with socket id to player two
  const onCLickHandler = (gameId, hostId) => {
    setIsLoading(true);

    fetchGameById(gameId)
      .then(snapshot => {
        if (!snapshot.exists()) {
          console.log('error');
          setIsLoading(false);
          return;
        }
        snapshot.ref.update(
          {
            status: 'PLAYER-TWO-JOINING',
            player: {
              ...snapshot.val().player,
              status: 'JOINING',
              id: socket.id,
            },
          },
          onComplate => {
            hostDispatch({
              type: 'SET-NEW-USER',
              payload: {
                id: socket.id,
                status: 'JOINING',
                gameId: gameId,
                host: false,
              },
            });
            console.log(hostId);
            socket.emit('JOIN-HOST', hostId);
          }
        );
      })
      .catch(err => console.log(err));
  };

  const addStyle = status => {
    if (status === 'HOSTED') {
      return styles.hosted;
    }
    if (status === 'ACTIVE') {
      return styles.active;
    }

    if (status === 'PLAYER-TWO-JOINING') {
      return styles.unavailable;
    }

    return '';
  };

  return (
    <>
      {isLoading ? (
        <Loading>searching games</Loading>
      ) : (
        <div className={styles.gameList}>
          {games.length !== 0 &&
            games.map((game, i) => {
              return (
                <div
                  key={game.id}
                  className={` ${styles.game} ${addStyle(
                    game.status,
                    game.host.id
                  )}`}
                >
                  <div className={`${styles.content}`}>
                    <div className={`${styles.content__item}`}>{game.name}</div>
                    <div className={styles.line}></div>
                    <div className={`${styles.content__item}`}>
                      {game.host.name}
                    </div>
                    {game.status === 'HOSTED' && (
                      <button
                        onClick={() => onCLickHandler(game.id, game.host.id)}
                      >
                        join game
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default GamesList;
