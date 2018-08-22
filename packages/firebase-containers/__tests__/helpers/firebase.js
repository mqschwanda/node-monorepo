import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore'; // Required for side-effects

const config = process.env.FIREBASE_CONFIG
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : require('./firebase.config').default;

export const initFirebase = () => {
  const app = firebase.initializeApp(config);

  firebase.firestore().settings({
    timestampsInSnapshots: true,
  });

  return {
    app,
    seeder: {
      cities: {
        SF: { name: 'San Francisco' },
        LA: { name: 'Los Angeles' },
      },
    },
  };
};
global.initFirebase = initFirebase;

export const killFirebase = (app) => {
  app.database().goOffline();
  app.delete();
};
global.killFirebase = killFirebase;

export const containerFactory = ({ container, query: _query, collection, doc }) => ({ options = {} } = {}) => {
  const query = _query({ collection, doc });

  const SubComponent = props => <div />;
  const WrappedComponent = container(query, options)(SubComponent);

  return { collection, doc, query, SubComponent, WrappedComponent };
};
global.containerFactory = containerFactory;

export default firebase;
global.firebase = firebase;
