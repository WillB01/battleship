import React, { useEffect, useContext, useState } from 'react';
import styles from './GameList.module.scss';

import { GiBattleship } from 'react-icons/gi';
import { DiYeoman } from 'react-icons/di';

import {
  removeGameById,
  gamesRef,
  fetchGames,
  fetchGameById,
} from '../../database/crud';
import { isUserOnline } from '../../services/helpers';
import { GameContext } from '../../context/storeContext';

import { Loading } from '../ui/Loading/Loading';
import img from '../../assets/img/war-ship-2.jpg';

const GamesList = ({ socket }) => {
  const {
    state: { games, connectedUsers },
    dispatch,
  } = useContext(GameContext);

  const [isLoading, setIsLoading] = useState(false);

  // Delete games with offline host
  useEffect(() => {
    if (games.length === 0) {
      return;
    }
    games.map((game, i) => {
      if (!isUserOnline(game.game.playerOne.id, connectedUsers)) {
        removeGameById(game.id)
          .then(() => {
            dispatch({ type: 'REMOVE-GAME', payload: i });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
    return () => gamesRef.off('child_removed');
  }, [connectedUsers]);

  // Game hosted / created
  useEffect(() => {
    socket.on('GAME-HOSTED-HANDLER', game => {
      dispatch({ type: 'ADD-TO-GAMES', payload: game });
    });
  }, [socket.on]);

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
        dispatch({ type: 'SET-GAMES', payload: games });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  }, []);

  // uppdate games if player two disconnects from player two from / awaiting player
  useEffect(() => {
    socket.on('UPDATE-GAME-LIST-HANDLER', () => {
      fetchGames()
        .then(snapshot => {
          const games = [];
          snapshot.forEach(child => {
            games.push({ ...child.val(), id: child.key });
          });
          dispatch({ type: 'SET-GAMES', payload: games });
        })
        .catch(err => {
          console.log(err);
        });
    });

    return () => gamesRef.off('value');
  }, [socket.on]);

  // join game and up date db with socket id to player two
  const onCLickHandler = (gameId, playerOneId) => {
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
            'game/playerTwo': {
              id: socket.id,
            },
          },
          onComplate => {
            dispatch({ type: 'SET-USER-STATUS', payload: 'JOINING' });
            socket.emit('JOIN-HOST', playerOneId);
            setIsLoading(false);
          }
        );
      })
      .catch(err => console.log(err));
  };

  const addStyle = (status, playerOneId) => {
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
          {/* <div className={styles.img}></div> */}
          {games.length !== 0 &&
            games.map((game, i) => {
              return (
                <div
                  key={game.id}
                  className={` ${styles.game} ${addStyle(
                    game.status,
                    game.game.playerOne.id
                  )}`}
                >
                  <div className={`${styles.content}`}>
                    <div className={`${styles.content__item}`}>
                      {/* <GiBattleship /> */}
                      {game.name}
                    </div>
                    <div className={styles.line}></div>
                    <div className={`${styles.content__item}`}>
                      {game.game.playerOne.name}
                      {/* <DiYeoman /> */}
                    </div>
                    {game.status === 'HOSTED' && (
                      <button
                        onClick={() =>
                          onCLickHandler(game.id, game.game.playerOne.id)
                        }
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
