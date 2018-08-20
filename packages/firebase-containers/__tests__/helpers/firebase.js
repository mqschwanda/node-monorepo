import firebase from 'firebase';
import 'firebase/firestore'; // Required for side-effects
import config from './firebase.config';



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
}

export const killFirebase = (app) => {
  app.database().goOffline();
  app.delete();
};

export default firebase;
