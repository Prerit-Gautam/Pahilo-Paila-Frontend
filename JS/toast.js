// Toast Notification System
class ToastNotification {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector('.toast-container');
    }
  }

  show(options) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 4000,
      showProgress = true
    } = options;

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Icon based on type
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    // Default titles
    const defaultTitles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };

    const toastTitle = title || defaultTitles[type];
    const icon = icons[type] || icons.info;

    // Build toast HTML
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <p class="toast-title">${toastTitle}</p>
        ${message ? `<p class="toast-message">${message}</p>` : ''}
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
      ${showProgress ? '<div class="toast-progress"></div>' : ''}
    `;

    // Add to container
    this.container.appendChild(toast);

    // Show toast with animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Progress bar animation
    if (showProgress) {
      const progressBar = toast.querySelector('.toast-progress');
      if (progressBar) {
        progressBar.style.animation = `shrink ${duration}ms linear forwards`;
      }
    }

    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.close(toast);
    });

    // Auto close after duration
    if (duration > 0) {
      setTimeout(() => {
        this.close(toast);
      }, duration);
    }

    return toast;
  }

  close(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');

    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 400);
  }

  success(message, title = '') {
    return this.show({
      type: 'success',
      title: title,
      message: message
    });
  }

  error(message, title = '') {
    return this.show({
      type: 'error',
      title: title,
      message: message,
      duration: 5000
    });
  }

  warning(message, title = '') {
    return this.show({
      type: 'warning',
      title: title,
      message: message
    });
  }

  info(message, title = '') {
    return this.show({
      type: 'info',
      title: title,
      message: message
    });
  }
}

// Add CSS animation for progress bar
const style = document.createElement('style');
style.textContent = `
  @keyframes shrink {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }
`;
document.head.appendChild(style);

// Create global instance
const toast = new ToastNotification();

// Make it globally available
window.toast = toast;

// Also override alert for backward compatibility (optional)
window.showToast = (message, type = 'info') => {
  toast.show({
    type: type,
    message: message
  });
};
