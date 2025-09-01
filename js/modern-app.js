// Modern Al Rooliya Trading Application
// ES6+ JavaScript with Clean Architecture

// Business Configuration
const CONFIG = {
  WHATSAPP_NUMBER: '96879638955',
  PHONE_NUMBER: '+96879638955',
  EMAIL: 'alrooliyatrading@gmail.com',
  LOCATION: 'Qurayyat, Oman',
  CR_NUMBER: '15484626',
  
  BUSINESS_HOURS: {
    weekdays: { 
      morning: { start: 7.5, end: 13.5 }, // 7:30 AM - 1:30 PM
      afternoon: { start: 15, end: 19.5 }  // 3:00 PM - 7:30 PM
    },
    friday: { 
      morning: { start: 7.5, end: 12.5 }, // 7:30 AM - 12:30 PM
      afternoon: { start: 15, end: 19.5 }  // 3:00 PM - 7:30 PM
    }
  },
  
  SERVICES: [
    { id: 'brakes', name: { en: 'Brake Service & Repair', ar: 'خدمة وإصلاح الفرامل' }, icon: 'fas fa-car-crash', category: 'vehicle' },
    { id: 'oil', name: { en: 'Oil Change Service', ar: 'خدمة تغيير الزيت' }, icon: 'fas fa-oil-can', category: 'vehicle' },
    { id: 'suspension', name: { en: 'Steering & Suspension', ar: 'التوجيه والتعليق' }, icon: 'fas fa-car-side', category: 'vehicle' },
    { id: 'tyres', name: { en: 'Tyre Services', ar: 'خدمات الإطارات' }, icon: 'fas fa-dot-circle', category: 'vehicle' },
    { id: 'diagnostic', name: { en: 'Engine Diagnostics', ar: 'تشخيص المحرك' }, icon: 'fas fa-search', category: 'vehicle' },
    { id: 'filters', name: { en: 'Filter Replacement', ar: 'استبدال الفلاتر' }, icon: 'fas fa-filter', category: 'vehicle' },
    { id: 'exhaust', name: { en: 'Exhaust Repair', ar: 'إصلاح العادم' }, icon: 'fas fa-wind', category: 'vehicle' },
    { id: 'denting', name: { en: 'Body Work & Painting', ar: 'أعمال الهيكل والدهان' }, icon: 'fas fa-paint-brush', category: 'vehicle' },
    { id: 'lathe', name: { en: 'Precision Machining', ar: 'أعمال الخراطة' }, icon: 'fas fa-cog', category: 'vehicle' },
    { id: 'disc', name: { en: 'Brake Disc Resurfacing', ar: 'تجديد أقراص الفرامل' }, icon: 'fas fa-compact-disc', category: 'vehicle' },
    { id: 'welding', name: { en: 'Welding Services', ar: 'خدمات اللحام' }, icon: 'fas fa-fire', category: 'vehicle' },
    { id: 'transmission', name: { en: 'Transmission Repair', ar: 'إصلاح ناقل الحركة' }, icon: 'fas fa-cogs', category: 'vehicle' },
    { id: 'industrial', name: { en: 'Industrial Equipment', ar: 'المعدات الصناعية' }, icon: 'fas fa-industry', category: 'industrial' }
  ],
  
  WHATSAPP_MESSAGES: {
    general: {
      en: "Hello! I'm interested in your automotive services. Could you please provide more information?",
      ar: "مرحباً! أنا مهتم بخدماتكم للسيارات. هل يمكنكم تقديم المزيد من المعلومات؟"
    },
    appointment: {
      en: "Hi! I would like to book an appointment for {service}.\n\nName: {name}\nPhone: {phone}\nDate: {date}\nDetails: {message}",
      ar: "مرحباً! أود حجز موعد لـ {service}.\n\nالاسم: {name}\nالهاتف: {phone}\nالتاريخ: {date}\nالتفاصيل: {message}"
    }
  }
};

// Utility Functions
class Utils {
  // Debounce function
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Throttle function
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Local storage helpers
  static getStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn('Failed to get from localStorage:', error);
      return defaultValue;
    }
  }

  static setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to set localStorage:', error);
    }
  }

  // Generate WhatsApp URL
  static generateWhatsAppURL(message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }

  // Format phone number
  static formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `+968 ${cleaned}`;
    }
    return phone;
  }

  // Check if business is open
  static isBusinessOpen() {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() + (now.getMinutes() / 60);
    const hours = CONFIG.BUSINESS_HOURS;
    
    if (currentDay === 5) { // Friday
      return this.isTimeInRange(currentTime, hours.friday.morning) ||
             this.isTimeInRange(currentTime, hours.friday.afternoon);
    } else if (currentDay === 6 || currentDay >= 0 && currentDay <= 4) { // Weekdays
      return this.isTimeInRange(currentTime, hours.weekdays.morning) ||
             this.isTimeInRange(currentTime, hours.weekdays.afternoon);
    }
    return false;
  }

  static isTimeInRange(currentTime, timeRange) {
    return currentTime >= timeRange.start && currentTime <= timeRange.end;
  }

  // Animate counter
  static animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * easeOut);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// Toast Notification System
