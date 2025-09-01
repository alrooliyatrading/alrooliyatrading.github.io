// Appointment Management Module
window.AppointmentManager = class {
  constructor() {
    this.form = null;
    this.currentStep = 1;
    this.selectedCategory = null;
    this.formData = {};
    
    this.init();
  }

  init() {
    this.form = document.getElementById('appointment-form');
    
    if (this.form) {
      this.setupSteps();
      this.setupCategorySelection();
      this.setupFormValidation();
      this.setupFormSubmission();
      this.populateServiceOptions();
      this.prefillFromStorage();
    }
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.updateFormLabels();
      this.populateServiceOptions();
    });
  }

  setupSteps() {
    const backBtn = document.getElementById('back-to-step-1');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.goToStep(1);
      });
    }
  }

  setupCategorySelection() {
    const categoryOptions = document.querySelectorAll('.category-option');
    
    categoryOptions.forEach(option => {
      option.addEventListener('click', () => {
        this.selectCategory(option);
      });
      
      // Add keyboard support
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectCategory(option);
        }
      });
      
      // Make focusable
      option.setAttribute('tabindex', '0');
    });
  }

  selectCategory(option) {
    // Remove previous selections
    document.querySelectorAll('.category-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Select current option
    option.classList.add('selected');
    
    const category = option.getAttribute('data-category');
    this.selectedCategory = category;
    
    // Update form fields visibility
    this.updateFormFieldsForCategory(category);
    
    // Populate service options
    this.populateServiceOptions();
    
    // Animate to next step
    setTimeout(() => {
      this.goToStep(2);
    }, 300);
  }

  updateFormFieldsForCategory(category) {
    const step2 = document.getElementById('step-2');
    if (!step2) return;
    
    // Remove previous category classes
    step2.classList.remove('vehicle', 'appliance');
    
    // Add current category class
    step2.classList.add(category);
    
    // Update form fields visibility
    const vehicleFields = step2.querySelectorAll('.vehicle-only');
    const applianceFields = step2.querySelectorAll('.appliance-only');
    
    vehicleFields.forEach(field => {
      field.style.display = category === 'vehicle' ? 'flex' : 'none';
      const input = field.querySelector('input, select');
      if (input) {
        input.required = category === 'vehicle';
      }
    });
    
    applianceFields.forEach(field => {
      field.style.display = category === 'appliance' ? 'flex' : 'none';
      const input = field.querySelector('input, select');
      if (input) {
        input.required = category === 'appliance';
      }
    });
  }

  populateServiceOptions() {
    const serviceSelect = document.getElementById('service-select');
    if (!serviceSelect || !this.selectedCategory) return;
    
    // Clear existing options except first
    while (serviceSelect.children.length > 1) {
      serviceSelect.removeChild(serviceSelect.lastChild);
    }
    
    // Get services for selected category
    const services = CONFIG.SERVICES.filter(service => 
      service.category === this.selectedCategory
    );
    
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    // Add service options
    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.key;
      option.textContent = currentLang === 'ar' ? service.ar : service.en;
      serviceSelect.appendChild(option);
    });
    
    // Check if there's a pre-selected service
    const selectedService = utils.getStorage('selectedService');
    if (selectedService && selectedService.key) {
      serviceSelect.value = selectedService.key;
      utils.setStorage('selectedService', null); // Clear after use
    }
  }

  goToStep(stepNumber) {
    const steps = this.form.querySelectorAll('.form-step');
    
    steps.forEach((step, index) => {
      step.classList.remove('active');
      if (index + 1 === stepNumber) {
        step.classList.add('active');
      }
    });
    
    this.currentStep = stepNumber;
    
    // Focus first input in step
    setTimeout(() => {
      const activeStep = this.form.querySelector('.form-step.active');
      const firstInput = activeStep?.querySelector('input, select, button');
      if (firstInput) {
        firstInput.focus();
      }
    }, 300);
  }

  setupFormValidation() {
    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        // Clear error on input
        utils.clearFormError(input.id);
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    // Clear previous error
    utils.clearFormError(fieldId);
    
    // Required field validation
    if (field.required && !value) {
      const message = currentLang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
      utils.showFormError(fieldId, message);
      return false;
    }
    
    // Specific field validations
    switch (fieldId) {
      case 'customer-name':
        if (value && value.length < 2) {
          const message = window.languageManager?.getText('nameError') || 
                         'Name must be at least 2 characters';
          utils.showFormError(fieldId, message);
          return false;
        }
        break;
        
      case 'customer-phone':
        if (value && !utils.isValidPhone(value)) {
          const message = window.languageManager?.getText('phoneError') || 
                         'Please enter a valid phone number';
          utils.showFormError(fieldId, message);
          return false;
        }
        break;
        
      case 'appointment-date':
        if (value && new Date(value) < new Date()) {
          const message = currentLang === 'ar' ? 
                         'لا يمكن اختيار تاريخ سابق' : 
                         'Cannot select a past date';
          utils.showFormError(fieldId, message);
          return false;
        }
        break;
    }
    
    return true;
  }

  setupFormSubmission() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission();
    });
  }

  handleFormSubmission() {
    // Validate all required fields
    const isValid = this.validateForm();
    
    if (!isValid) {
      const message = window.languageManager?.getText('fillRequired') || 
                     'Please fill all required fields';
      utils.showToast(message, 'error');
      return;
    }
    
    // Collect form data
    this.collectFormData();
    
    // Generate WhatsApp message
    const message = this.generateWhatsAppMessage();
    
    // Open WhatsApp
    const whatsappURL = utils.generateWhatsAppURL(message);
    window.open(whatsappURL, '_blank');
    
    // Show success message
    const successMessage = window.languageManager?.getText('appointmentBooked') || 
                          'Appointment request sent via WhatsApp';
    utils.showToast(successMessage, 'success', 4000);
    
    // Reset form after delay
    setTimeout(() => {
      this.resetForm();
    }, 2000);
  }

  validateForm() {
    const requiredFields = this.form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  collectFormData() {
    const formInputs = this.form.querySelectorAll('input, select, textarea');
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    this.formData = {
      category: this.selectedCategory,
      service: '',
      serviceName: '',
      name: '',
      phone: '',
      date: '',
      time: '',
      urgency: '',
      description: '',
      vehicleDetails: {},
      applianceDetails: {}
    };
    
    formInputs.forEach(input => {
      const value = input.value.trim();
      if (!value) return;
      
      switch (input.id) {
        case 'service-select':
          this.formData.service = value;
          // Get service name
          const service = CONFIG.SERVICES.find(s => s.key === value);
          if (service) {
            this.formData.serviceName = currentLang === 'ar' ? service.ar : service.en;
          }
          break;
          
        case 'customer-name':
          this.formData.name = value;
          break;
          
        case 'customer-phone':
          this.formData.phone = utils.formatPhoneNumber(value);
          break;
          
        case 'appointment-date':
          this.formData.date = utils.formatDate(value, currentLang);
          break;
          
        case 'appointment-time':
          this.formData.time = utils.formatTime(value);
          break;
          
        case 'urgency-level':
          this.formData.urgency = value;
          break;
          
        case 'problem-description':
          this.formData.description = value;
          break;
          
        case 'vehicle-plate':
          this.formData.vehicleDetails.plate = value;
          break;
          
        case 'vehicle-model':
          this.formData.vehicleDetails.model = value;
          break;
          
        case 'appliance-type':
          this.formData.applianceDetails.type = value;
          break;
      }
    });
  }

  generateWhatsAppMessage() {
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const template = CONFIG.WHATSAPP_MESSAGES.appointment[currentLang];
    
    // Prepare vehicle/appliance details
    let vehicleInfo = '';
    if (this.selectedCategory === 'vehicle') {
      const plate = this.formData.vehicleDetails.plate;
      const model = this.formData.vehicleDetails.model;
      vehicleInfo = `${model}${plate ? ` (${plate})` : ''}`;
    } else if (this.selectedCategory === 'appliance') {
      vehicleInfo = this.formData.applianceDetails.type || 'Industrial Equipment';
    }
    
    // Replace placeholders
    let message = template
      .replace('{service}', this.formData.serviceName)
      .replace('{name}', this.formData.name)
      .replace('{phone}', this.formData.phone)
      .replace('{vehicle}', vehicleInfo)
      .replace('{date}', this.formData.date)
      .replace('{time}', this.formData.time)
      .replace('{description}', this.formData.description || 'N/A');
    
    // Add urgency if urgent
    if (this.formData.urgency === 'urgent') {
      const urgentText = currentLang === 'ar' ? 
        '\n⚡ عاجل - يرجى الرد السريع' : 
        '\n⚡ URGENT - Please respond quickly';
      message += urgentText;
    }
    
    return message;
  }

  resetForm() {
    // Reset form
    this.form.reset();
    
    // Go back to step 1
    this.goToStep(1);
    
    // Clear selections
    document.querySelectorAll('.category-option').forEach(opt => {
      opt.classList.remove('selected');
    });
    
    // Clear form data
    this.formData = {};
    this.selectedCategory = null;
    
    // Clear all form errors
    utils.clearAllFormErrors('appointment-form');
  }

  prefillFromStorage() {
    // Check if there's a selected service in storage
    const selectedService = utils.getStorage('selectedService');
    if (selectedService) {
      // Auto-select category
      const categoryOption = document.querySelector(
        `.category-option[data-category="${selectedService.category}"]`
      );
      if (categoryOption) {
        setTimeout(() => {
          this.selectCategory(categoryOption);
        }, 500);
      }
    }
  }

  updateFormLabels() {
    // Update placeholders based on current language
    if (window.languageManager) {
      window.languageManager.updateFormPlaceholders();
      window.languageManager.updateSelectOptions();
    }
  }

  // Set minimum date to today
  setMinDate() {
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  // Update business hours status
  updateBusinessStatus() {
    const statusCard = document.getElementById('business-status');
    const statusText = document.getElementById('status-text');
    const nextOpening = document.getElementById('next-opening');
    
    if (!statusCard || !statusText) return;
    
    const isOpen = utils.isBusinessOpen();
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    if (isOpen) {
      statusCard.classList.add('open');
      statusCard.classList.remove('closed');
      
      // Set text directly based on current language instead of using spans
      const openText = currentLang === 'ar' ? 'مفتوح الآن' : 'Open Now';
      statusText.textContent = openText;
      
      if (nextOpening) {
        nextOpening.style.display = 'none';
      }
    } else {
      statusCard.classList.add('closed');
      statusCard.classList.remove('open');
      
      // Set text directly based on current language
      const closedText = currentLang === 'ar' ? 'مغلق الآن' : 'Closed Now';
      statusText.textContent = closedText;
      
      if (nextOpening) {
        const nextTime = utils.getNextOpeningTime();
        nextOpening.style.display = 'block';
        const opensText = currentLang === 'ar' ? `يفتح ${nextTime}` : `Opens ${nextTime}`;
        nextOpening.textContent = opensText;
      }
    }
  }
}

// Add appointment form styles
utils.addCSS(`
  .form-step {
    animation: fadeIn 0.3s ease-in-out;
  }

  .form-step:not(.active) {
    display: none;
  }

  .category-option {
    transition: var(--transition);
    cursor: pointer;
    outline: none;
  }

  .category-option:focus {
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  .category-option.selected {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .form-error {
    color: var(--error);
    font-size: 0.875rem;
    margin-top: var(--space-xs);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .form-error::before {
    content: '⚠';
    font-size: 1rem;
  }

  .status-card.open .status-icon {
    background: var(--success);
  }

  .status-card.closed .status-icon {
    background: var(--error);
  }

  .status-card.open .status-text {
    color: var(--success);
  }

  .status-card.closed .status-text {
    color: var(--error);
  }

  .next-opening {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-top: var(--space-xs);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`);

// Initialize appointment manager
window.addEventListener('DOMContentLoaded', () => {
  window.appointmentManager = new AppointmentManager();
  
  // Set minimum date and update business status
  setTimeout(() => {
    if (window.appointmentManager) {
      window.appointmentManager.setMinDate();
      window.appointmentManager.updateBusinessStatus();
      
      // Update business status every minute
      setInterval(() => {
        window.appointmentManager.updateBusinessStatus();
      }, 60000);
      
      // Update business status when language changes
      window.addEventListener('languageChanged', () => {
        setTimeout(() => {
          window.appointmentManager.updateBusinessStatus();
        }, 100);
      });
    }
  }, 100);
});