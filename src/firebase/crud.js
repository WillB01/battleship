import React from 'react';
import config from '../config';

import firebase from 'firebase';

firebase.initializeApp(config);

export const addNewRoom = (hostId, hostName, roomName, cb) => {
  firebase.database().ref('/rooms').push(
    {
      hostId,
      hostName,
      roomName,
    },
    cb()
  );
};

export const getAllRooms = cb => {
  const ref = firebase.database().ref('/rooms');

  if (cb) {
    ref.on('value', snapshot => {
      const data = [];
      snapshot.forEach((child, i) => {
        data.push({ ...child.val(), firebaseId: child.key });
      });
      cb(data);
    });
  }
};
