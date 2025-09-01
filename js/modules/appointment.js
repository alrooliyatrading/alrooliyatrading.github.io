// Appointment Module
window.AppointmentManager = class {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.form = document.getElementById('appointment-form');
    this.formData = {};
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.setupCategorySelection();
    this.setupFormActions();
    this.setupValidation();
    this.setupDateTimeDefaults();
    
    // Re-populate on language change
    window.addEventListener('languageChanged', () => {
      this.populateServices();
    });
  }

  setupCategorySelection() {
    const applyBtn = document.getElementById('apply-btn');
    const categorySelect = document.getElementById('category');
    const formFields = document.getElementById('form-fields');
    
    applyBtn?.addEventListener('click', () => {
      formFields?.classList.remove('hidden');
      this.populateServices();
      formFields?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    categorySelect?.addEventListener('change', () => {
      this.populateServices();
    });
  }

  populateServices() {
    const categorySelect = document.getElementById('category');
    const serviceSelect = document.getElementById('service');
    const plateGroup = document.getElementById('plate-group');
    const typGroup = document.getElementById('typ-group');
    
    if (!categorySelect || !serviceSelect) return;
    
    const isAppliance = categorySelect.value === 'appliance';
    const lang = this.languageManager.getCurrentLang();
    
    const services = CONFIG.SERVICES.filter(s => 
      isAppliance ? s.category === 'appliance' : s.category === 'vehicle'
    );
    
    serviceSelect.innerHTML = services.map(s => 
      `<option value="${s.key}">${lang === 'ar' ? s.ar : s.en}</option>`
    ).join('');
    
    // Show/hide relevant fields
    if (plateGroup && typGroup) {
      plateGroup.classList.toggle('hidden', isAppliance);
      typGroup.classList.toggle('hidden', !isAppliance);
    }
    
    // Check if there's a pre-selected service
    const selectedService = sessionStorage.getItem('selectedService');
    if (selectedService) {
      serviceSelect.value = selectedService;
      sessionStorage.removeItem('selectedService');
    }
  }

  setupFormActions() {
    const clearBtn = document.getElementById('clear-btn');
    const bookBtn = document.getElementById('book-btn');
    
    clearBtn?.addEventListener('click', () => {
      this.resetForm();
    });
    
    bookBtn?.addEventListener('click', () => {
      this.submitForm();
    });
  }

  setupValidation() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput?.addEventListener('input', (e) => {
      // Only allow numbers
      e.target.value = e.target.value.replace(/\D/g, '');
      
      // Limit to 8 digits
      if (e.target.value.length > 8) {
        e.target.value = e.target.value.slice(0, 8);
      }
    });
    
    phoneInput?.addEventListener('blur', () => {
      if (phoneInput.value && !utils.validatePhone(phoneInput.value)) {
        phoneInput.style.borderColor = 'var(--primary)';
        utils.showToast(this.languageManager.getText('phoneError'), 'error');
      } else {
        phoneInput.style.borderColor = '';
      }
    });
  }

  setupDateTimeDefaults() {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    if (dateInput) {
      // Set minimum date to today
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
      
      // Set default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (timeInput) {
      // Set default time to 10:00 AM
      timeInput.value = '10:00';
    }
  }

  validateForm() {
    const required = ['service', 'name', 'phone', 'date', 'time'];
    const missing = [];
    
    required.forEach(id => {
      const field = document.getElementById(id);
      if (!field?.value.trim()) {
        missing.push(id);
        field?.classList.add('error');
      } else {
        field?.classList.remove('error');
      }
    });
    
    // Validate phone format
    const phone = document.getElementById('phone')?.value;
    if (phone && !utils.validatePhone(phone)) {
      missing.push('phone (8 digits)');
      document.getElementById('phone')?.classList.add('error');
    }
    
    if (missing.length > 0) {
      const errorMsg = document.getElementById('error-msg');
      if (errorMsg) {
        errorMsg.textContent = `${this.languageManager.getText('bookingError')}: ${missing.join(', ')}`;
      }
      return false;
    }
    
    return true;
  }

  submitForm() {
    if (!this.validateForm()) {
      return;
    }
    
    // Collect form data
    this.formData = {
      category: document.getElementById('category').value,
      service: document.getElementById('service').value,
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      urgency: document.getElementById('urgency').value,
      contact: document.getElementById('contact-method').value,
      problem: document.getElementById('problem').value || '',
      plate: document.getElementById('plate')?.value || '',
      makeModel: document.getElementById('bm')?.value || '',
      appliance: document.getElementById('typ')?.value || ''
    };
    
    // Generate WhatsApp message
    const message = this.generateWhatsAppMessage();
    
    // Show success toast
    utils.showToast(this.languageManager.getText('openingWhatsApp'), 'success');
    
    // Open WhatsApp
    setTimeout(() => {
      window.open(
        `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      
      // Reset form after a delay
      setTimeout(() => {
        this.resetForm();
        utils.showToast(this.languageManager.getText('bookingSuccess'), 'success');
      }, 1000);
    }, 500);
  }

  generateWhatsAppMessage() {
    const lang = this.languageManager.getCurrentLang();
    const service = CONFIG.SERVICES.find(s => s.key === this.formData.service);
    const serviceName = lang === 'ar' ? service?.ar : service?.en;
    
    let lines = [];
    
    if (lang === 'ar') {
      lines = [
        '🔧 *طلب موعد خدمة*',
        '',
        `📋 الخدمة: ${serviceName}`,
        `👤 الاسم: ${this.formData.name}`,
        `📱 الهاتف: ${this.formData.phone}`,
        `📅 التاريخ: ${this.formData.date}`,
        `⏰ الوقت: ${this.formData.time}`,
        `⚡ الأولوية: ${this.formData.urgency}`,
        `💬 طريقة الاتصال: ${this.formData.contact}`
      ];
      
      if (this.formData.plate) lines.push(`🔢 رقم اللوحة: ${this.formData.plate}`);
      if (this.formData.makeModel) lines.push(`🚗 المركبة: ${this.formData.makeModel}`);
      if (this.formData.appliance) lines.push(`⚙️ المعدات: ${this.formData.appliance}`);
      if (this.formData.problem) lines.push(`📝 الوصف: ${this.formData.problem}`);
      
      lines.push('', '_(أرسل من موقع الرولية)_');
    } else {
      lines = [
        '🔧 *Service Appointment Request*',
        '',
        `📋 Service: ${serviceName}`,
        `👤 Name: ${this.formData.name}`,
        `📱 Phone: ${this.formData.phone}`,
        `📅 Date: ${this.formData.date}`,
        `⏰ Time: ${this.formData.time}`,
        `⚡ Priority: ${this.formData.urgency}`,
        `💬 Contact Method: ${this.formData.contact}`
      ];
      
      if (this.formData.plate) lines.push(`🔢 Plate: ${this.formData.plate}`);
      if (this.formData.makeModel) lines.push(`🚗 Vehicle: ${this.formData.makeModel}`);
      if (this.formData.appliance) lines.push(`⚙️ Equipment: ${this.formData.appliance}`);
      if (this.formData.problem) lines.push(`📝 Description: ${this.formData.problem}`);
      
      lines.push('', '_(Sent from Al Rooliya Website)_');
    }
    
    return lines.join('\n');
  }

  resetForm() {
    this.form?.reset();
    this.formData = {};
    document.getElementById('form-fields')?.classList.add('hidden');
    document.getElementById('error-msg').textContent = '';
    
    // Reset validation classes
    this.form?.querySelectorAll('.error').forEach(field => {
      field.classList.remove('error');
    });
    
    // Reset date/time defaults
    this.setupDateTimeDefaults();
  }
};
