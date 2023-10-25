//import './css/app.scss'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUserName } from './rtk/userSlice';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from './App'

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Initialize Firebase Authentication
const auth = getAuth();

// Check if the user is authenticated
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Dispatch the action to set the user's email
    //store.dispatch(setUserEmail(user.email));
    store.dispatch(setUserName(user.displayName));
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
