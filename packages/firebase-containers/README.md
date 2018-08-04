# firebase-containers
A group of react containers that do firebase data fetching before rendering its corresponding sub-component.

## querySnapshotContainer


```jsx
/**
 * single document query
 */
import React from 'react'; // peer dependency
import firebase from 'firebase';
import { querySnapshotContainer } from '@mqschwanda/firebase-containers';

const query = firebase.database().collection('<COLLECTION>').doc('<QUERY>');
const container = querySnapshotContainer(query);

const ComponentWithData = container((props) =>
  <div id={props.firebase.querySnapshot.id}>
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
  <div key={doc.firebase.querySnapshot.id}>
    {JSON.stringify(doc.firebase.data)}
  </div>
));
```
