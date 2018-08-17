import firebase, { initFirebase, killFirebase } from './helpers/firebase';
import { snapshotContainer } from '../dist';

let app;
const seeder = {
  cities: {
    SF: { name: 'San Francisco' },
    LA: { name: 'Los Angeles' },
  }
};

describe('firebase', () => {
  beforeAll(() => {
    app = initFirebase();
  });

  afterAll(() => {
    killFirebase(app);
  });

  describe('query snapshot', () => {
    it('should get snapshot.data()', async (done) => {
      expect.assertions(1);

      const collection = 'cities';
      const doc = 'SF';
      const query = firebase.firestore().collection(collection).doc(doc);

      await expect(new Promise((resolve) => query.onSnapshot((snapshot) => resolve(snapshot.data())))).resolves.toEqual(seeder[collection][doc]);

      done();
    });
  });
});
