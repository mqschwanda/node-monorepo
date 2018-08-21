# firebase-containers
Firebase containers are a collection of [higher-order components](https://reactjs.org/docs/higher-order-components.html) that do firebase data fetching before rendering their corresponding sub-component.

## Table of contents
- [Todo](#todo)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [API](#api)
  - [firestoreContainer](#firestorecontainer)
  - [databaseContainer](#databasecontainer)
  - [userContainer](#usercontainer)

## Todo
- [ ] add userContainer docs & examples
- [ ] finish writing tests

## Getting Started

### Installation
**Important: Make sure you already have `react` and `firebase` packages already installed or you will also need to install these alongside `@mqschwanda/firebase-containers`.**

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
<script src="https://unpkg.com/@mqschwanda/firebase-containers"></script>
```

## API

### firestoreContainer
The `firestoreContainer` hooks into the `onSnapshot` listener to get realtime updates with Cloud Firestore. The initial call creates a document snapshot immediately with the current data of the single document. Then, each time the contents change, another call updates the document snapshot. The listener triggers a React.Component's `this.setState` and re-renders passing the updated snapshot through to the sub-component.

Example of the firebase `onSnapshot` listener we are wrapping:
```jsx
import firebase from 'firebase';
const SF = firebase.database().collection('cities').doc('SF');

SF.onSnapshot((snapshot) => {
  console.log(snapshot.data());
});
```
You can read more about the `onSnapshot` Firebase API we are wrapping [here](https://firebase.google.com/docs/firestore/query-data/listen).

`firestoreContainer` has the following signature:
```jsx
/**
* @name firestoreContainer
* @type {Function}
* @description This container takes a firestore query and injects the snapshot
* into the sub-component.
* @since 0.0.15
* @param  {firebase.firestore.Query} query firestore Query which we can read or listen to
* @param  {Object} options options object
* @return {Function} composable function that accepts react components as params
* @returns container(Component, Loading)
*/
const container = firestoreContainer(query[, options]);
// we are currying the arguments so the above container is the same as...
// const container = (Component[, Loading]) =>
//   firestoreContainer(query[, options])(Component[, Loading])
```

#### arguments
- `query` (required)
  ```jsx
  /**
   * @description A firestore Query which you can read or listen to
   * @type {firebase.firestore.Query}
   * @see {@link https://firebase.google.com/docs/reference/js/firebase.firestore.Query}
   */
  const query = firebase.database().collection('cities').doc('SF');
  ```
- `options` (optional)
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

#### Examples

- query single document
  ```jsx
  // ./examples/firestoreContaier/query-single-document.js
  import React from 'react'; // peer dependency
  import firebase from 'firebase'; // peer dependency
  import { firestoreContainer } from '@mqschwanda/firebase-containers';

  const query = firebase.firestore().collection('cities').doc('SF');
  const container = firestoreContainer(query);

  const ComponentWithData = container((props) =>
    <div id={props.snapshot.id}>
      {JSON.stringify(props.snapshot.data())}
    </div>
  );
  ```
- query multiple documents
  ```jsx
  // ./examples/firestoreContaier/query-multiple-documents.js
  import React from 'react'; // peer dependency
  import firebase from 'firebase'; // peer dependency
  import { firestoreContainer } from '@mqschwanda/firebase-containers';

  const query = firebase.firestore().collection('cities').where('state == CA');
  const container = firestoreContainer(query);

  const ComponentWithData = container((props) => props.snapshot.docs.map(doc =>
    doc.exists &&
    <div key={doc.id}>
      {JSON.stringify(doc.data())}
    </div>
  );
  ```
- query composition
  ```jsx
  // ./examples/firestoreContaier/query-composition.js
  import React from 'react'; // peer dependency
  import firebase from 'firebase'; // peer dependency
  import { firestoreContainer, compose } from '@mqschwanda/firebase-containers';

  const Cities = firebase.firestore().collection('cities');
  const SF = Cities.doc('SF');
  const LA = Cities.doc('LA');

  // use compose to apply multiple higher order components
  const container = compose(
    firestoreContainer(SF, { mapData: (sfSnapshot) => ({ sfSnapshot }) }),
    firestoreContainer(LA, { mapData: (laSnapshot) => ({ laSnapshot }) }),
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

  ### databaseContainer

  The `databaseContainer` hooks into the `.on('value')` listener to get realtime updates with Firebase's database. Firebase data is retrieved by attaching an asynchronous listener to a firebase.database.Reference. The listener triggers a React.Component's `this.setState` and re-renders passing the updated snapshot through to the sub-component.

  **Important:** The value event is called every time data is changed at the specified database reference, including changes to children. To limit the size of your snapshots, attach only at the lowest level needed for watching changes. For example, attaching a listener to the root of your database is not recommended.

  Example of the firebase `.on('value')` listener we are wrapping:
  ```jsx
  import firebase from 'firebase';
  const SF = firebase.database().ref('cities/SF');

  SF.on('value', (snapshot) => {
    console.log(snapshot.val());
  });
  ```

  You can read more about the `.on('value')` Firebase API we are wrapping [here](https://firebase.google.com/docs/database/admin/retrieve-data#value).

  `databaseContainer` has the following signature:
  ```jsx
  /**
    * @name databaseContainer
    * @type {Function}
    * @description This container listens to a database reference and injects the
    * snapshot into the sub-component.
    * @since 0.0.15
    * @param  {firebase.database.Reference} reference database reference which we can read or listen to
    * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.Reference}
    * @param  {Object} options options object
    * @return {Function} composable function that accepts react components as params
    * @returns container(Component, Loading)
    */
    const container = databaseContainer(query[, options]);
    // we are currying the arguments so the above container is the same as...
    // const container = (Component[, Loading]) =>
    //   databaseContainer(query[, options])(Component[, Loading])
  ```

  #### arguments
  - `reference` (required)
    ```jsx
    /**
     * @description database reference which we can read or listen to
     * @param  {firebase.database.Reference}
     * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.Reference}
     */
    const reference = firebase.database().ref('cities/SF');
    ```
  - `options` (optional)
    ```jsx
    const options = {
      /**
       * @name mapData
       * @type {Function}
       * @description access the snapshot to map the prop injected into the sub-component
       * @since 0.0.1
       * @param {firebase.database.DataSnapshot} snapshot database snapshot
       * @see {@link https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot}
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
  - `Component` (required)
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
  - `Loading` (optional)
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
    #### Examples

    - reference single document
      ```jsx
      // ./examples/databaseContainer/reference-single-document.js
      import React from 'react'; // peer dependency
      import firebase from 'firebase'; // peer dependency
      import { databaseContainer } from '@mqschwanda/firebase-containers';

      const reference = firebase.database().ref('cities/SF');
      const container = databaseContainer(reference);

      const ComponentWithData = container((props) =>
        <div id={props.snapshot.key}>
          {JSON.stringify(props.snapshot.val())}
        </div>
      );
      ```
    - reference multiple documents
      ```jsx
      // ./examples/databaseContainer/reference-multiple-documents.js
      import React from 'react'; // peer dependency
      import firebase from 'firebase'; // peer dependency
      import { databaseContainer } from '@mqschwanda/firebase-containers';

      const reference = firebase.database().ref('cities');
      /**
       * Firebase refs do not return a mappable array of documents that we can
       * use with react. Instead we need to map the data ourselves by iterating
       * through each document found and inject the array alongside the original
       * snapshot.
       */
      const mapData = (snapshot) => {
        const docs = [];
        snapshot.forEach(docs.push);

        return { docs, snapshot };
      }
      const container = databaseContainer(reference, { mapData });

      const ComponentWithData = container((props) => props.docs.map(doc =>
        doc.exists &&
        <div key={doc.key}>
          {JSON.stringify(doc.val())}
        </div>
      );
      ```
    - reference composition
      ```jsx
      // ./examples/databaseContainer/reference-composition.js
      import React from 'react'; // peer dependency
      import firebase from 'firebase'; // peer dependency
      import { databaseContainer, compose } from '@mqschwanda/firebase-containers';

      const db = firebase.database();
      const SF = db.ref('cities/SF');
      const LA = db.ref('cities/LA');

      // use compose to apply multiple higher order components
      const container = compose(
        databaseContainer(SF, { mapData: (sfSnapshot) => ({ sfSnapshot }) }),
        databaseContainer(LA, { mapData: (laSnapshot) => ({ laSnapshot }) }),
      );

      const ComponentWithData = container((props) =>
        <div>
          <div className='san-francisco'>
            {JSON.stringify(props.sfSnapshot.val())}
          </div>
          <div className='los-angeles'>
            {JSON.stringify(props.laSnapshot.val())}
          </div>
        </div>
      );

      ```

### userContainer
docs coming soon...
