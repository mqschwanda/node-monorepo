import React from 'react';
import firebase from 'firebase';
import 'firebase/firestore'; // Required for side-effects

/**
 * pass the config object through the node env or create a firebase.config file
 * that exports the config object
 */
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
      users: [{
        email: 'test.user@gmail.com',
        password: 'password',
      }]
    },
  };
};
global.initFirebase = initFirebase;

export const killFirebase = (app) => {
  app.database().goOffline();
  app.delete();
};
global.killFirebase = killFirebase;

export const containerFactory = ({ container, query: _query, collection, doc }) =>
  ({ options = {} } = {}) => {
    const query = _query ? _query({ collection, doc }) : null;
    const SubComponent = props => <div />;
    const args = query ? [query, options] : [options];
    const WrappedComponent = container(...args)(SubComponent);

    return { collection, doc, query, SubComponent, WrappedComponent };
  };
global.containerFactory = containerFactory;

export default firebase;
global.firebase = firebase;