class Toast {
  static show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    toast.innerHTML = `
      <i class="ph-${icon}"></i>
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

  static getIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'warning-circle',
      info: 'info'
    };
    return icons[type] || 'info';
  }
}

// Language Management
class LanguageManager {
  constructor() {
    this.currentLang = Utils.getStorage('language') || this.detectLanguage();
    this.init();
  }

  init() {
    this.updateLanguage();
    this.setupEventListeners();
  }

  detectLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    return browserLang.startsWith('ar') ? 'ar' : 'en';
  }

  setupEventListeners() {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => this.toggleLanguage());
    }
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.updateLanguage();
    Utils.setStorage('language', this.currentLang);
    
    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLang }
    }));
  }

  updateLanguage() {
    // Update HTML attributes
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all elements with data-lang attributes
    document.querySelectorAll('[data-lang-en], [data-lang-ar]').forEach(element => {
      const text = element.getAttribute(`data-lang-${this.currentLang}`);
      if (text) {
        if (element.tagName === 'INPUT' && element.type !== 'submit') {
          element.placeholder = text;
        } else {
          element.textContent = text;
        }
      }
    });

    // Update language toggle button
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      const langText = langToggle.querySelector('.lang-text');
      if (langText) {
        langText.textContent = this.currentLang === 'en' ? 'AR' : 'EN';
      }
    }
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = Utils.getStorage('theme') || this.getSystemTheme();
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupEventListeners();
    this.watchSystemTheme();
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!Utils.getStorage('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    Utils.setStorage('theme', this.currentTheme);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.header = document.getElementById('header');
    this.navToggle = document.getElementById('nav-toggle');
    this.navMenu = document.getElementById('nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupScrollEffects();
    this.setupSmoothScrolling();
  }

  setupEventListeners() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.closeMobileMenu();
        this.updateActiveLink(link);
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  setupScrollEffects() {
    const scrollHandler = Utils.throttle(() => {
      this.updateHeaderOnScroll();
      this.updateActiveSection();
    }, 16);

    window.addEventListener('scroll', scrollHandler);
  }

  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          this.scrollToSection(targetId);
        });
      }
    });
  }

  toggleMobileMenu() {
    const isOpen = this.navMenu.classList.contains('active');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.navMenu.classList.add('active');
    this.navToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateHeaderOnScroll() {
    const scrollY = window.pageYOffset;
    
    if (scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + window.pageYOffset;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos <= bottom) {
        this.updateActiveLink(document.querySelector(`a[href="#${section.id}"]`));
      }
    });
  }

  updateActiveLink(activeLink) {
    this.navLinks.forEach(link => link.classList.remove('active'));
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = this.header.offsetHeight;
      const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Services Management
class ServicesManager {
  constructor() {
    this.servicesGrid = document.getElementById('services-grid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.renderServices();
    this.setupFilterEvents();
    this.setupLanguageListener();
  }
  
  setupLanguageListener() {
    // Re-render services when language changes
    window.addEventListener('languageChanged', () => {
      setTimeout(() => {
        this.renderServices();
        // Force filter update to ensure all cards are visible
        this.filterServices(this.currentFilter);
      }, 200);
    });
  }

  setupFilterEvents() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.filterServices(filter);
        
        // Update active filter button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }

  renderServices() {
    if (!this.servicesGrid) return;

    const services = CONFIG.SERVICES.map(service => this.createServiceCard(service));
    this.servicesGrid.innerHTML = services.join('');
  }

  createServiceCard(service) {
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const name = service.name[currentLang];
    
    return `
      <div class="service-card" data-category="${service.category}" data-service="${service.id}">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="service-title">${name}</h3>
        <p class="service-description" 
           data-lang-en="${service.description?.en || ''}"
           data-lang-ar="${service.description?.ar || ''}"
        >${service.description?.[currentLang] || ''}</p>
      </div>
    `;
  }

  filterServices(filter) {
    this.currentFilter = filter;
    const serviceCards = this.servicesGrid.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        card.style.display = 'block';
        card.style.animation = 'fadeUp 0.4s ease-out forwards';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// Business Hours Management
class BusinessHoursManager {
  constructor() {
    this.statusBadge = document.getElementById('status-badge');
    this.statusText = document.getElementById('status-text');
    this.init();
  }

  init() {
    this.updateStatus();
    // Update status every minute
    setInterval(() => this.updateStatus(), 60000);
    
    // Update when language changes
    window.addEventListener('languageChanged', () => {
      setTimeout(() => this.updateStatus(), 100);
    });
  }

  updateStatus() {
    if (!this.statusBadge || !this.statusText) return;

    const isOpen = Utils.isBusinessOpen();
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    // Update badge appearance
    this.statusBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
    
    // Update status text
    const statusMessages = {
      open: { en: 'Open Now', ar: 'مفتوح الآن' },
      closed: { en: 'Closed Now', ar: 'مغلق الآن' }
    };
    
    const status = isOpen ? 'open' : 'closed';
    this.statusText.textContent = statusMessages[status][currentLang];
  }
}

// Appointment Management
class AppointmentManager {
  constructor() {
    this.form = document.getElementById('appointment-form');
    this.serviceSelect = document.getElementById('service-type');
    this.currentStep = 1;
    this.totalSteps = 3;
    this.appointmentData = {};
    this.init();
  }

  init() {
    this.populateServiceOptions();
    this.setupFormEvents();
    this.setupStepNavigation();
    this.setMinDate();
    this.populateTimeSlots();
    this.initializeSteps();
  }

  initializeSteps() {
    const steps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.appointment-steps .step');
    
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    if (indicators.length > 0) {
      indicators[0].classList.add('active');
    }
  }

  setupStepNavigation() {
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const submitBtn = document.getElementById('submit-appointment');
    
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => this.nextStep());
    });
    
    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => this.prevStep());
    });
    
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => this.handleSubmit(e));
    }
    
    // Category selection - Updated selector
    const categoryCards = document.querySelectorAll('.service-category');
    categoryCards.forEach(card => {
      card.addEventListener('click', () => this.selectCategory(card));
    });
    
    // Service selection - Updated to handle clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.service-option')) {
        const serviceOption = e.target.closest('.service-option');
        const radio = serviceOption.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          this.selectService(radio.value);
        }
      }
    });
    
    // Back to categories button
    const backToCategoriesBtn = document.getElementById('btn-back-to-categories');
    if (backToCategoriesBtn) {
      backToCategoriesBtn.addEventListener('click', () => this.showCategories());
    }
    
    // Step navigation buttons
    const btnToStep3 = document.getElementById('btn-to-step-3');
    if (btnToStep3) {
      btnToStep3.addEventListener('click', () => this.nextStep());
    }
    
    const btnBackToStep1 = document.getElementById('btn-back-to-step-1');
    if (btnBackToStep1) {
      btnBackToStep1.addEventListener('click', () => this.prevStep());
    }
    
    const btnBackToStep2 = document.getElementById('btn-back-to-step-2');
    if (btnBackToStep2) {
      btnBackToStep2.addEventListener('click', () => this.prevStep());
    }
    
    const submitAppointmentBtn = document.getElementById('submit-appointment');
    if (submitAppointmentBtn) {
      submitAppointmentBtn.addEventListener('click', (e) => this.handleSubmit(e));
    }
  }

  populateServiceOptions() {
    if (!this.serviceSelect) return;

    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    // Clear existing options except the first one
    this.serviceSelect.innerHTML = `
      <option value="" data-lang-en="Select a service" data-lang-ar="اختر خدمة">
        ${currentLang === 'ar' ? 'اختر خدمة' : 'Select a service'}
      </option>
    `;
    
    // Add service options
    CONFIG.SERVICES.forEach(service => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = service.name[currentLang];
      this.serviceSelect.appendChild(option);
    });
  }

  setupFormEvents() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Update service options when language changes
    window.addEventListener('languageChanged', () => {
      setTimeout(() => {
        this.populateServiceOptions();
        this.populateTimeSlots();
        this.updateStepContent();
        this.updatePlaceholders();
        this.updateServicesForCategory(); // Update appointment form services
      }, 200);
    });
    
    // Add input formatters
    this.setupInputFormatters();
  }
  
  setupInputFormatters() {
    // License plate formatter
    const licensePlateInput = document.getElementById('license-plate');
    if (licensePlateInput) {
      licensePlateInput.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
        
        // Remove existing spaces to reformat
        value = value.replace(/\s/g, '');
        
        // Find where digits end and letters begin
        const match = value.match(/^(\d+)([A-Z]*)$/);
        if (match && match[1] && match[2]) {
          // Format as: digits + space + letters (max 2 letters)
          const digits = match[1];
          const letters = match[2].substring(0, 2);
          value = digits + (letters ? ' ' + letters : '');
        }
        
        e.target.value = value;
      });
    }
    
    // Phone number formatter
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) {
          value = value.substring(0, 8);
        }
        e.target.value = value;
      });
    }
  }

  selectCategory(card) {
    // Store selected category
    this.appointmentData.category = card.dataset.category;
    
    // Show services for this category
    this.showServicesForCategory(card.dataset.category);
    
    // Update category title
    const categoryTitle = document.querySelector('.selected-category-title');
    if (categoryTitle) {
      const currentLang = window.languageManager?.getCurrentLang() || 'en';
      const titleText = card.dataset.category === 'vehicle' ? 
        (currentLang === 'ar' ? 'خدمات المركبات' : 'Vehicle Services') :
        (currentLang === 'ar' ? 'الخدمات الصناعية' : 'Industrial Services');
      categoryTitle.textContent = titleText;
    }
    
    // Show/hide category-specific fields in step 2
    this.updateCategoryFields(card.dataset.category);
  }
  
  showCategories() {
    const categoriesContainer = document.querySelector('.service-categories');
    const servicesSelection = document.getElementById('services-selection');
    
    if (categoriesContainer) categoriesContainer.style.display = 'block';
    if (servicesSelection) servicesSelection.style.display = 'none';
    
    // Clear selection
    this.appointmentData.category = null;
    this.appointmentData.service = null;
  }
  
  showServicesForCategory(category) {
    const categoriesContainer = document.querySelector('.service-categories');
    const servicesSelection = document.getElementById('services-selection');
    
    if (categoriesContainer) categoriesContainer.style.display = 'none';
    if (servicesSelection) servicesSelection.style.display = 'block';
    
    // Populate services
    this.updateServicesForCategory();
  }

  selectService(serviceId) {
    this.appointmentData.service = serviceId;
    
    // Visual feedback for selected service
    document.querySelectorAll('.service-option .service-item').forEach(item => {
      item.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`input[value="${serviceId}"]`);
    if (selectedOption) {
      const serviceItem = selectedOption.closest('.service-option').querySelector('.service-item');
      serviceItem.classList.add('selected');
    }
    
    // Auto advance to next step after a short delay
    setTimeout(() => {
      this.nextStep();
    }, 500);
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      // Validate current step
      if (!this.validateStep(this.currentStep)) {
        return;
      }
      
      // Hide current step
      const currentStepEl = document.getElementById(`step-${this.currentStep}`);
      if (currentStepEl) {
        currentStepEl.classList.remove('active');
      }
      
      // Update step counter
      this.currentStep++;
      
      // Show next step
      const nextStepEl = document.getElementById(`step-${this.currentStep}`);
      if (nextStepEl) {
        nextStepEl.classList.add('active');
      }
      
      // Update progress indicators
      this.updateProgressIndicators();
      
      // Update step content based on selections
      if (this.currentStep === 2) {
        this.updateCategoryFields(this.appointmentData.category);
      } else if (this.currentStep === 3) {
        this.updateSummary();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      // Hide current step
      const currentStepEl = document.getElementById(`step-${this.currentStep}`);
      if (currentStepEl) {
        currentStepEl.classList.remove('active');
      }
      
      // Update step counter
      this.currentStep--;
      
      // Show previous step
      const prevStepEl = document.getElementById(`step-${this.currentStep}`);
      if (prevStepEl) {
        prevStepEl.classList.add('active');
      }
      
      // Update progress indicators
      this.updateProgressIndicators();
    }
  }

  validateStep(step) {
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    if (step === 1) {
      if (!this.appointmentData.service) {
        const errorMsg = currentLang === 'ar' ? 
          'يرجى اختيار خدمة' : 
          'Please select a service';
        Toast.show(errorMsg, 'error');
        return false;
      }
    } else if (step === 2) {
      const name = document.getElementById('customer-name')?.value?.trim();
      const phone = document.getElementById('customer-phone')?.value?.trim();
      const date = document.getElementById('appointment-date')?.value;
      const time = document.getElementById('appointment-time')?.value;
      
      if (!name) {
        const errorMsg = currentLang === 'ar' ? 
          'يرجى إدخال اسمك' : 
          'Please enter your name';
        Toast.show(errorMsg, 'error');
        document.getElementById('customer-name')?.focus();
        return false;
      }
      
      if (!phone) {
        const errorMsg = currentLang === 'ar' ? 
          'يرجى إدخال رقم هاتفك' : 
          'Please enter your phone number';
        Toast.show(errorMsg, 'error');
        document.getElementById('customer-phone')?.focus();
        return false;
      }
      
      // Validate phone number format (8 digits for Oman)
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length !== 8) {
        const errorMsg = currentLang === 'ar' ? 
          'يرجى إدخال رقم هاتف صحيح (8 أرقام)' : 
          'Please enter a valid phone number (8 digits)';
        Toast.show(errorMsg, 'error');
        document.getElementById('customer-phone')?.focus();
        return false;
      }
      
      if (!date) {
        const errorMsg = currentLang === 'ar' ? 
          'يرجى اختيار تاريخ' : 
          'Please select a date';
        Toast.show(errorMsg, 'error');
        document.getElementById('appointment-date')?.focus();
        return false;
      }
      
      if (!time) {
        const errorMsg = currentLang === 'ar' ? 
          'يرجى اختيار وقت' : 
          'Please select a time';
        Toast.show(errorMsg, 'error');
        document.getElementById('appointment-time')?.focus();
        return false;
      }
    }
    
    return true;
  }

  updateProgressIndicators() {
    const steps = document.querySelectorAll('.appointment-steps .step');
    
    steps.forEach((step, index) => {
      const stepNum = index + 1;
      if (stepNum < this.currentStep) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (stepNum === this.currentStep) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }

  updateServicesForCategory() {
    const servicesGrid = document.getElementById('appointment-services-grid');
    if (!servicesGrid || !this.appointmentData.category) return;
    
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const categoryServices = CONFIG.SERVICES.filter(service => 
      service.category === this.appointmentData.category
    );
    
    servicesGrid.innerHTML = categoryServices.map(service => `
      <label class="service-option">
        <input type="radio" name="selected-service" value="${service.id}" style="display: none;">
        <div class="service-item">
          <div class="service-icon-small">
            <i class="${service.icon}"></i>
          </div>
          <div class="service-details">
            <h4>${service.name[currentLang]}</h4>
            <p>${service.description?.[currentLang] || ''}</p>
          </div>
          <div class="service-arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </label>
    `).join('');
  }

  updateSummary() {
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const service = CONFIG.SERVICES.find(s => s.id === this.appointmentData.service);
    const serviceName = service ? service.name[currentLang] : '';
    
    const name = document.getElementById('customer-name')?.value || '';
    const phone = document.getElementById('customer-phone')?.value || '';
    const date = document.getElementById('appointment-date')?.value || '';
    const time = document.getElementById('appointment-time')?.value || '';
    const message = document.getElementById('message')?.value || '';
    
    // Format date for display
    let displayDate = date;
    if (date) {
      const dateObj = new Date(date);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      displayDate = `${day}/${month}/${year}`;
    }
    
    // Format time for display
    let displayTime = time;
    if (time) {
      const [hour, minute] = time.split(':');
      displayTime = this.formatTime(parseInt(hour), parseInt(minute));
    }
    
    // Update individual summary elements
    const summaryService = document.getElementById('summary-service');
    const summaryName = document.getElementById('summary-name');
    const summaryPhone = document.getElementById('summary-phone');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryMessage = document.getElementById('summary-message');
    const summaryMessageSection = document.getElementById('summary-message-section');
    
    if (summaryService) summaryService.textContent = serviceName;
    if (summaryName) summaryName.textContent = name;
    if (summaryPhone) summaryPhone.textContent = phone;
    if (summaryDate) summaryDate.textContent = displayDate;
    if (summaryTime) summaryTime.textContent = displayTime;
    
    if (message && summaryMessage && summaryMessageSection) {
      summaryMessage.textContent = message;
      summaryMessageSection.style.display = 'block';
    } else if (summaryMessageSection) {
      summaryMessageSection.style.display = 'none';
    }
  }

  updateStepContent() {
    // Update category cards text based on language
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
      const category = card.dataset.category;
      const titleEl = card.querySelector('h3');
      if (titleEl) {
        if (category === 'vehicle') {
          titleEl.textContent = currentLang === 'ar' ? 'خدمات السيارات' : 'Vehicle Services';
        } else if (category === 'industrial') {
          titleEl.textContent = currentLang === 'ar' ? 'المعدات الصناعية' : 'Industrial Equipment';
        }
      }
    });
    
    // Update placeholders for category-specific fields
    this.updatePlaceholders();
  }
  
  updatePlaceholders() {
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    // Update license plate placeholder
    const licensePlateInput = document.getElementById('license-plate');
    if (licensePlateInput) {
      licensePlateInput.placeholder = currentLang === 'ar' ? 'مثال: 1234 AB' : 'e.g. 1234 AB';
    }
    
    // Update vehicle make/model placeholder
    const vehicleMakeModelInput = document.getElementById('vehicle-make-model');
    if (vehicleMakeModelInput) {
      vehicleMakeModelInput.placeholder = currentLang === 'ar' ? 'مثال: Toyota Camry 2020' : 'e.g. Toyota Camry 2020';
    }
    
    // Update equipment make/model placeholder
    const equipmentMakeModelInput = document.getElementById('equipment-make-model');
    if (equipmentMakeModelInput) {
      equipmentMakeModelInput.placeholder = currentLang === 'ar' ? 'مثال: Caterpillar 320D Excavator' : 'e.g. Caterpillar 320D Excavator';
    }
    
    // Update phone placeholder
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
      phoneInput.placeholder = currentLang === 'ar' ? '+968 12345678' : '+968 12345678';
    }
    
    // Update message textarea placeholder
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
      messageTextarea.placeholder = currentLang === 'ar' ? 'اصف أي مشاكل أو متطلبات محددة...' : 'Describe any specific issues or requirements...';
      // Ensure no text content, only placeholder
      if (messageTextarea.value === messageTextarea.placeholder) {
        messageTextarea.value = '';
      }
    }
  }

  setMinDate() {
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
      const today = new Date();
      const minDate = today.toISOString().split('T')[0];
      dateInput.min = minDate;
      dateInput.value = minDate;
      
      // Format to DD/MM/YYYY display
      this.setupDateFormatting();
    }
  }
  
  setupDateFormatting() {
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        if (e.target.value) {
          const date = new Date(e.target.value);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          // Store the formatted date for display purposes
          e.target.setAttribute('data-formatted', `${day}/${month}/${year}`);
        }
      });
    }
  }
  
  populateTimeSlots() {
    const timeSelect = document.getElementById('appointment-time');
    if (!timeSelect) return;
    
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    // Clear existing options except first
    timeSelect.innerHTML = `<option value="" data-lang-en="Select time..." data-lang-ar="اختر الوقت...">${currentLang === 'ar' ? 'اختر الوقت...' : 'Select time...'}</option>`;
    
    // Generate time slots based on business hours
    const timeSlots = this.generateBusinessHourSlots();
    
    timeSlots.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot.value;
      option.textContent = slot.display;
      timeSelect.appendChild(option);
    });
  }
  
  generateBusinessHourSlots() {
    const slots = [];
    
    // Saturday to Thursday: 7:30 AM - 1:30 PM, 3:00 PM - 7:30 PM
    // Friday: 7:30 AM - 12:30 PM, 3:00 PM - 7:30 PM
    
    // Morning slots (7:30 AM - 1:30 PM / 12:30 PM on Friday)
    for (let hour = 7; hour <= 13; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 7 && minute === 0) continue; // Skip 7:00, start from 7:30
        if (hour === 13 && minute === 30) continue; // Stop at 1:30 PM
        
        const timeValue = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const displayTime = this.formatTime(hour, minute);
        
        slots.push({
          value: timeValue,
          display: displayTime,
          period: 'morning'
        });
      }
    }
    
    // Afternoon slots (3:00 PM - 7:30 PM)
    for (let hour = 15; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 19 && minute === 30) continue; // Stop at 7:30 PM
        
        const timeValue = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const displayTime = this.formatTime(hour, minute);
        
        slots.push({
          value: timeValue,
          display: displayTime,
          period: 'afternoon'
        });
      }
    }
    
    return slots;
  }
  
  formatTime(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute === 0 ? '00' : String(minute);
    return `${displayHour}:${displayMinute} ${period}`;
  }
  
  updateCategoryFields(category) {
    const vehicleFields = document.getElementById('vehicle-fields');
    const industrialFields = document.getElementById('industrial-fields');
    
    if (!category) {
      // If no category, check current appointment data
      category = this.appointmentData.category;
    }
    
    if (vehicleFields) {
      vehicleFields.style.display = category === 'vehicle' ? 'grid' : 'none';
    }
    
    if (industrialFields) {
      industrialFields.style.display = category === 'industrial' ? 'grid' : 'none';
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.closest('form').querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }
    
    // Get form values
    const serviceId = this.appointmentData.service;
    const name = document.getElementById('customer-name')?.value?.trim() || '';
    const phone = document.getElementById('customer-phone')?.value?.trim() || '';
    const date = document.getElementById('appointment-date')?.value || '';
    const time = document.getElementById('appointment-time')?.value || '';
    const message = document.getElementById('message')?.value?.trim() || '';
    
    // Validate required fields
    if (!serviceId || !name || !phone || !date || !time) {
      const currentLang = window.languageManager?.getCurrentLang() || 'en';
      const errorMsg = currentLang === 'ar' ? 
        'يرجى ملء جميع الحقول المطلوبة' : 
        'Please fill in all required fields';
      Toast.show(errorMsg, 'error');
      
      // Reset button state
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
      return;
    }

    // Add small delay for better UX
    setTimeout(() => {
      this.sendWhatsAppMessage(serviceId, name, phone, date, time, message);
      
      // Reset button state
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }, 1000);
  }

  sendWhatsAppMessage(serviceId, name, phone, date, time, message) {
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const service = CONFIG.SERVICES.find(s => s.id === serviceId);
    const serviceName = service ? service.name[currentLang] : serviceId;
    
    // Format date and time for display
    const dateObj = new Date(date);
    const displayDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
    const [hour, minute] = time.split(':');
    const displayTime = this.formatTime(parseInt(hour), parseInt(minute));
    
    // Get category-specific details
    let categoryDetails = '';
    if (this.appointmentData.category === 'vehicle') {
      const licensePlate = document.getElementById('license-plate')?.value || '';
      const vehicleMakeModel = document.getElementById('vehicle-make-model')?.value || '';
      
      if (licensePlate || vehicleMakeModel) {
        categoryDetails = currentLang === 'ar' ? 
          `\n\nتفاصيل المركبة:\n${licensePlate ? `رقم اللوحة: ${licensePlate}\n` : ''}${vehicleMakeModel ? `نوع وطراز المركبة: ${vehicleMakeModel}\n` : ''}` :
          `\n\nVehicle Details:\n${licensePlate ? `License Plate: ${licensePlate}\n` : ''}${vehicleMakeModel ? `Make & Model: ${vehicleMakeModel}\n` : ''}`;
      }
    } else if (this.appointmentData.category === 'industrial') {
      const equipmentMakeModel = document.getElementById('equipment-make-model')?.value || '';
      const equipmentSerial = document.getElementById('equipment-serial')?.value || '';
      
      if (equipmentMakeModel || equipmentSerial) {
        categoryDetails = currentLang === 'ar' ? 
          `\n\nتفاصيل المعدات:\n${equipmentMakeModel ? `نوع وطراز المعدات: ${equipmentMakeModel}\n` : ''}${equipmentSerial ? `الرقم التسلسلي: ${equipmentSerial}\n` : ''}` :
          `\n\nEquipment Details:\n${equipmentMakeModel ? `Make & Model: ${equipmentMakeModel}\n` : ''}${equipmentSerial ? `Serial Number: ${equipmentSerial}\n` : ''}`;
      }
    }
    
    // Create detailed appointment message
    const appointmentDetails = currentLang === 'ar' ? 
      `طلب حجز موعد - مؤسسة الرولية للتجارة\n\nمرحبا! أود حجز موعد للخدمة التالية:\n\nالخدمة: ${serviceName}\nالاسم: ${name}\nالهاتف: ${phone}\nالتاريخ: ${displayDate}\nالوقت: ${displayTime}${categoryDetails}${message ? `\n\nتفاصيل اضافية:\n${message}` : ''}\n\nشكرا لكم` :
      `Appointment Request - Al Rooliya Trading Est.\n\nHello! I would like to book an appointment for the following service:\n\nService: ${serviceName}\nName: ${name}\nPhone: ${phone}\nDate: ${displayDate}\nTime: ${displayTime}${categoryDetails}${message ? `\n\nAdditional Details:\n${message}` : ''}\n\nThank you`;

    const whatsappURL = Utils.generateWhatsAppURL(appointmentDetails);
    window.open(whatsappURL, '_blank');

    // Show success message
    const successMsg = currentLang === 'ar' ? 
      'تم إرسال طلب الموعد عبر واتساب' : 
      'Appointment request sent via WhatsApp';
    Toast.show(successMsg, 'success');

    // Reset form and steps
    this.form.reset();
    this.setMinDate();
    this.resetSteps();
  }

  resetSteps() {
    this.currentStep = 1;
    this.appointmentData = {};
    
    // Reset step visibility
    document.querySelectorAll('.form-step').forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Reset progress indicators
    document.querySelectorAll('.appointment-steps .step').forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
    
    // Show categories, hide services
    this.showCategories();
    
    // Reset service selections
    document.querySelectorAll('input[name="selected-service"]').forEach(input => {
      input.checked = false;
    });
    
    document.querySelectorAll('.service-item').forEach(item => {
      item.classList.remove('selected');
    });
  }
}

// Enhanced UI Animations
class UIAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupParallaxEffect();
    this.setupCardAnimations();
    this.setupButtonRippleEffect();
    this.setupTextAnimations();
  }

  setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', Utils.throttle(() => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translate3d(0, ${rate}px, 0)`;
      });
    }, 16));
  }

  setupCardAnimations() {
    const cards = document.querySelectorAll('.service-card, .category-card, .feature-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '';
      });
    });
  }

  setupButtonRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .cta-btn, .btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  setupTextAnimations() {
    const animatedTexts = document.querySelectorAll('.animate-text');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    
    animatedTexts.forEach(text => observer.observe(text));
  }
}

