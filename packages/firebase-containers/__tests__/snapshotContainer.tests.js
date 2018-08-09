import firebase from 'firebase';
import 'firebase/firestore'; // Required for side-effects
// import { firebase as config } from '../../config/settings';

import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { snapshotContainer, mapDocSnapshot, mapQuerySnapshot } from '../dist';

// firebase.initializeApp({
//   apiKey: 'AIzaSyAEN41LOwUvWk5GnuDe9aOiIk8wbXu8OHk',
//   authDomain: 'mqs-survey-app.firebaseapp.com',
//   databaseURL: 'https://mqs-survey-app.firebaseio.com',
//   projectId: 'mqs-survey-app',
//   storageBucket: 'mqs-survey-app.appspot.com',
//   messagingSenderId: '25821180437'
// });
// const db = firebase.firestore(); // Initialize Cloud Firestore through Firebase
// db.settings({ timestampsInSnapshots: true });

const docFactory = (doc) => (doc || { test: 'doc' });

/**
 * reverse engineer a snapshot object from test data
 * @param  {[Object, Array]} test [description]
 * @return {[type]}               [description]
 */
const snapshotFactory = (test) => {
  const buildDoc = (data) => ({ data: () => data });

  const empty = !test;
  const size = test ? (test.length || 1) : 0;
  const buildSnapshot = (obj = {}) => ({ empty, size, ...obj });

  return size > 1
    ? buildSnapshot({ forEach: (...a) => test.map(buildDoc).forEach(...a) })
    : buildSnapshot(buildDoc(test));
}

describe('mapDocSnapshot', function() {
  it('should map a docSnapshot to a document', function() {
    const doc = docFactory();
    const _snapshot = snapshotFactory(doc);
    const { snapshot, data } = mapDocSnapshot(_snapshot);

    expect(data).toBeDefined();
    expect(data).toEqual(doc);

    expect(snapshot).toBeDefined();
    expect(snapshot.data()).toEqual(doc);
  });
});

describe('mapQuerySnapshot', function() {
  it('should map a snapshot to an array of documents', function() {
    const docs = [docFactory(), docFactory()];
    const _snapshot = snapshotFactory(docs);
    const { snapshot, data } = mapQuerySnapshot(_snapshot);

    expect(data).toBeDefined();
    expect(data.map(doc => doc.data)).toEqual(docs);

    expect(snapshot).toBeDefined();

    const test = [];
    snapshot.forEach((doc) => test.push(doc.data()));

    expect(test).toEqual(docs);
  });
});

// describe('firebase', function() {
//   it('should connect to firebase', function() {
//     expect.assertions(1);
//     return expect(
//       firebase.firestore().collection('surveys').doc('WY9i7YmAJDiwpN32hi7R').get().then(snapshot => snapshot.data())
//     ).resolves.toEqual({ title: 'New Survey' });
//   });
// });

describe('firebase', function() {
  it('should connect to firebase', async (done) => {
    expect.assertions(1);
    await expect(
      firebase.firestore().collection('surveys').doc('WY9i7YmAJDiwpN32hi7R').get().then(snapshot => snapshot.data())
    ).resolves.toEqual({ title: 'New Survey' });

    done();
  });
});

// configure({ adapter: new Adapter() });
// describe('snapshotContainer', function() {
//   it('should render without throwing an error', function() {
//     const Component = () => <div>test</div>;
//     const query = snapshotFactory(docFactory());
//     const options = { propKey: 'firebase' };
//     const Test = snapshotContainer(Surveys, options)(Component);
//     expect(mount(Test).contains(<Component />)).toBe(true);
//       // expect(true).toBe(true);
//   });
// });
