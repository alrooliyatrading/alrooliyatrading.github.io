// Services Module
window.ServicesManager = class {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.servicesGrid = document.getElementById('services-list');
    this.init();
  }

  init() {
    this.renderServices();
    this.setupServiceClick();
    
    // Re-render on language change
    window.addEventListener('languageChanged', () => {
      this.renderServices();
    });
  }

  renderServices() {
    if (!this.servicesGrid) return;
    
    const lang = this.languageManager.getCurrentLang();
    
    this.servicesGrid.innerHTML = CONFIG.SERVICES.map(service => `
      <div class="service-item reveal" data-service="${service.key}">
        <div class="service-icon">${service.icon}</div>
        <div class="service-name">
          <span class="lang en ${lang === 'en' ? 'active' : ''}">${service.en}</span>
          <span class="lang ar ${lang === 'ar' ? 'active' : ''}">${service.ar}</span>
        </div>
      </div>
    `).join('');
    
    // Reattach click handlers
    this.setupServiceClick();
  }

  setupServiceClick() {
    this.servicesGrid?.querySelectorAll('.service-item').forEach(item => {
      item.addEventListener('click', () => {
        const serviceKey = item.dataset.service;
        this.selectService(serviceKey);
      });
    });
  }

  selectService(serviceKey) {
    const service = CONFIG.SERVICES.find(s => s.key === serviceKey);
    if (!service) return;
    
    // Store selected service
    sessionStorage.setItem('selectedService', serviceKey);
    
    // Scroll to appointment
    utils.scrollToElement('appointment');
    
    // Pre-select in form
    setTimeout(() => {
      const categorySelect = document.getElementById('category');
      const serviceSelect = document.getElementById('service');
      
      if (categorySelect && serviceSelect) {
        categorySelect.value = service.category === 'appliance' ? 'appliance' : 'vehicle';
        categorySelect.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
          serviceSelect.value = serviceKey;
        }, 100);
      }
    }, 500);
    
    // Show toast
    const lang = this.languageManager.getCurrentLang();
    const serviceName = lang === 'ar' ? service.ar : service.en;
    utils.showToast(
      `${this.languageManager.getText('selectService')}: ${serviceName}`,
      'success'
    );
  }
};
