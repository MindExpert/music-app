// Configure Default firabase settings
// =============================================================
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBRe5bu5JlNseFkwL_Il8Tegjtz12X38es',
  authDomain: 'music-70ff1.firebaseapp.com',
  projectId: 'music-70ff1',
  storageBucket: 'music-70ff1.appspot.com',
  messagingSenderId: '131918274991',
  appId: '1:131918274991:web:82c2f3a551423bf56f0f5a'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// utils
const auth = firebase.auth()
const db = firebase.firestore()
const currentUser = auth.currentUser
const storage = firebase.storage()

// collection references
const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');

// export utils/refs
export {
  db,
  auth,
  currentUser,
  storage,
  usersCollection,
  songsCollection,
}
