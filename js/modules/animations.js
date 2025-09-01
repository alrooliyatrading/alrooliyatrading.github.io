// Animations Module
window.AnimationsManager = class {
  constructor(languageManager) {
    this.languageManager = languageManager;
    this.init();
  }

  init() {
    this.setupCounterAnimations();
    this.setupRevealAnimations();
    this.setupBusinessHours();
    this.setupFloatingButton();
    this.setupParallax();
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      
      updateCounter();
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          animateCounter(entry.target);
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
  }

  setupRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('active');
          }, index * 100);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
  }

  setupBusinessHours() {
    const updateStatus = () => {
      const statusEl = document.getElementById('hours-status');
      if (!statusEl) return;
      
      const isOpen = utils.getBusinessStatus();
      const lang = this.languageManager.getCurrentLang();
      
      statusEl.textContent = lang === 'ar' 
        ? (isOpen ? '🟢 نحن مفتوحون' : '🔴 نحن مغلقون')
        : (isOpen ? '🟢 We are OPEN' : '🔴 We are CLOSED');
      
      statusEl.classList.toggle('closed', !isOpen);
    };
    
    // Initial update
    updateStatus();
    
    // Update every minute
    setInterval(updateStatus, 60000);
    
    // Update on language change
    window.addEventListener('languageChanged', updateStatus);
  }

  setupFloatingButton() {
    const fab = document.getElementById('fab-whatsapp');
    
    // Click handler
    fab?.addEventListener('click', () => {
      window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`, '_blank');
    });
    
    // Show/hide based on scroll
    window.addEventListener('scroll', utils.debounce(() => {
      if (window.pageYOffset > 500) {
        fab?.classList.add('show');
      } else {
        fab?.classList.remove('show');
      }
    }, 100));
  }

  setupParallax() {
    if (!utils.isMobile()) {
      const backgroundImg = document.querySelector('.background-img');
      
      window.addEventListener('scroll', utils.throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (backgroundImg) {
          backgroundImg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
      }, 10));
    }
  }

  // Animate elements when they come into view
  animateOnScroll(elements, animationClass) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
  }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create instances
  const languageManager = new LanguageManager();
  const navigationManager = new NavigationManager();
  const servicesManager = new ServicesManager(languageManager);
  const appointmentManager = new AppointmentManager(languageManager);
  const animationsManager = new AnimationsManager(languageManager);
  
  // Setup WhatsApp buttons
  ['hero-whatsapp', 'contact-whatsapp'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`, '_blank');
    });
  });
  
  // Setup year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  
  // Hide preloader
  window.addEventListener('load', () => {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }, 500);
  });
  
  console.log('Al Rooliya website initialized successfully!');
});
