// Language Management Module
window.LanguageManager = class {
  constructor() {
    this.currentLang = utils.getCurrentLang();
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.setupLanguageSwitchers();
  }

  setupLanguageSwitchers() {
    // Desktop language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchLanguage(btn.dataset.lang);
      });
    });
  }

  switchLanguage(lang) {
    if (lang === this.currentLang) return;
    
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    this.applyLanguage(lang);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { lang } 
    }));
    
    // Show toast
    utils.showToast(
      lang === 'ar' ? 'تم تغيير اللغة' : 'Language changed',
      'success'
    );
  }

  applyLanguage(lang) {
    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update font
    document.body.style.fontFamily = lang === 'ar' 
      ? "'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      : "'Inter', 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Show/hide language elements
    document.querySelectorAll('.lang').forEach(el => {
      el.classList.remove('active');
      if (el.classList.contains(lang)) {
        el.classList.add('active');
      }
    });
    
    // Update select options
    this.updateSelectOptions(lang);
  }

  updateSelectOptions(lang) {
    document.querySelectorAll('select option[data-en][data-ar]').forEach(option => {
      option.textContent = option.dataset[lang];
    });
  }

  getCurrentLang() {
    return this.currentLang;
  }

  getText(key) {
    const texts = {
      en: {
        selectService: 'Service selected',
        bookingSuccess: 'Appointment booked successfully!',
        bookingError: 'Please fill all required fields',
        phoneError: 'Phone number must be 8 digits',
        openNow: 'We are OPEN',
        closedNow: 'We are CLOSED',
        openingWhatsApp: 'Opening WhatsApp...'
      },
      ar: {
        selectService: 'تم اختيار الخدمة',
        bookingSuccess: 'تم حجز الموعد بنجاح!',
        bookingError: 'يرجى ملء جميع الحقول المطلوبة',
        phoneError: 'رقم الهاتف يجب أن يكون 8 أرقام',
        openNow: 'نحن مفتوحون',
        closedNow: 'نحن مغلقون',
        openingWhatsApp: 'جاري فتح واتساب...'
      }
    };
    
    return texts[this.currentLang][key] || key;
  }
};
