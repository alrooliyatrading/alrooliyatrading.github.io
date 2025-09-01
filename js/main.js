// Main Application Entry Point
class AlRooliyaApp {
  constructor() {
    this.isInitialized = false;
    this.managers = {};
    
    this.init();
  }

  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error('Failed to initialize Al Rooliya App:', error);
      this.showErrorFallback();
    }
  }

  initializeApp() {
    console.log('🚗 Initializing Al Rooliya Trading Website...');

    // Initialize core managers
    this.initializeManagers();
    
    // Setup global event listeners
    this.setupGlobalEvents();
    
    // Setup WhatsApp integration
    this.setupWhatsAppIntegration();
    
    // Setup contact interactions
    this.setupContactInteractions();
    
    // Initialize year in footer
    this.updateFooterYear();
    
    // Setup accessibility features
    this.setupAccessibility();
    
    // Setup performance optimizations
    this.setupPerformanceOptimizations();
    
    // Mark as initialized
    this.isInitialized = true;
    
    console.log('✅ Al Rooliya Trading Website initialized successfully');
    
    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('appReady'));
  }

  initializeManagers() {
    // Managers are initialized in their respective files
    // This method serves as a reference and potential override point
    
    // Utils (already initialized)
    this.managers.utils = window.utils;
    
    // Theme Manager
    this.managers.theme = window.themeManager;
    
    // Language Manager
    this.managers.language = window.languageManager;
    
    // Navigation Manager
    this.managers.navigation = window.navigationManager;
    
    // Services Manager
    this.managers.services = window.servicesManager;
    
    // Appointment Manager
    this.managers.appointment = window.appointmentManager;
    
    // Animations Manager
    this.managers.animations = window.animationsManager;
  }

  setupGlobalEvents() {
    // Handle theme changes
    window.addEventListener('themeChanged', (e) => {
      this.handleThemeChange(e.detail.theme);
    });
    
    // Handle language changes
    window.addEventListener('languageChanged', (e) => {
      this.handleLanguageChange(e.detail.language);
    });
    
    // Handle visibility change (performance optimization)
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => this.handleOnlineStatus(true));
    window.addEventListener('offline', () => this.handleOnlineStatus(false));
    
    // Handle errors gracefully
    window.addEventListener('error', (e) => {
      this.handleGlobalError(e);
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.handleUnhandledRejection(e);
    });
  }

  setupWhatsAppIntegration() {
    // Get all WhatsApp buttons
    const whatsappButtons = document.querySelectorAll(
      '#hero-whatsapp, #contact-whatsapp, #footer-whatsapp, #fab-whatsapp'
    );
    
    whatsappButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.openWhatsApp();
      });
    });
    
    // Phone call buttons
    const callButtons = document.querySelectorAll('#fab-call');
    callButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.initiatePhoneCall();
      });
    });
  }

  setupContactInteractions() {
    // Email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackInteraction('email_click');
      });
    });
    
    // Phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackInteraction('phone_click');
      });
    });
    
    // Map directions
    const directionLinks = document.querySelectorAll('a[href*="maps.google.com"]');
    directionLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackInteraction('directions_click');
      });
    });
  }

  openWhatsApp() {
    const currentLang = this.managers.language?.getCurrentLang() || 'en';
    const message = CONFIG.WHATSAPP_MESSAGES.general[currentLang];
    const whatsappURL = utils.generateWhatsAppURL(message);
    
    // Track interaction
    this.trackInteraction('whatsapp_click');
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show feedback
    const successMessage = currentLang === 'ar' ? 
      'فتح واتساب...' : 'Opening WhatsApp...';
    utils.showToast(successMessage, 'info', 2000);
  }

  initiatePhoneCall() {
    const phoneNumber = CONFIG.PHONE_NUMBER;
    
    // Track interaction
    this.trackInteraction('phone_call');
    
    // Initiate call
    window.location.href = `tel:${phoneNumber}`;
    
    // Show feedback
    const currentLang = this.managers.language?.getCurrentLang() || 'en';
    const message = currentLang === 'ar' ? 
      'يتم تحويلك للاتصال...' : 'Initiating call...';
    utils.showToast(message, 'info', 2000);
  }

  updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  setupAccessibility() {
    // Skip link for keyboard navigation
    this.addSkipLink();
    
    // Focus management
    this.setupFocusManagement();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // ARIA live regions for dynamic content
    this.setupLiveRegions();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 10000;
      border-radius: 4px;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal.open');
        if (activeModal) {
          this.trapFocus(e, activeModal);
        }
      }
    });
  }

  trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + H: Go to home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        this.managers.navigation?.navigateToSection('home');
      }
      
      // Alt + S: Go to services
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        this.managers.navigation?.navigateToSection('services');
      }
      
      // Alt + C: Go to contact
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        this.managers.navigation?.navigateToSection('contact');
      }
      
      // Alt + A: Go to appointment
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        this.managers.navigation?.navigateToSection('appointment');
      }
      
      // Alt + T: Toggle theme
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.managers.theme?.toggleTheme();
      }
      
      // Alt + L: Toggle language
      if (e.altKey && e.key === 'l') {
        e.preventDefault();
        this.managers.language?.toggleLanguage();
      }
    });
  }

  setupLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(liveRegion);
  }

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  setupPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Lazy load images
    this.setupLazyLoading();
    
    // Optimize third-party scripts
    this.optimizeThirdPartyScripts();
  }

  preloadCriticalResources() {
    const criticalResources = [
      { href: 'assets/logo.png', as: 'image' },
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap', as: 'style' }
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }

  optimizeThirdPartyScripts() {
    // Defer non-critical third-party scripts
    const scripts = document.querySelectorAll('script[src*="googleapis"], script[src*="cdnjs"]');
    scripts.forEach(script => {
      if (!script.hasAttribute('defer') && !script.hasAttribute('async')) {
        script.defer = true;
      }
    });
  }

  handleThemeChange(theme) {
    // Update navigation for theme change
    if (this.managers.navigation) {
      this.managers.navigation.updateForTheme(theme);
    }
    
    // Update particle colors if animations manager exists
    if (this.managers.animations && this.managers.animations.particles) {
      this.managers.animations.particles.forEach(particle => {
        particle.color = this.managers.animations.getParticleColor();
      });
    }
    
    // Announce theme change to screen readers
    const message = `Theme changed to ${theme} mode`;
    this.announceToScreenReader(message);
  }

  handleLanguageChange(language) {
    // Update document attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update appointment form if it exists
    if (this.managers.appointment) {
      this.managers.appointment.updateFormLabels();
    }
    
    // Announce language change to screen readers
    const message = `Language changed to ${language === 'ar' ? 'Arabic' : 'English'}`;
    this.announceToScreenReader(message);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause animations
      if (this.managers.animations && this.managers.animations.animationId) {
        cancelAnimationFrame(this.managers.animations.animationId);
      }
    } else {
      // Page is visible - resume animations
      if (this.managers.animations && this.managers.animations.startParticleAnimation) {
        this.managers.animations.startParticleAnimation();
      }
    }
  }

  handleOnlineStatus(isOnline) {
    const message = isOnline ? 
      'Connection restored' : 
      'You are currently offline. Some features may not work.';
    const type = isOnline ? 'success' : 'warning';
    
    utils.showToast(message, type, 3000);
    
    // Update UI based on online status
    document.body.classList.toggle('offline', !isOnline);
  }

  handleGlobalError(error) {
    console.error('Global error:', error);
    
    // Show user-friendly error message
    const currentLang = this.managers.language?.getCurrentLang() || 'en';
    const message = currentLang === 'ar' ? 
      'حدث خطأ. يرجى المحاولة مرة أخرى.' : 
      'Something went wrong. Please try again.';
    
    utils.showToast(message, 'error', 5000);
  }

  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default behavior (logging to console)
    event.preventDefault();
  }

  trackInteraction(action, category = 'engagement') {
    console.log(`📊 Tracked interaction: ${category}.${action}`);
  }

  showErrorFallback() {
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        text-align: center;
        background: #f8fafc;
        color: #334155;
        font-family: system-ui, sans-serif;
      ">
        <div>
          <h1 style="margin-bottom: 1rem; color: #dc2626;">
            Al Rooliya Trading Est.
          </h1>
          <p style="margin-bottom: 2rem;">
            We're experiencing technical difficulties.<br>
            Please contact us directly for assistance.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="tel:+96899795913" style="
              padding: 0.75rem 1.5rem;
              background: #dc2626;
              color: white;
              text-decoration: none;
              border-radius: 0.5rem;
            ">
              📞 Call Us
            </a>
            <a href="https://wa.me/96899795913" style="
              padding: 0.75rem 1.5rem;
              background: #25d366;
              color: white;
              text-decoration: none;
              border-radius: 0.5rem;
            ">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Public API methods
  getManager(name) {
    return this.managers[name];
  }

  isReady() {
    return this.isInitialized;
  }

  destroy() {
    // Cleanup method for SPA navigation or testing
    Object.values(this.managers).forEach(manager => {
      if (manager && typeof manager.destroy === 'function') {
        manager.destroy();
      }
    });
    
    this.managers = {};
    this.isInitialized = false;
  }
}

// Initialize the application
window.AlRooliyaApp = new AlRooliyaApp();

// Export for global access
window.app = window.AlRooliyaApp;