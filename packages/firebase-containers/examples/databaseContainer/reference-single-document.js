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
