// Utility Functions Module
window.utils = {
  // Get current language
  getCurrentLang() {
    return localStorage.getItem('preferredLanguage') || 'en';
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Smooth scroll to element
  scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  },

  // Check if mobile
  isMobile() {
    return window.innerWidth <= 768;
  },

  // Validate phone number (8 digits for Oman)
  validatePhone(phone) {
    return /^\d{8}$/.test(phone);
  },

  // Format phone for display
  formatPhone(phone) {
    return phone.replace(/(\d{4})(\d{4})/, '$1 $2');
  },

  // Show toast notification
  showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : '⚠'}</span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Format date for display
  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  },

  // Get business hours status
  getBusinessStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    let isOpen = false;
    
    if (day === 5) { // Friday
      isOpen = hour >= CONFIG.BUSINESS_HOURS.friday.open && 
               hour < CONFIG.BUSINESS_HOURS.friday.close;
    } else if (day !== 6) { // Not closed day
      isOpen = hour >= CONFIG.BUSINESS_HOURS.weekdays.open && 
               hour < CONFIG.BUSINESS_HOURS.weekdays.close;
    }
    
    return isOpen;
  }
};
