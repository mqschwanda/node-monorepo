# firebase-containers
react containers that do firebase data fetching before rendering its corresponding sub-component.

## snapshotContainer

The `snapshotContainer` hooks into the `onSnapshot` listener to get realtime updates with Cloud Firestore. The initial call creates a document snapshot immediately with the current data of the single document. Then, each time the contents change, another call updates the document snapshot.

[Firebase Docs: `onSnapshot`](https://firebase.google.com/docs/firestore/query-data/listen)

```jsx
// Example of the firebase `onSnapshot` listener we are wrapping
import firebase from 'firebase';

firebase.database().collection('cities').doc('SF').onSnapshot((snapshot) => {
  console.log(snapshot.data()); // do something with snapshot...
});
```

```jsx
/**
 * single document query
 */
import React from 'react'; // peer dependency
import firebase from 'firebase'; // peer dependency
import { snapshotContainer } from '@mqschwanda/firebase-containers';

/**
 * firebase query that allows the container to listen to the `onSnapshot`
 * @type {[type]}
 */
const query = firebase.database().collection('<COLLECTION>').doc('<QUERY>');
/**
 * options for the `snapshotContainer` container
 * @type {Object}
 */
const options = {
  /**
   * access the snapshot value to map the data injected into the sub-component
   * @param  {[type]} snapshot [description]
   * @return {Object}          [description]
   */
  mapData: (snapshot) => ({ snapshot }),
};

const container = snapshotContainer(query, options);

const ComponentWithData = container((props) =>
  <div id={props.snapshot.id}>
    {JSON.stringify(props.snapshot.data())}
  </div>
);
```

```jsx
/**
 * multiple document query
 */
import React from 'react'; // peer dependency
import firebase from 'firebase';
import { snapshotContainer } from '@mqschwanda/firebase-containers';

const query = firebase.database().collection('<COLLECTION>').where('<QUERY>');
const container = snapshotContainer(query);

const ComponentWithData = container((props) => props.snapshot.docs.map(doc =>
  <div key={doc.id}>
    {JSON.stringify(doc.data())}
  </div>
);
```
