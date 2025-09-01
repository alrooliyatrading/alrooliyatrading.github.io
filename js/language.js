// Language Management Module
window.LanguageManager = class {
  constructor() {
    this.currentLang = 'en';
    this.languages = ['en', 'ar'];
    this.langToggle = null;
    this.init();
  }

  init() {
    console.log('LanguageManager init() called');
    
    // Get saved language or detect browser language
    const savedLang = utils.getStorage('language');
    const browserLang = this.getBrowserLanguage();
    
    this.currentLang = savedLang || browserLang;
    console.log('Initial language set to:', this.currentLang);
    
    this.applyLanguage(this.currentLang);
    
    // Update page direction and language attributes
    this.updatePageAttributes();
    
    // Update language toggle button
    setTimeout(() => {
      this.updateLanguageToggle();
    }, 100);
  }

  getBrowserLanguage() {
    const browserLang = navigator.language || navigator.languages[0];
    
    // Check if Arabic
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
    
    return 'en'; // Default to English
  }

  applyLanguage(lang) {
    if (!this.languages.includes(lang)) {
      lang = 'en'; // Fallback
    }

    this.currentLang = lang;
    
    // Update all language elements
    this.updateLanguageElements();
    
    // Update page attributes
    this.updatePageAttributes();
    
    // Update language toggle button
    this.updateLanguageToggle();
    
    // Update form placeholders
    this.updateFormPlaceholders();
    
    // Update select options
    this.updateSelectOptions();
    
    // Update special elements manually
    this.updateSpecialElements();
    
    // Save language preference
    utils.setStorage('language', lang);
    
    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
  }

  updateLanguageElements() {
    // Simple show/hide approach for language elements
    const allLanguageElements = document.querySelectorAll('.lang');
    
    allLanguageElements.forEach(element => {
      if (element.classList.contains('en')) {
        element.style.display = this.currentLang === 'en' ? '' : 'none';
      } else if (element.classList.contains('ar')) {
        element.style.display = this.currentLang === 'ar' ? '' : 'none';
      }
    });
  }

  updatePageAttributes() {
    const html = document.documentElement;
    const body = document.body;
    
    // Update lang and dir attributes
    html.lang = this.currentLang;
    html.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // Add/remove Arabic class to body for styling
    if (this.currentLang === 'ar') {
      body.classList.add('arabic');
    } else {
      body.classList.remove('arabic');
    }
    
    // Update document title
    this.updateDocumentTitle();
  }

  updateDocumentTitle() {
    const titles = {
      en: 'Al Rooliya Trading Est. - Automotive Excellence',
      ar: 'مؤسسة الرولية للتجارة - التميز في السيارات'
    };
    
    document.title = titles[this.currentLang];
  }

  setupLanguageToggle() {
    this.langToggle = document.getElementById('lang-toggle');
    console.log('LanguageManager: Setting up toggle, element found:', !!this.langToggle);
    
    if (!this.langToggle) {
      console.error('Language toggle button not found in setupLanguageToggle!');
      return;
    }

    // Set initial state
    this.updateLanguageToggle();
    console.log('Initial language toggle state set');
  }

  updateLanguageToggle() {
    if (!this.langToggle) {
      // Find the toggle button if not already found
      this.langToggle = document.getElementById('lang-toggle');
      if (!this.langToggle) return;
    }

    const enCode = this.langToggle.querySelector('.lang-code.en');
    const arCode = this.langToggle.querySelector('.lang-code.ar');
    
    if (enCode && arCode) {
      // Show EN when current language is Arabic (to switch TO English)
      // Show AR when current language is English (to switch TO Arabic)
      if (this.currentLang === 'ar') {
        enCode.style.display = 'inline';
        enCode.style.visibility = 'visible';
        arCode.style.display = 'none';
        arCode.style.visibility = 'hidden';
      } else {
        enCode.style.display = 'none';
        enCode.style.visibility = 'hidden';
        arCode.style.display = 'inline';
        arCode.style.visibility = 'visible';
      }
      
      console.log(`Language toggle updated: showing ${this.currentLang === 'ar' ? 'EN' : 'AR'} button`);
    }
    
    // Update aria-label and title
    const labels = {
      en: 'Switch to Arabic',
      ar: 'Switch to English'
    };
    
    this.langToggle.setAttribute('aria-label', labels[this.currentLang]);
    this.langToggle.title = labels[this.currentLang];
  }

  toggleLanguage() {
    console.log('=== TOGGLE LANGUAGE CLICKED ===');
    console.log('Current language:', this.currentLang);
    
    const newLang = this.currentLang === 'en' ? 'ar' : 'en';
    console.log('Switching to:', newLang);
    
    // Apply new language immediately
    this.applyLanguage(newLang);
    
    console.log('Language switched to:', this.currentLang);
    console.log('=== TOGGLE COMPLETE ===');
    
    // Add bounce animation to toggle button
    if (this.langToggle) {
      this.langToggle.style.transform = 'scale(0.8)';
      setTimeout(() => {
        this.langToggle.style.transform = 'scale(1.1)';
        setTimeout(() => {
          this.langToggle.style.transform = '';
        }, 150);
      }, 150);
    }
  }

  // Get current language
  getCurrentLang() {
    return this.currentLang;
  }

  // Set language
  setLanguage(lang) {
    if (this.languages.includes(lang)) {
      this.applyLanguage(lang);
    }
  }

  // Get text for current language
  getText(key, lang = null) {
    const currentLang = lang || this.currentLang;
    
    // Text dictionary
    const texts = {
      loading: {
        en: 'Loading...',
        ar: 'جاري التحميل...'
      },
      success: {
        en: 'Success!',
        ar: 'نجح!'
      },
      error: {
        en: 'Error occurred',
        ar: 'حدث خطأ'
      },
      openNow: {
        en: 'Open Now',
        ar: 'مفتوح الآن'
      },
      closedNow: {
        en: 'Closed Now',
        ar: 'مغلق الآن'
      },
      opensAt: {
        en: 'Opens at',
        ar: 'يفتح في'
      },
      selectService: {
        en: 'Service selected',
        ar: 'تم اختيار الخدمة'
      },
      appointmentBooked: {
        en: 'Appointment request sent via WhatsApp',
        ar: 'تم إرسال طلب الموعد عبر الواتساب'
      },
      fillRequired: {
        en: 'Please fill all required fields',
        ar: 'يرجى ملء جميع الحقول المطلوبة'
      },
      phoneError: {
        en: 'Please enter a valid Omani phone number (8 digits)',
        ar: 'يرجى إدخال رقم هاتف عماني صحيح (8 أرقام)'
      },
      nameError: {
        en: 'Name must be at least 2 characters',
        ar: 'يجب أن يكون الاسم على الأقل حرفين'
      }
    };
    
    if (texts[key] && texts[key][currentLang]) {
      return texts[key][currentLang];
    }
    
    return key; // Return key as fallback
  }

  // Get formatted text with placeholders
  getFormattedText(key, placeholders = {}, lang = null) {
    let text = this.getText(key, lang);
    
    // Replace placeholders
    Object.keys(placeholders).forEach(placeholder => {
      const regex = new RegExp(`{${placeholder}}`, 'g');
      text = text.replace(regex, placeholders[placeholder]);
    });
    
    return text;
  }

  // Update form placeholders
  updateFormPlaceholders() {
    const placeholders = {
      'customer-phone': {
        en: '+968 9XXX XXXX',
        ar: '+968 9XXX XXXX'
      },
      'problem-description': {
        en: 'Describe the issue...',
        ar: 'اكتب وصف المشكلة...'
      },
      'vehicle-plate': {
        en: 'e.g., 12345',
        ar: 'مثال: 12345'
      },
      'vehicle-model': {
        en: 'e.g., Toyota Camry 2020',
        ar: 'مثال: تويوتا كامري 2020'
      },
      'appliance-type': {
        en: 'e.g., Generator, Compressor',
        ar: 'مثال: مولد، ضاغط'
      }
    };

    Object.keys(placeholders).forEach(id => {
      const element = document.getElementById(id);
      if (element && placeholders[id][this.currentLang]) {
        element.placeholder = placeholders[id][this.currentLang];
      }
    });
  }

  // Update select options
  updateSelectOptions() {
    // Update service select options
    const serviceSelect = document.getElementById('service-select');
    if (serviceSelect) {
      // Update first option (Choose service...)
      const firstOption = serviceSelect.querySelector('option[value=""]');
      if (firstOption) {
        const enText = firstOption.getAttribute('data-en');
        const arText = firstOption.getAttribute('data-ar');
        if (enText && arText) {
          firstOption.textContent = this.currentLang === 'ar' ? arText : enText;
        }
      }
      
      // Clear existing service options except first
      while (serviceSelect.children.length > 1) {
        serviceSelect.removeChild(serviceSelect.lastChild);
      }
      
      // Add service options based on current language
      if (typeof CONFIG !== 'undefined' && CONFIG.SERVICES) {
        CONFIG.SERVICES.forEach(service => {
          const option = document.createElement('option');
          option.value = service.key;
          option.textContent = this.currentLang === 'ar' ? service.ar : service.en;
          serviceSelect.appendChild(option);
        });
      }
    }

    // Update other select elements with data-en/data-ar attributes
    const selects = ['urgency-level'];
    selects.forEach(id => {
      const select = document.getElementById(id);
      if (select) {
        const options = select.querySelectorAll('option');
        options.forEach(option => {
          const enText = option.getAttribute('data-en');
          const arText = option.getAttribute('data-ar');
          
          if (enText && arText) {
            option.textContent = this.currentLang === 'ar' ? arText : enText;
          }
        });
      }
    });
  }

  // Format numbers for display (Arabic uses different numerals)
  formatNumber(number) {
    if (this.currentLang === 'ar') {
      // Convert to Arabic-Indic numerals
      const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return number.toString().replace(/[0-9]/g, (digit) => {
        return arabicNumerals[parseInt(digit)];
      });
    }
    
    return number.toString();
  }

  // Format date for current language
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    
    const locales = {
      en: 'en-US',
      ar: 'ar-OM'
    };
    
    return new Date(date).toLocaleDateString(locales[this.currentLang], formatOptions);
  }

  // Get reading direction
  getDirection() {
    return this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  // Check if current language is RTL
  isRTL() {
    return this.currentLang === 'ar';
  }

  // Update elements that need special handling
  updateSpecialElements() {
    // Hero subtitle - manual text switching to avoid corruption
    const heroSubtitle = document.getElementById('hero-subtitle-text');
    if (heroSubtitle) {
      const texts = {
        en: 'Trusted Hands, Timeless Care',
        ar: 'أيدٍ أمينة، عناية مستمرة'
      };
      heroSubtitle.textContent = texts[this.currentLang];
      console.log('Updated hero subtitle to:', texts[this.currentLang]);
    }
  }
}

// Simple initialization
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded - initializing language system');
  
  // Create language manager
  if (!window.languageManager) {
    window.languageManager = new LanguageManager();
    console.log('Language manager created');
  }
  
  // Set up click handler
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    console.log('Language toggle button found - adding click handler');
    
    langToggle.addEventListener('click', function(event) {
      event.preventDefault();
      console.log('Language toggle clicked!');
      
      if (window.languageManager) {
        console.log('Calling toggleLanguage method');
        window.languageManager.toggleLanguage();
      } else {
        console.error('Language manager not available');
      }
    });
  } else {
    console.error('Language toggle button not found!');
  }
});