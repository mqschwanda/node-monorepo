import React from 'react';
import firebase, { initFirebase, killFirebase } from './helpers/firebase';
import { shallow } from './helpers/enzyme';
import { referenceContainer } from '../dist';

let app, seeder;

describe('firebase', () => {
  beforeAll(() => {
    ({ app, seeder } = initFirebase());
  });

  afterAll(() => {
    killFirebase(app);
  });

  describe('referenceContainer', () => {
    it('should inject snapshot into props', async (done) => {

      const collection = 'cities';
      const doc = 'SF';
      const query = firebase.database().ref(`${collection}/${doc}`);

      const container = referenceContainer(query);
      const Component = container(props => <div />);
      const test = shallow(<Component />);

      setTimeout(function () {
        const snapshot = test.prop('snapshot');

        expect(snapshot).toBeDefined();
        expect(snapshot.key).toEqual(doc);
        expect(snapshot.val()).toEqual(seeder[collection][doc]);

        done();
      }, 1000);
    });
  });
});
