import { initializeApp } from "firebase/app"
import { getFirestore, collection } from "firebase/firestore"
import { getStorage, ref } from "firebase/storage"

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
initializeApp(firebaseConfig)
//const analytics = getAnalytics(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage()

// Create a storage reference from our storage service
export const imagesRef = ref(storage, 'images')

// init services
export const db = getFirestore()

//collection ref
export const collref = collection(db, 'projects')