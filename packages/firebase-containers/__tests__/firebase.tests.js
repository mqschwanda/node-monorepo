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
    it('should connect', (done) => {
      const { firestore } = firebase.firestore()._config.firebaseApp.services_;
      expect(firestore).toBeDefined();

      done();
    });
  });

  describe('database', () => {
    it('should connect', (done) => {
      const { database } = firebase.database().repo_.app.services_;
      expect(database).toBeDefined();

      done();
    });
  });
});
