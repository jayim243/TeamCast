import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA9c0gD5tEO3HbLiiaIUnEdmJtHXgf_3sg",
  authDomain: "teamcast-dc54b.firebaseapp.com",
  projectId: "teamcast-dc54b",
  storageBucket: "teamcast-dc54b.appspot.com",
  messagingSenderId: "485476636901",
  appId: "1:485476636901:web:710aa049200c895b0fdc0c",
  measurementId: "G-0ZTBET5RFH"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, firestore, storage };
