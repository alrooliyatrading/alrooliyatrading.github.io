// Services Management Module
window.ServicesManager = class {
  constructor() {
    this.servicesGrid = null;
    this.filterButtons = [];
    this.currentFilter = 'all';
    this.services = CONFIG.SERVICES || [];
    
    this.init();
  }

  init() {
    this.servicesGrid = document.getElementById('services-grid');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    
    if (this.servicesGrid) {
      this.renderServices();
      this.setupFilters();
      this.setupServiceInteractions();
    }
    
    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      this.renderServices();
    });
  }

  renderServices() {
    if (!this.servicesGrid) return;
    
    const filteredServices = this.getFilteredServices();
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    this.servicesGrid.innerHTML = filteredServices.map((service, index) => `
      <div class="service-card" 
           data-service="${service.key}" 
           data-category="${service.category}"
           data-aos="fade-up" 
           data-aos-delay="${index * 100}">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="service-title">
          <span class="lang en ${currentLang === 'en' ? 'active' : ''}">${service.en}</span>
          <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">${service.ar}</span>
        </h3>
        <p class="service-desc">
          <span class="lang en ${currentLang === 'en' ? 'active' : ''}">${service.description.en}</span>
          <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">${service.description.ar}</span>
        </p>
        <div class="service-action">
          <button class="btn btn-primary service-btn" data-service="${service.key}">
            <i class="fas fa-calendar-check"></i>
            <span class="lang en ${currentLang === 'en' ? 'active' : ''}">Book Now</span>
            <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">احجز الآن</span>
          </button>
        </div>
      </div>
    `).join('');
    
    // Re-initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
    // Setup service card interactions
    this.setupServiceInteractions();
  }

  getFilteredServices() {
    if (this.currentFilter === 'all') {
      return this.services;
    }
    
    return this.services.filter(service => service.category === this.currentFilter);
  }

  setupFilters() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });
  }

  setFilter(filter) {
    // Update active filter button
    this.filterButtons.forEach(button => {
      button.classList.remove('active');
      if (button.getAttribute('data-filter') === filter) {
        button.classList.add('active');
      }
    });
    
    this.currentFilter = filter;
    
    // Animate filter change
    this.animateFilterChange();
  }

  animateFilterChange() {
    if (!this.servicesGrid) return;
    
    // Fade out
    this.servicesGrid.style.opacity = '0';
    this.servicesGrid.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      this.renderServices();
      
      // Fade in
      this.servicesGrid.style.opacity = '1';
      this.servicesGrid.style.transform = 'translateY(0)';
    }, 200);
  }

  setupServiceInteractions() {
    if (!this.servicesGrid) return;
    
    // Service card click handlers
    const serviceCards = this.servicesGrid.querySelectorAll('.service-card');
    const serviceButtons = this.servicesGrid.querySelectorAll('.service-btn');
    
    serviceCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if button was clicked
        if (e.target.closest('.service-btn')) return;
        
        const serviceKey = card.getAttribute('data-service');
        this.selectService(serviceKey);
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        this.addHoverEffect(card);
      });
      
      card.addEventListener('mouseleave', () => {
        this.removeHoverEffect(card);
      });
    });
    
    serviceButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const serviceKey = button.getAttribute('data-service');
        this.selectService(serviceKey);
      });
    });
  }

  addHoverEffect(card) {
    const icon = card.querySelector('.service-icon i');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  }

  removeHoverEffect(card) {
    const icon = card.querySelector('.service-icon i');
    if (icon) {
      icon.style.transform = '';
    }
  }

  selectService(serviceKey) {
    const service = this.services.find(s => s.key === serviceKey);
    if (!service) return;
    
    // Store selected service
    utils.setStorage('selectedService', {
      key: service.key,
      category: service.category,
      name: {
        en: service.en,
        ar: service.ar
      }
    });
    
    // Navigate to appointment section
    if (window.navigationManager) {
      window.navigationManager.navigateToSection('appointment');
    }
    
    // Pre-fill appointment form
    setTimeout(() => {
      this.prefillAppointmentForm(service);
    }, 500);
    
    // Show success message
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    const serviceName = currentLang === 'ar' ? service.ar : service.en;
    const message = window.languageManager?.getText('selectService') || 'Service selected';
    
    utils.showToast(`${message}: ${serviceName}`, 'success');
  }

  prefillAppointmentForm(service) {
    // Select category in appointment form
    const categoryOptions = document.querySelectorAll('.category-option');
    categoryOptions.forEach(option => {
      option.classList.remove('selected');
      if (option.getAttribute('data-category') === service.category) {
        option.classList.add('selected');
        option.click(); // Trigger category selection
      }
    });
    
    // Pre-select service in dropdown
    setTimeout(() => {
      const serviceSelect = document.getElementById('service-select');
      if (serviceSelect) {
        serviceSelect.value = service.key;
      }
    }, 300);
  }

  // Get service by key
  getService(key) {
    return this.services.find(service => service.key === key);
  }

  // Get services by category
  getServicesByCategory(category) {
    return this.services.filter(service => service.category === category);
  }

  // Search services
  searchServices(query) {
    const normalizedQuery = query.toLowerCase();
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    return this.services.filter(service => {
      const name = currentLang === 'ar' ? service.ar : service.en;
      const description = currentLang === 'ar' ? service.description.ar : service.description.en;
      
      return name.toLowerCase().includes(normalizedQuery) ||
             description.toLowerCase().includes(normalizedQuery);
    });
  }

  // Add search functionality
  setupSearch() {
    const searchInput = document.getElementById('service-search');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        
        if (query.length > 2) {
          this.performSearch(query);
        } else {
          this.clearSearch();
        }
      }, 300);
    });
  }

  performSearch(query) {
    const results = this.searchServices(query);
    this.displaySearchResults(results);
  }

  displaySearchResults(results) {
    if (!this.servicesGrid) return;
    
    const currentLang = window.languageManager?.getCurrentLang() || 'en';
    
    if (results.length === 0) {
      this.servicesGrid.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <p>
            <span class="lang en ${currentLang === 'en' ? 'active' : ''}">No services found</span>
            <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">لا توجد خدمات</span>
          </p>
        </div>
      `;
      return;
    }
    
    this.servicesGrid.innerHTML = results.map((service, index) => `
      <div class="service-card search-result" 
           data-service="${service.key}" 
           data-category="${service.category}"
           style="animation-delay: ${index * 100}ms">
        <div class="service-icon">
          <i class="${service.icon}"></i>
        </div>
        <h3 class="service-title">
          <span class="lang en ${currentLang === 'en' ? 'active' : ''}">${service.en}</span>
          <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">${service.ar}</span>
        </h3>
        <p class="service-desc">
          <span class="lang en ${currentLang === 'en' ? 'active' : ''}">${service.description.en}</span>
          <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">${service.description.ar}</span>
        </p>
        <div class="service-action">
          <button class="btn btn-primary service-btn" data-service="${service.key}">
            <i class="fas fa-calendar-check"></i>
            <span class="lang en ${currentLang === 'en' ? 'active' : ''}">Book Now</span>
            <span class="lang ar ${currentLang === 'ar' ? 'active' : ''}">احجز الآن</span>
          </button>
        </div>
      </div>
    `).join('');
    
    this.setupServiceInteractions();
  }

  clearSearch() {
    this.renderServices();
  }

  // Animate service cards on scroll
  setupScrollAnimations() {
    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.classList.add('animate-in');
        }
      });
    });
    
    // Observe all service cards
    if (this.servicesGrid) {
      const cards = this.servicesGrid.querySelectorAll('.service-card');
      cards.forEach(card => observer.observe(card));
    }
  }
}

// Add service card animation styles
utils.addCSS(`
  .service-card {
    transition: var(--transition);
    cursor: pointer;
  }

  .service-card:hover {
    transform: translateY(-8px);
  }

  .service-card .service-icon {
    transition: var(--transition);
  }

  .service-action {
    margin-top: var(--space-md);
    opacity: 0;
    transform: translateY(10px);
    transition: var(--transition);
  }

  .service-card:hover .service-action {
    opacity: 1;
    transform: translateY(0);
  }

  .search-result {
    animation: fadeInUp 0.5s ease forwards;
  }

  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-3xl);
    color: var(--text-muted);
  }

  .no-results i {
    font-size: 3rem;
    margin-bottom: var(--space-md);
    opacity: 0.5;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-in {
    animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`);

// Initialize services manager
window.addEventListener('DOMContentLoaded', () => {
  window.servicesManager = new ServicesManager();
});