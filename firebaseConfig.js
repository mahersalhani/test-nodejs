// Import the functions you need from the SDKs you need

const  firebase = require("firebase/compat/app")
require("firebase/compat/auth")
require("firebase/compat/firestore")
require("firebase/compat/storage")
require("firebase/compat/analytics")

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCddtx8Nice1pDT1GrQIPAdB0MD3E7N0L8",
  authDomain: "doctor-project-9715c.firebaseapp.com",
  projectId: "doctor-project-9715c",
  storageBucket: "doctor-project-9715c.appspot.com",
  messagingSenderId: "499393945212",
  appId: "1:499393945212:web:fa2d897425ecbb3bb3b3f9",
  measurementId: "G-9QWY42TMPW",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

module.exports = { firebase, firestore, storage, auth };
