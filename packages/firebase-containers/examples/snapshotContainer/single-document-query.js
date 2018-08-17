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
