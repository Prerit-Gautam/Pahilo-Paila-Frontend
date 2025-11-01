// Backend Authentication Module
const API_BASE_URL = 'http://localhost:8080/pahilopaila';

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
const nameGroup = document.getElementById("nameGroup");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const authForm = document.getElementById("authForm");
const nameInput = document.getElementById("name");
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
const mobileAuthButtons = document.querySelector(".mobile-auth-buttons");

// Current form mode
let isLoginMode = true;

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
    authForm.reset();
  });
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (authModal && event.target == authModal) {
    authModal.style.display = "none";
    authForm.reset();
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
  isLoginMode = true;
  if (loginTab && registerTab) {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
  }
  if (formTitle) formTitle.textContent = "Welcome Back";
  if (formSubtitle)
    formSubtitle.textContent = "Sign in to continue your journey";
  if (nameGroup) nameGroup.style.display = "none";
  if (confirmPasswordGroup) confirmPasswordGroup.style.display = "none";
  const submitBtn = document.querySelector(".auth-submit-btn");
  if (submitBtn) submitBtn.textContent = "Login";
}

// Show register form
function showRegisterForm() {
  isLoginMode = false;
  if (registerTab && loginTab) {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
  }
  if (formTitle) formTitle.textContent = "Join PahiloPaila";
  if (formSubtitle)
    formSubtitle.textContent = "Create an account to start your adventure";
  if (nameGroup) nameGroup.style.display = "block";
  if (confirmPasswordGroup) confirmPasswordGroup.style.display = "block";
  const submitBtn = document.querySelector(".auth-submit-btn");
  if (submitBtn) submitBtn.textContent = "Register";
}

// API Functions
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, user: data.user, message: data.message };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

async function registerNormalUser(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/registerNormalUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, user: data.user, message: data.message };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
}

// Form submission
if (authForm) {
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    // Disable submit button to prevent multiple submissions
    const submitBtn = document.querySelector(".auth-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isLoginMode ? "Logging in..." : "Registering...";
    }

    if (isLoginMode) {
      // Login
      const result = await loginUser(email, password);

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userId', result.user.id);

        // Update UI
        updateUIForLoggedInUser(result.user);

        // Show success message
        if (window.toast) {
          window.toast.success(result.message || 'You are now logged in!', 'Login Successful');
        } else {
          alert(result.message || 'Login successful!');
        }

        // Close modal and reset form
        if (authModal) authModal.style.display = "none";
        authForm.reset();
      } else {
        if (window.toast) {
          window.toast.error(result.message, 'Login Failed');
        } else {
          alert(result.message);
        }
      }
    } else {
      // Registration
      const name = nameInput ? nameInput.value.trim() : "";
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

      // Validation
      if (!name) {
        if (window.toast) {
          window.toast.warning("Please enter your name", "Name Required");
        } else {
          alert("Please enter your name");
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Register";
        }
        return;
      }

      if (password !== confirmPassword) {
        if (window.toast) {
          window.toast.error("Passwords do not match!", "Validation Error");
        } else {
          alert("Passwords do not match!");
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Register";
        }
        return;
      }

      if (password.length < 6) {
        if (window.toast) {
          window.toast.warning("Password must be at least 6 characters long", "Weak Password");
        } else {
          alert("Password must be at least 6 characters long");
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Register";
        }
        return;
      }

      const result = await registerNormalUser(name, email, password);

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', result.user.email);
        localStorage.setItem('userName', result.user.name);
        localStorage.setItem('userId', result.user.id);

        // Update UI
        updateUIForLoggedInUser(result.user);

        // Show success message
        if (window.toast) {
          window.toast.success(result.message || 'Welcome to PahiloPaila!', 'Registration Successful');
        } else {
          alert(result.message || 'Registration successful!');
        }

        // Close modal and reset form
        if (authModal) authModal.style.display = "none";
        authForm.reset();
      } else {
        if (window.toast) {
          window.toast.error(result.message, 'Registration Failed');
        } else {
          alert(result.message);
        }
      }
    }

    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = isLoginMode ? "Login" : "Register";
    }
  });
}

// Update UI for logged-in user
function updateUIForLoggedInUser(user) {
  if (userEmail) userEmail.textContent = user.email;
  if (mobileUserEmail) mobileUserEmail.textContent = user.email;
  if (authButtons) authButtons.style.display = "none";
  if (mobileAuthButtons) mobileAuthButtons.style.display = "none";
  if (userProfile) userProfile.style.display = "flex";
  if (mobileUserProfile) mobileUserProfile.style.display = "block";
}

// Update UI for logged-out user
function updateUIForLoggedOutUser() {
  if (authButtons) authButtons.style.display = "flex";
  if (mobileAuthButtons) mobileAuthButtons.style.display = "block";
  if (userProfile) userProfile.style.display = "none";
  if (mobileUserProfile) mobileUserProfile.style.display = "none";
}

// Logout function
function logoutUser() {
  // Clear local storage
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');

  // Update UI
  updateUIForLoggedOutUser();

  if (window.toast) {
    window.toast.info("You have been logged out successfully.", "Logged Out");
  } else {
    alert("You have been logged out successfully.");
  }
}

// Logout event listeners
if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutUser);
}

if (mobileLogoutBtn) {
  mobileLogoutBtn.addEventListener("click", logoutUser);
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    const user = {
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      id: localStorage.getItem('userId')
    };
    updateUIForLoggedInUser(user);
  } else {
    updateUIForLoggedOutUser();

    // Check for auth redirect message
    const authMessage = sessionStorage.getItem('authRedirectMessage');
    if (authMessage) {
      sessionStorage.removeItem('authRedirectMessage');
      if (window.toast) {
        setTimeout(() => {
          window.toast.warning(authMessage, 'Authentication Required');
        }, 500);
      }
    }
  }
});

// Function to check if user is authenticated
function isUserAuthenticated() {
  return localStorage.getItem('isAuthenticated') === 'true';
}

// Function to get current user
function getCurrentUser() {
  if (isUserAuthenticated()) {
    return {
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName'),
      id: localStorage.getItem('userId')
    };
  }
  return null;
}

// Export functions for use in other scripts
window.authService = {
  isAuthenticated: isUserAuthenticated,
  getCurrentUser: getCurrentUser,
  logout: logoutUser
};
