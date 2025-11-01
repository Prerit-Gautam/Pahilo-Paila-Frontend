// Firebase Authentication Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const mobileLoginBtn = document.getElementById("mobileLoginBtn");
const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");
const authModal = document.getElementById("authModal");
const closeBtn = document.querySelector(".close");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const userProfile = document.getElementById("userProfile");
const mobileUserProfile = document.getElementById("mobileUserProfile");
const userEmail = document.getElementById("userEmail");
const mobileUserEmail = document.getElementById("mobileUserEmail");
const logoutBtn = document.getElementById("logoutBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
const authButtons = document.querySelector(".auth-buttons");

// Event Listeners
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    showLoginForm();
    authModal.style.display = "block";
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    showRegisterForm();
    authModal.style.display = "block";
  });
}

// Mobile event listeners
if (mobileLoginBtn) {
  mobileLoginBtn.addEventListener("click", () => {
    showLoginForm();
    authModal.style.display = "block";
  });
}

if (mobileRegisterBtn) {
  mobileRegisterBtn.addEventListener("click", () => {
    showRegisterForm();
    authModal.style.display = "block";
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    authModal.style.display = "none";
  });
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (authModal && event.target == authModal) {
    authModal.style.display = "none";
  }
});

if (loginTab) {
  loginTab.addEventListener("click", () => {
    showLoginForm();
  });
}

if (registerTab) {
  registerTab.addEventListener("click", () => {
    showRegisterForm();
  });
}

// Show login form
function showLoginForm() {
  if (loginTab && registerTab) {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
  }
  if (formTitle) formTitle.textContent = "Welcome Back";
  if (formSubtitle)
    formSubtitle.textContent = "Sign in to continue your journey";
  if (confirmPasswordGroup) confirmPasswordGroup.style.display = "none";
  const submitBtn = document.querySelector(".auth-submit-btn");
  if (submitBtn) submitBtn.textContent = "Login";
}

// Show register form
function showRegisterForm() {
  if (registerTab && loginTab) {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
  }
  if (formTitle) formTitle.textContent = "Join PahiloPaila";
  if (formSubtitle)
    formSubtitle.textContent = "Create an account to start your adventure";
  if (confirmPasswordGroup) confirmPasswordGroup.style.display = "block";
  const submitBtn = document.querySelector(".auth-submit-btn");
  if (submitBtn) submitBtn.textContent = "Register";
}

// Form submission
if (authForm) {
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput ? emailInput.value : "";
    const password = passwordInput ? passwordInput.value : "";

    if (registerTab && registerTab.classList.contains("active")) {
      // Registration
      const confirmPassword = confirmPasswordInput
        ? confirmPasswordInput.value
        : "";

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          console.log("User registered:", user.email);
          alert("Registration successful!");
          if (authModal) authModal.style.display = "none";
          authForm.reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Registration error:", errorCode, errorMessage);
          alert(`Error: ${errorMessage}`);
        });
    } else {
      // Login
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User logged in:", user.email);
          alert("Login successful!");
          if (authModal) authModal.style.display = "none";
          authForm.reset();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Login error:", errorCode, errorMessage);
          alert(`Error: ${errorMessage}`);
        });
    }
  });
}

// Logout functions
function logoutUser() {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      alert("You have been logged out successfully.");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert(`Error: ${error.message}`);
    });
}

// Logout event listeners
if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutUser);
}

if (mobileLogoutBtn) {
  mobileLogoutBtn.addEventListener("click", logoutUser);
}

// Auth state observer
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user.email);
    // Update UI to show user is logged in
    if (userEmail) userEmail.textContent = user.email;
    if (mobileUserEmail) mobileUserEmail.textContent = user.email;
    if (authButtons) authButtons.style.display = "none";
    if (userProfile) userProfile.style.display = "flex";
    if (mobileUserProfile) mobileUserProfile.style.display = "block";
  } else {
    // User is signed out
    console.log("User is signed out");
    // Update UI to show user is logged out
    if (authButtons) authButtons.style.display = "flex";
    if (userProfile) userProfile.style.display = "none";
    if (mobileUserProfile) mobileUserProfile.style.display = "none";
  }
});

export { auth };
