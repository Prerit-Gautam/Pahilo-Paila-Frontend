// Backend Authentication Guard Module
// This module checks if the user is authenticated before allowing access to protected pages

// Check authentication status on page load
(function() {
  'use strict';

  // Function to check if user is authenticated
  function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // Function to get current user
  function getCurrentUser() {
    if (isAuthenticated()) {
      return {
        email: localStorage.getItem('userEmail'),
        name: localStorage.getItem('userName'),
        id: localStorage.getItem('userId')
      };
    }
    return null;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // User is not authenticated, redirect to home page
    // Store message to show after redirect
    sessionStorage.setItem('authRedirectMessage', 'You must be logged in to access this page. Please sign in or register to continue.');
    window.location.href = 'index.html';
  } else {
    // User is authenticated
    const user = getCurrentUser();
    console.log('User authenticated:', user.email);

    // Store user info for use in the page
    window.currentUser = user;

    // Dispatch custom event to notify page that auth is ready
    window.dispatchEvent(new CustomEvent('authReady', { detail: { user } }));
  }

  // Export auth functions for use in page scripts
  window.authGuard = {
    isAuthenticated: isAuthenticated,
    getCurrentUser: getCurrentUser
  };
})();
