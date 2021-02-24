import firebase from 'firebase';

import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyAy9hwIwRIiKThY00nes8elNLcUeNMQBdo",
    authDomain: "slack-react-project.firebaseapp.com",
    projectId: "slack-react-project",
    storageBucket: "slack-react-project.appspot.com",
    messagingSenderId: "331632969467",
    appId: "1:331632969467:web:944f59e16e8ec7a9c2525e",
    measurementId: "G-6CSKN7P29S"
  };

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase;