# firebase-containers
react containers that do firebase data fetching before rendering its corresponding sub-component.

## Todo
- [ ] add CDN installation
- [ ] add referenceContainer docs
- [ ] add userContainer docs
- [ ] finish writing tests

## Installing

Using yarn, our preferred method:

```bash
$ yarn add @mqschwanda/firebase-containers
```

Using npm:

```bash
$ npm install @mqschwanda/firebase-containers
```

Using cdn:

```html
<script src="<COMMING_SOON>"></script>
```

### snapshotContainer
```jsx
/**
* @name snapshotContainer
* @type {Function}
* @description This container take a firebase query and injects the snapshot
* into the sub-component.
* @since 0.0.1
* @param  {firebase.firestore.Query} query firestore Query which we can read or listen to
* @param  {Object} options options object
* @return {Function} composable function that accepts react components as params
* @returns container(Component, Loading)
*/
const container = snapshotContaier(query[, options]);
// we are curying the arguments so the above container is the same as...
// const container = (Component[, Loading]) =>
//   snapshotContainer(query[, options])(Component[, Loading])
```

The `snapshotContainer` hooks into the `onSnapshot` listener to get realtime updates with Cloud Firestore. The initial call creates a document snapshot immediately with the current data of the single document. Then, each time the contents change, another call updates the document snapshot. The listener triggers a React.Component's `this.setState` and rerenders passing the updated snapshot through to the sub-component.

Example of the firebase `onSnapshot` listener we are wrapping:
```jsx
import firebase from 'firebase';
const SF = firebase.database().collection('cities').doc('SF');

SF.onSnapshot((snapshot) => {
  console.log(snapshot.data());
});
```
You can read more about the `onSnapshot` Firebase API we are wrapping [here](https://firebase.google.com/docs/firestore/query-data/listen).

#### arguments
- query (required)
  ```jsx
  /**
   * @description A firestore Query which you can read or listen to
   * @type {firebase.firestore.Query}
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.Query}
   */
  const query = firebase.database().collection('cities').doc('SF');
  ```
- options (optional)
  ```jsx
  const options = {
    /**
     * @name mapData
     * @type {Function}
     * @description access the snapshot to map the prop injected into the sub-component
     * @since 0.0.1
     * @param {[firebase.firestore.QuerySnapshot, firebase.firestore.QueryDocumentSnapshot]} firebase snapshot
     * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot}
     * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.QueryDocumentSnapshotshot}
     * @return {Object} prop that is merged into sub-component's props
     * @default (snapshot) => ({ snapshot })
     */
    mapData: (snapshot) => ({ snapshot }),
    // or, lets say you want to map the data to a different name...
    // mapData: (labledSnapshot) => ({ labledSnapshot }),
    /**
     * @name once
     * @type {Boolean}
     * @description if you only want the first value and dont want reactive updates
     * @since 0.0.11
     * @default false
     */
    once: false,
  };
  ```
- Component (required)
  ```jsx
  /**
   * @name Component
   * @description sub-component we are injecting the snapshot into
   * @type {React.Component}
   * @since 0.0.1
   * @param {Object} props react props
   */
  const Component = (props) => (
    <div id={props.snapshot.id}>
      {JSON.stringify(props.snapshot.data())}
    </div>
  );
  ```
- Loading (optional)
  ```jsx
  /**
   * @name Loading
   * @description component displayed while loading the query snapshot
   * @type {React.Component}
   * @since 0.0.1
   * @param {Object} props react props
   * @default (props) => <div>loading...</div>
   */
  const Loading = (props) => <div>loading...</div>
  ```

#### Usage

- single document query
  ```jsx
  import React from 'react'; // peer dependency
  import firebase from 'firebase'; // peer dependency
  import { snapshotContainer } from '@mqschwanda/firebase-containers';

  const query = firebase.database().collection('cities').doc('SF');
  const container = snapshotContainer(query);

  const ComponentWithData = container((props) =>
    <div id={props.snapshot.id}>
      {JSON.stringify(props.snapshot.data())}
    </div>
  );
  ```
- compose multiple snapshots
  ```jsx
  import React from 'react'; // peer dependency
  import firebase from 'firebase'; // peer dependency
  import { snapshotContainer, compose } from '@mqschwanda/firebase-containers';

  const Cities = firebase.database().collection('cities');
  const SF = Cities.doc('SF');
  const LA = Cities.doc('LA');

  //
  const container = compose(
    snapshotContainer(SF, { mapData: (sfSnapshot) => ({ sfSnapshot }) }),
    snapshotContainer(LA, { mapData: (laSnapshot) => ({ laSnapshot }) }),
  );

  const ComponentWithData = container((props) =>
    <div>
      <div className='san-francisco'>
        {JSON.stringify(props.sfSnapshot.data())}
      </div>
      <div className='los-angeles'>
        {JSON.stringify(props.laSnapshot.data())}
      </div>
    </div>
  );
  ```
-  multiple documents query
  ```jsx
  import React from 'react'; // peer dependency
  import firebase from 'firebase'; // peer dependency
  import { snapshotContainer } from '@mqschwanda/firebase-containers';

  const query = firebase.database().collection('cities').where('state == CA');
  const container = snapshotContainer(query);

  const ComponentWithData = container((props) => props.snapshot.docs.map(doc =>
    doc.exists &&
    <div key={doc.id}>
      {JSON.stringify(doc.data())}
    </div>
  );
  ```
