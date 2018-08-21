import React from 'react'; // peer dependency
import firebase from 'firebase'; // peer dependency
import { firestoreContainer, compose } from '@mqschwanda/firebase-containers';

const Cities = firebase.database().collection('cities');
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
