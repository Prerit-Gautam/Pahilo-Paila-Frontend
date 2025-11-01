// Authentication Guard Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8C-vVb17JoWayGtZT7QQEk1uqsm04v6Q",
  authDomain: "blood-bank-auth.firebaseapp.com",
  databaseURL: "https://blood-bank-auth-default-rtdb.firebaseio.com",
  projectId: "blood-bank-auth",
  storageBucket: "blood-bank-auth.firebasestorage.app",
  messagingSenderId: "909421800976",
  appId: "1:909421800976:web:007f21257147bd8f4c6495",
  measurementId: "G-S707QP5CC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check authentication on page load
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is not signed in, redirect to home page
    alert('You must be logged in to access this page. Please sign in or register to continue.');
    window.location.href = 'index.html';
  } else {
    // User is authenticated
    console.log('User authenticated:', user.email);

    // Store user info for use in the page
    window.currentUser = user;

    // Dispatch custom event to notify page that auth is ready
    window.dispatchEvent(new CustomEvent('authReady', { detail: { user } }));
  }
});

// Export auth for use in page scripts
export { auth };
