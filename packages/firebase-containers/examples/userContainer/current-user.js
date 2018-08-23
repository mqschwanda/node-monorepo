import React from 'react'; // peer dependency
import firebase from 'firebase'; // peer dependency
import { userContainer } from '@mqschwanda/firebase-containers';

// firebase.auth().onAuthStateChanged(user => { console.log({ user }); });
const handleSignIn = (event) => {
  const email = 'email@gmail.com';
  const password = 'password';

  firebase.auth().signInWithEmailAndPassword(email, password).catch(console.log);
}

const container = userContainer()
const ComponentWithData = container((props) =>
  <div>
    <h2>Welcome</h2>
    {props.user
      ? <h4>{props.user.email}</h4>
      : <button onClick={handleSignIn}>Sign In</button>}
  </div>
);