// Canvas Animation for Hero Section
class HeroAnimation {
  constructor() {
    this.canvas = document.getElementById('hero-canvas');
    this.ctx = this.canvas?.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    if (this.canvas && this.ctx) {
      this.init();
    }
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(220, 38, 38, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    // Draw connections
    this.drawConnections();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const opacity = (100 - distance) / 100 * 0.2;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Main Application Class
class AlRooliyaTradingApp {
  constructor() {
    this.managers = new Map();
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    console.log('🚗 Initializing Al Rooliya Trading App...');

    // Initialize managers
    const languageManager = new LanguageManager();
    this.managers.set('language', languageManager);
    window.languageManager = languageManager; // Make it globally accessible
    
    this.managers.set('theme', new ThemeManager());
    this.managers.set('navigation', new NavigationManager());
    this.managers.set('services', new ServicesManager());
    this.managers.set('businessHours', new BusinessHoursManager());
    this.managers.set('appointment', new AppointmentManager());
    this.managers.set('heroAnimation', new HeroAnimation());
    this.managers.set('uiAnimations', new UIAnimations());

    // Setup global event listeners
    this.setupGlobalEvents();
    
    // Initialize animations
    this.initializeAnimations();
    
    // Hide preloader
    this.hidePreloader();
    
    console.log('✅ App initialized successfully');
  }

  setupGlobalEvents() {
    // WhatsApp contact buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('#hero-contact, #whatsapp-btn, #fab-whatsapp')) {
        e.preventDefault();
        this.openWhatsApp();
      }
    });

    // Scroll to top button
    const fabScroll = document.getElementById('fab-scroll');
    if (fabScroll) {
      fabScroll.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // Show/hide scroll button
      window.addEventListener('scroll', Utils.throttle(() => {
        if (window.pageYOffset > 500) {
          fabScroll.classList.add('visible');
        } else {
          fabScroll.classList.remove('visible');
        }
      }, 100));
    }

    // Counter animations on scroll
    this.setupCounterAnimations();
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
          const target = parseInt(entry.target.getAttribute('data-count'));
          Utils.animateCounter(entry.target, target);
          entry.target.setAttribute('data-animated', 'true');
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  initializeAnimations() {
    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.animate-fade-up');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
      element.style.animationPlayState = 'paused';
      observer.observe(element);
    });
  }

  hidePreloader() {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
          preloader.remove();
        }, 500);
      }
    }, 1000);
  }

  openWhatsApp() {
    const currentLang = this.managers.get('language')?.getCurrentLang() || 'en';
    const message = CONFIG.WHATSAPP_MESSAGES.general[currentLang];
    const whatsappURL = Utils.generateWhatsAppURL(message);
    
    window.open(whatsappURL, '_blank');
    
    const successMsg = currentLang === 'ar' ? 
      'فتح واتساب...' : 
      'Opening WhatsApp...';
    Toast.show(successMsg, 'info', 2000);
  }

  // Public API
  getManager(name) {
    return this.managers.get(name);
  }

  destroy() {
    this.managers.forEach(manager => {
      if (manager && typeof manager.destroy === 'function') {
        manager.destroy();
      }
    });
    this.managers.clear();
  }
}

// Global exports for debugging
window.Utils = Utils;
window.Toast = Toast;

// Initialize app
window.app = new AlRooliyaTradingApp();

// Export app for module compatibility
export default AlRooliyaTradingApp;