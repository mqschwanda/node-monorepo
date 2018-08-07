# firebase-containers
react containers that do firebase data fetching before rendering its corresponding sub-component.

## querySnapshotContainer
[docs](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot)
- A QuerySnapshot contains zero or more DocumentSnapshot objects representing the results of a query. The documents can be accessed as an array via the docs property or enumerated using the forEach method. The number of documents can be determined via the empty and size properties.

```jsx
/**
 * single document query
 */
import React from 'react'; // peer dependency
import firebase from 'firebase';
import { querySnapshotContainer } from '@mqschwanda/firebase-containers';

/**
 * firebase query that allows the container to listen to the `onSnapshot`
 * @type {[type]}
 */
const query = firebase.database().collection('<COLLECTION>').doc('<QUERY>');
/**
 * options for the `querySnapshotContainer` container
 * @type {Object}
 */
const options = {
  /**
   * the name of the prop injected into the sub-component
   * @type {String}
   */
  propKey: 'firebase',
  /**
   * access the querySnapshot value to map the data injected into the sub-component
   * @param  {[type]} querySnapshot [description]
   * @return {Object}               [description]
   */
  mapQuerySnapshot: (querySnapshot) => ({ data: querySnapshot.data() }),
  /**
   * [LoadingComponent description]
   * @param {[type]} props [description]
   */
  LoadingComponent: (props) => null,
};

const container = querySnapshotContainer(query, options);

const ComponentWithData = container((props) =>
  <div id={props.firebase.snapshot.id}>
    {JSON.stringify(props.firebase.data)}
  </div>
);
```

```jsx
/**
 * multiple document query
 */
import React from 'react'; // peer dependency
import firebase from 'firebase';
import { querySnapshotContainer } from '@mqschwanda/firebase-containers';

const query = firebase.database().collection('<COLLECTION>').where('<QUERY>');
const container = querySnapshotContainer(query);

const ComponentWithData = container((props) => props.firebase.data.map(doc =>
  <div key={doc.snapshot.id}>
    {JSON.stringify(doc.data)}
  </div>
));
```
