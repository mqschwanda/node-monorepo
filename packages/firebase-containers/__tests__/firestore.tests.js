import firebase, { initFirebase, killFirebase } from './helpers/firebase';

let app, seeder;

describe('firebase', () => {
  beforeAll(() => {
    ({ app, seeder } = initFirebase());
  });

  afterAll(() => {
    killFirebase(app);
  });

  describe('firestore', () => {
    it('should connect', async (done) => {
      const { firestore } = firebase.firestore()._config.firebaseApp.services_;

      expect(firestore).toBeDefined();
      done();
    });
  });

  // describe('firestore', () => {
  //   it('should connect', async (done) => {
  //     const { firestore } = firebase.firestore()._config.firebaseApp.services_;
  //
  //     expect(firestore).toBeDefined();
  //     done();
  //   });
  // });
});
