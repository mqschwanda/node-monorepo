import React from 'react'; // peer dependency
import firebase from 'firebase'; // peer dependency
import { databaseContainer } from '@mqschwanda/firebase-containers';

const reference = firebase.database().ref('cities');
/**
 * Firebase refs do not return a mappable array of documents that we can easily
 * use with react. Instead we need to map the data ourselves by iterating
 * through each document.
 */
const mapData = (snapshot) => {
  const docs = [];
  snapshot.forEach(docs.push);
  // inject docs array alongside the original snapshot
  return { docs, snapshot };
};
const container = databaseContainer(reference, { mapData });

const ComponentWithData = container(props => props.docs.map(doc =>
  doc.exists &&
  <div key={doc.key}>
    {JSON.stringify(doc.val())}
  </div>
);
