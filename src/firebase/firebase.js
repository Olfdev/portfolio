// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi27xQYStPPlyNdBFVF1EZ4I-2O7h04nA",
  authDomain: "flo-portfolio.firebaseapp.com",
  projectId: "flo-portfolio",
  storageBucket: "flo-portfolio.appspot.com",
  messagingSenderId: "300615905737",
  appId: "1:300615905737:web:7d8289fac60c9286aa3818",
  measurementId: "G-JN2V9N7J1E"
};

// Initialize Firebase
initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// init services
export const db = getFirestore()

//collection ref
export const collref = collection(db, 'projects')

// get collection data
//getDocs(collref)
//  .then((snapshot) => {
//    console.log(snapshot.docs)
//  })