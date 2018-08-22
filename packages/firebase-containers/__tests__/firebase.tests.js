/**
 * [NOTE]: If these test are throwing errors make sure either
 * `process.env.FIREBASE_CONFIG` is set, or `firebase.config.js` exports the
 * config object.
 */

import './helpers/firebase';

describe('firebase', () => {
  let app;

  beforeAll(() => {
    ({ app } = initFirebase());
  });

  afterAll(() => {
    killFirebase(app);
  });

  describe('firestore', () => {
    it('should configure service', (done) => {
      const { firestore } = firebase.firestore()._config.firebaseApp.services_;
      expect(firestore).toBeDefined();

      done();
    });
  });

  describe('database', () => {
    it('should configure service', (done) => {
      const { database } = firebase.database().repo_.app.services_;
      expect(database).toBeDefined();

      done();
    });
  });
});
