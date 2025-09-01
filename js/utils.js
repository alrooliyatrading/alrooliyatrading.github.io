// Utility Functions Module
window.Utils = class {
  constructor() {
    this.debounceTimers = new Map();
  }

  // Debounce function
  debounce(func, wait, key) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    const timer = setTimeout(func, wait);
    this.debounceTimers.set(key, timer);
  }

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Smooth scroll to element
  scrollToElement(elementId, offset = 80) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Format phone number
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add +968 prefix if not present
    if (cleaned.length === 8) {
      return `+968 ${cleaned}`;
    } else if (cleaned.startsWith('968') && cleaned.length === 11) {
      return `+${cleaned}`;
    }
    
    return phone; // Return original if can't format
  }

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number (Oman)
  isValidPhone(phone) {
    return CONFIG.FORM_VALIDATION.phone.pattern.test(phone.replace(/\s/g, ''));
  }

  // Generate WhatsApp URL
  generateWhatsAppURL(message) {
    const baseURL = 'https://wa.me/';
    const phone = CONFIG.WHATSAPP_NUMBER;
    const encodedMessage = encodeURIComponent(message);
    return `${baseURL}${phone}?text=${encodedMessage}`;
  }

  // Show toast notification
  showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas fa-${this.getToastIcon(type)}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  getToastIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  // Format date for display
  formatDate(date, locale = 'en') {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };

    const locales = {
      en: 'en-US',
      ar: 'ar-OM'
    };

    return new Date(date).toLocaleDateString(locales[locale] || 'en-US', options);
  }

  // Format time for display
  formatTime(time) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Check if business is currently open
  isBusinessOpen() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const currentTime = now.getHours() + (now.getMinutes() / 60);
    
    const hours = CONFIG.BUSINESS_HOURS;
    
    // Friday (5) has different hours
    if (currentDay === 5) {
      return this.isTimeInRange(currentTime, hours.friday.morning) ||
             this.isTimeInRange(currentTime, hours.friday.afternoon);
    }
    
    // Saturday (6) to Thursday (4) - weekdays
    if (currentDay === 6 || currentDay >= 0 && currentDay <= 4) {
      return this.isTimeInRange(currentTime, hours.weekdays.morning) ||
             this.isTimeInRange(currentTime, hours.weekdays.afternoon);
    }
    
    return false;
  }

  isTimeInRange(currentTime, timeRange) {
    return currentTime >= timeRange.start && currentTime <= timeRange.end;
  }

  // Get next opening time
  getNextOpeningTime() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() + (now.getMinutes() / 60);
    
    const hours = CONFIG.BUSINESS_HOURS;
    
    // Check if we can open later today
    if (currentDay === 5) { // Friday
      if (currentTime < hours.friday.morning.start) {
        return this.formatOpeningTime(hours.friday.morning.start, 'today');
      } else if (currentTime >= hours.friday.morning.end && currentTime < hours.friday.afternoon.start) {
        return this.formatOpeningTime(hours.friday.afternoon.start, 'today');
      }
    } else if (currentDay === 6 || currentDay >= 0 && currentDay <= 4) { // Weekdays
      if (currentTime < hours.weekdays.morning.start) {
        return this.formatOpeningTime(hours.weekdays.morning.start, 'today');
      } else if (currentTime >= hours.weekdays.morning.end && currentTime < hours.weekdays.afternoon.start) {
        return this.formatOpeningTime(hours.weekdays.afternoon.start, 'today');
      }
    }
    
    // Next day
    const nextDay = (currentDay + 1) % 7;
    if (nextDay === 5) { // Next day is Friday
      return this.formatOpeningTime(hours.friday.morning.start, 'tomorrow');
    } else if (nextDay === 6 || nextDay >= 0 && nextDay <= 4) { // Next day is weekday
      return this.formatOpeningTime(hours.weekdays.morning.start, 'tomorrow');
    }
    
    return 'Saturday 7:30 AM'; // Default
  }

  formatOpeningTime(time, day) {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours;
    const displayMinutes = minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;
    
    const dayText = day === 'today' ? '' : 'Tomorrow ';
    return `${dayText}${displayHours}${displayMinutes} ${ampm}`;
  }

  // Animate counter
  animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function (ease out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * easeOut);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Create intersection observer
  createIntersectionObserver(callback, options = {}) {
    const defaultOptions = {
      ...CONFIG.OBSERVER_OPTIONS,
      ...options
    };

    return new IntersectionObserver(callback, defaultOptions);
  }

  // Handle form errors
  showFormError(field, message) {
    const fieldElement = document.getElementById(field);
    if (!fieldElement) return;

    // Remove existing error
    this.clearFormError(field);

    // Add error class
    fieldElement.classList.add('error');

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.id = `${field}-error`;
    errorDiv.textContent = message;

    // Insert after field
    fieldElement.parentNode.insertBefore(errorDiv, fieldElement.nextSibling);
  }

  clearFormError(field) {
    const fieldElement = document.getElementById(field);
    const errorElement = document.getElementById(`${field}-error`);
    
    if (fieldElement) {
      fieldElement.classList.remove('error');
    }
    
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Clear all form errors
  clearAllFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const errorElements = form.querySelectorAll('.form-error');
    const errorFields = form.querySelectorAll('.error');

    errorElements.forEach(el => el.remove());
    errorFields.forEach(el => el.classList.remove('error'));
  }

  // Storage helpers
  setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
      return defaultValue;
    }
  }

  // Device detection
  isMobile() {
    return window.innerWidth <= 768;
  }

  isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  // Add CSS animation classes
  addCSS(styles) {
    if (document.getElementById('dynamic-styles')) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'dynamic-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

// Create global instance
window.utils = new Utils();