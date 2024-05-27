// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA9c0gD5tEO3HbLiiaIUnEdmJtHXgf_3sg",
    authDomain: "teamcast-dc54b.firebaseapp.com",
    projectId: "teamcast-dc54b",
    storageBucket: "teamcast-dc54b.appspot.com",
    messagingSenderId: "485476636901",
    appId: "1:485476636901:web:710aa049200c895b0fdc0c",
    measurementId: "G-0ZTBET5RFH"
  };

// Check if Firebase is already initialized to avoid initializing it multiple times
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
export { firebase }; // Export firebase as named export


