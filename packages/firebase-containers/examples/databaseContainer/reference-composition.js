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
