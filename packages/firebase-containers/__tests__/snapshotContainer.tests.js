import React from 'react';
import firebase, { initFirebase, killFirebase } from './helpers/firebase';
import { shallow } from './helpers/enzyme';
import { snapshotContainer } from '../dist';

let app, seeder;

describe('firestore', () => {
  beforeAll(() => {
    ({ app, seeder } = initFirebase());
  });

  afterAll(() => {
    killFirebase(app);
  });

  describe('snapshotContainer', () => {
    it('should inject snapshot into props', async (done) => {

      const collection = 'cities';
      const doc = 'SF';
      const query = firebase.firestore().collection(collection).doc(doc);

      const container = snapshotContainer(query);
      const Component = container(props => <div />);
      const test = shallow(<Component />);


      setTimeout(function () {
        const snapshot = test.prop('snapshot');

        expect(snapshot).toBeDefined();
        expect(snapshot.id).toEqual(doc);
        expect(snapshot.data()).toEqual(seeder[collection][doc]);

        done();
      }, 1000);
    });
  });
});
