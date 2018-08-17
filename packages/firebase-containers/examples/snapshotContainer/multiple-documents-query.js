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
