// Animations Module
window.AnimationsManager = class {
  constructor() {
    this.observedElements = new Set();
    this.counters = new Map();
    this.particlesCanvas = null;
    this.particlesCtx = null;
    this.particles = [];
    this.animationId = null;
    
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupHeroParticles();
    this.setupLoadingAnimation();
    this.setupHoverEffects();
    this.setupEnhancedHeroAnimations();
    this.setupEnhancedServiceCards();
    
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 100,
        delay: 100
      });
    }
  }

  setupEnhancedServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
      // Add enhanced hover effects
      this.addEnhancedCardEffects(card, index);
      
      // Add tilt effect
      this.addTiltEffect(card);
      
      // Add icon animation on hover
      this.addIconAnimation(card);
      
      // Add reveal animation
      this.addRevealAnimation(card, index);
    });
  }

  addEnhancedCardEffects(card, index) {
    card.style.setProperty('--card-index', index);
    
    card.addEventListener('mouseenter', () => {
      // Enhanced glow effect
      card.style.setProperty('--glow-opacity', '1');
      card.classList.add('card-elevated');
      
      // Subtle shake animation for icon
      const icon = card.querySelector('.service-icon i');
      if (icon) {
        icon.classList.add('icon-bounce');
      }
      
      // Scale up the card content
      const cardContent = card.querySelector('.service-content');
      if (cardContent) {
        cardContent.style.transform = 'scale(1.02)';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--glow-opacity', '0');
      card.classList.remove('card-elevated');
      
      const icon = card.querySelector('.service-icon i');
      if (icon) {
        icon.classList.remove('icon-bounce');
      }
      
      const cardContent = card.querySelector('.service-content');
      if (cardContent) {
        cardContent.style.transform = 'scale(1)';
      }
    });

    // Add click animation
    card.addEventListener('mousedown', () => {
      card.style.transform = 'scale(0.98) translateY(2px)';
    });

    card.addEventListener('mouseup', () => {
      card.style.transform = '';
    });
  }

  addTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }

  addIconAnimation(card) {
    const icon = card.querySelector('.service-icon');
    if (!icon) return;

    card.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      icon.style.filter = 'brightness(1.2)';
    });

    card.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
      icon.style.filter = 'brightness(1)';
    });
  }

  addRevealAnimation(card, index) {
    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.classList.add('service-card-revealed');
            
            // Add stagger effect to card elements
            const elements = card.querySelectorAll('.service-icon, .service-title, .service-description, .service-features');
            elements.forEach((element, i) => {
              setTimeout(() => {
                element.classList.add('element-revealed');
              }, i * 100);
            });
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(card);
  }

  setupEnhancedHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Enhanced text animations with typewriter effect
    this.setupTypewriterEffect();
    
    // Floating elements animation
    this.setupFloatingElements();
    
    // Interactive background effects
    this.setupInteractiveBackground();
    
    // Enhanced CTA button animations
    this.setupEnhancedCTAAnimations();
    
    // Hero stats counter with enhanced effects
    this.setupEnhancedStatsAnimation();
  }

  setupTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    
    if (heroTitle) {
      this.createTypewriterEffect(heroTitle, 50);
    }
    
    if (heroSubtitle) {
      setTimeout(() => {
        this.createTypewriterEffect(heroSubtitle, 30);
      }, 1000);
    }
  }

  createTypewriterEffect(element, speed) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      } else {
        element.classList.add('typing-complete');
      }
    };
    
    typeWriter();
  }

  setupFloatingElements() {
    // Add floating animation to hero elements
    const floatingElements = document.querySelectorAll('.hero-stats .stat-item, .hero-actions .btn');
    
    floatingElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 200}ms`;
      element.classList.add('floating-animation');
    });
  }

  setupInteractiveBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Mouse move parallax effect
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
      
      // Enhanced particle interaction
      if (this.particles.length > 0) {
        this.particles.forEach(particle => {
          const distanceX = e.clientX - particle.x;
          const distanceY = e.clientY - particle.y;
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
          
          if (distance < 100) {
            particle.speedX += (distanceX / distance) * 0.1;
            particle.speedY += (distanceY / distance) * 0.1;
            particle.opacity = Math.min(particle.opacity + 0.1, 0.8);
          }
        });
      }
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = 'translate(0, 0)';
      }
    });
  }

  setupEnhancedCTAAnimations() {
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    
    ctaButtons.forEach(button => {
      // Add magnetic effect
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px) scale(1.05)';
        button.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '';
      });
      
      // Add pulse animation on hover
      button.addEventListener('mouseenter', () => {
        button.classList.add('pulse-animation');
      });
      
      button.addEventListener('mouseleave', () => {
        button.classList.remove('pulse-animation');
      });
    });
  }

  setupEnhancedStatsAnimation() {
    const statsContainer = document.querySelector('.hero-stats');
    if (!statsContainer) return;

    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-item');
          
          statItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.animation = `bounceInUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
              
              // Enhanced counter animation
              const counter = item.querySelector('[data-count]');
              if (counter && !this.counters.has(counter)) {
                const target = parseInt(counter.getAttribute('data-count'));
                this.animateEnhancedCounter(counter, target);
                this.counters.set(counter, true);
              }
            }, index * 150);
          });
        }
      });
    });

    observer.observe(statsContainer);
  }

  animateEnhancedCounter(element, target, duration = 2500) {
    const startTime = performance.now();
    const startValue = 0;

    // Add counting sound effect (visual feedback)
    element.style.color = 'var(--primary)';
    
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Enhanced easing with bounce effect
      const easeOutBounce = progress < 1 ? 1 - Math.pow(1 - progress, 4) : 1;
      const currentValue = Math.round(startValue + (target - startValue) * easeOutBounce);

      element.textContent = currentValue.toLocaleString();
      
      // Add scale effect during counting
      const scale = 1 + (Math.sin(progress * Math.PI * 8) * 0.05);
      element.style.transform = `scale(${scale})`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
        element.style.transform = 'scale(1)';
        element.style.color = '';
        
        // Add completion effect
        element.style.animation = 'counterComplete 0.5s ease-out';
      }
    };

    requestAnimationFrame(animate);
  }

  setupScrollAnimations() {
    // Create intersection observer for scroll animations
    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, {
      rootMargin: '-10% 0px -10% 0px',
      threshold: 0.1
    });

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
      observer.observe(el);
      el.classList.add('animation-ready');
    });

    // Auto-detect elements that should be animated
    this.autoDetectAnimationTargets().forEach(el => {
      observer.observe(el);
    });
  }

  autoDetectAnimationTargets() {
    const selectors = [
      '.feature-card',
      '.service-card',
      '.contact-card',
      '.schedule-item',
      '.hero-stats .stat-item'
    ];

    const elements = [];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (!this.observedElements.has(el)) {
          elements.push(el);
          this.observedElements.add(el);
        }
      });
    });

    return elements;
  }

  animateElement(element) {
    if (element.classList.contains('animated')) return;

    element.classList.add('animated');

    // Different animations based on element type
    if (element.classList.contains('stat-item')) {
      this.animateStatItem(element);
    } else if (element.classList.contains('feature-card') || 
               element.classList.contains('service-card') || 
               element.classList.contains('contact-card')) {
      this.animateCard(element);
    } else {
      this.animateGeneric(element);
    }
  }

  animateStatItem(element) {
    const numberElement = element.querySelector('[data-count]');
    if (numberElement && !this.counters.has(numberElement)) {
      const target = parseInt(numberElement.getAttribute('data-count'));
      this.animateCounter(numberElement, target);
      this.counters.set(numberElement, true);
    }

    // Animate the whole stat item
    element.style.animation = 'slideInUp 0.6s ease-out forwards';
  }

  animateCard(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px) scale(0.95)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

    // Use requestAnimationFrame to ensure the initial state is applied
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1)';
    });

    // Add hover effect enhancement after animation
    setTimeout(() => {
      element.addEventListener('mouseenter', () => {
        if (!element.classList.contains('hover-enhanced')) {
          element.classList.add('hover-enhanced');
          element.style.transform = 'translateY(-8px) scale(1.02)';
        }
      });

      element.addEventListener('mouseleave', () => {
        element.classList.remove('hover-enhanced');
        element.style.transform = 'translateY(0) scale(1)';
      });
    }, 600);
  }

  animateGeneric(element) {
    element.style.animation = 'fadeInUp 0.6s ease-out forwards';
  }

  animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (target - startValue) * easeOut);

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(animate);
  }

  setupCounterAnimations() {
    // Additional counter elements that might be added dynamically
    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-count'));
          
          if (!this.counters.has(element)) {
            this.animateCounter(element, target);
            this.counters.set(element, true);
          }
        }
      });
    });

    // Observe all counter elements
    document.querySelectorAll('[data-count]').forEach(el => {
      observer.observe(el);
    });
  }

  setupHeroParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    // Create canvas for particles
    this.particlesCanvas = document.createElement('canvas');
    this.particlesCanvas.style.position = 'absolute';
    this.particlesCanvas.style.top = '0';
    this.particlesCanvas.style.left = '0';
    this.particlesCanvas.style.width = '100%';
    this.particlesCanvas.style.height = '100%';
    this.particlesCanvas.style.pointerEvents = 'none';
    this.particlesCanvas.style.zIndex = '1';

    this.particlesCtx = this.particlesCanvas.getContext('2d');

    const heroBackground = heroSection.querySelector('.hero-background');
    if (heroBackground) {
      heroBackground.appendChild(this.particlesCanvas);
    }

    this.initializeParticles();
    this.startParticleAnimation();

    // Handle resize
    window.addEventListener('resize', () => {
      this.resizeParticlesCanvas();
    });
  }

  initializeParticles() {
    this.resizeParticlesCanvas();

    const numParticles = Math.min(50, Math.floor(window.innerWidth / 30));
    
    for (let i = 0; i < numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.particlesCanvas.width,
        y: Math.random() * this.particlesCanvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        color: this.getParticleColor()
      });
    }
  }

  getParticleColor() {
    const colors = ['#dc2626', '#f59e0b', '#22c55e'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  resizeParticlesCanvas() {
    if (!this.particlesCanvas) return;

    const rect = this.particlesCanvas.parentElement.getBoundingClientRect();
    this.particlesCanvas.width = rect.width;
    this.particlesCanvas.height = rect.height;
  }

  startParticleAnimation() {
    const animate = () => {
      if (!this.particlesCanvas || !this.particlesCtx) return;

      this.particlesCtx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);

      this.particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > this.particlesCanvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = this.particlesCanvas.width;
        if (particle.y > this.particlesCanvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = this.particlesCanvas.height;

        // Draw particle
        this.particlesCtx.save();
        this.particlesCtx.globalAlpha = particle.opacity;
        this.particlesCtx.fillStyle = particle.color;
        this.particlesCtx.beginPath();
        this.particlesCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.particlesCtx.fill();
        this.particlesCtx.restore();
      });

      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  setupLoadingAnimation() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Hide loader after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        
        // FORCE LANGUAGE UPDATE WHEN LOADER IS HIDDEN
        if (window.languageManager) {
          console.log('Forcing language update after loader hidden...');
          window.languageManager.updateLanguageElements();
        }
        
        // Remove loader from DOM after animation
        setTimeout(() => {
          if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
          }
          
          // FINAL LANGUAGE UPDATE AFTER LOADER REMOVAL
          if (window.languageManager) {
            console.log('Final language update after loader removal...');
            window.languageManager.updateLanguageElements();
          }
        }, 500);
      }, 1000); // Show loader for at least 1 second
    });

    // Fallback: hide loader after 5 seconds regardless
    setTimeout(() => {
      if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        
        // FALLBACK LANGUAGE UPDATE
        if (window.languageManager) {
          console.log('Fallback language update after 5 seconds...');
          window.languageManager.updateLanguageElements();
        }
      }
    }, 5000);

    // Setup skeleton loading for content sections
    this.setupSkeletonLoading();
  }

  setupSkeletonLoading() {
    // Create skeleton placeholders for cards that might load dynamically
    this.createSkeletonPlaceholders();
    
    // Handle lazy loading of sections
    this.handleLazyLoading();
  }

  createSkeletonPlaceholders() {
    const sections = document.querySelectorAll('.services-grid, .about-features');
    
    sections.forEach(section => {
      // Add skeleton loading class temporarily
      section.classList.add('skeleton-loading');
      
      // Remove skeleton after a short delay to simulate loading
      setTimeout(() => {
        section.classList.remove('skeleton-loading');
        section.classList.add('content-loaded');
        
        // Animate children with stagger effect
        const children = section.children;
        Array.from(children).forEach((child, index) => {
          child.style.animationDelay = `${index * 100}ms`;
          child.classList.add('fade-in-up');
        });
      }, 800 + Math.random() * 400);
    });
  }

  handleLazyLoading() {
    // Simulate content loading states for better UX
    const contentSections = document.querySelectorAll('section[id]');
    
    const loadingObserver = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('content-initialized')) {
          this.initializeSection(entry.target);
          entry.target.classList.add('content-initialized');
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    contentSections.forEach(section => {
      loadingObserver.observe(section);
    });
  }

  initializeSection(section) {
    // Add loading state
    section.classList.add('section-loading');
    
    // Simulate content loading
    setTimeout(() => {
      section.classList.remove('section-loading');
      section.classList.add('section-loaded');
      
      // Trigger stagger animations for section content
      const animatableElements = section.querySelectorAll('.service-card, .feature-card, .contact-card, .stat-item');
      animatableElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 150}ms`;
        element.classList.add('slide-in-fade');
      });
    }, 200);
  }

  // Enhanced page transition system
  setupPageTransitions() {
    // Add smooth transitions between sections
    const sectionLinks = document.querySelectorAll('a[href^="#"]');
    
    sectionLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        this.transitionToSection(targetId);
      });
    });
  }

  transitionToSection(sectionId) {
    const currentSection = document.querySelector('section.active') || document.querySelector('section');
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) return;
    
    // Add transition classes
    if (currentSection) {
      currentSection.classList.add('section-exit');
    }
    
    targetSection.classList.add('section-enter');
    
    // Smooth scroll to target
    utils.scrollToElement(sectionId);
    
    // Clean up classes after animation
    setTimeout(() => {
      if (currentSection) {
        currentSection.classList.remove('section-exit', 'active');
      }
      targetSection.classList.remove('section-enter');
      targetSection.classList.add('active');
    }, 600);
  }

  setupHoverEffects() {
    // Enhanced hover effects for interactive elements
    const interactiveElements = document.querySelectorAll(
      '.btn, .nav-link, .service-card, .feature-card, .contact-card'
    );

    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.addHoverEffect(e.target);
      });

      element.addEventListener('mouseleave', (e) => {
        this.removeHoverEffect(e.target);
      });
    });

    // Add ripple effects to clickable elements
    this.setupRippleEffects();
    
    // Add micro-interactions
    this.setupMicroInteractions();
  }

  setupRippleEffects() {
    const rippleElements = document.querySelectorAll('.btn, .nav-link, .service-card, .feature-card');
    
    rippleElements.forEach(element => {
      element.addEventListener('click', (e) => {
        this.createRipple(e);
      });
    });
  }

  createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;
    
    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
      button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  setupMicroInteractions() {
    // Add subtle animations to form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.style.transform = 'scale(1.02)';
      });
      
      input.addEventListener('blur', (e) => {
        e.target.style.transform = 'scale(1)';
      });
    });

    // Add click feedback to all interactive elements
    const clickableElements = document.querySelectorAll('button, a, .clickable');
    clickableElements.forEach(element => {
      element.addEventListener('mousedown', (e) => {
        e.target.style.transform = 'scale(0.98)';
      });
      
      element.addEventListener('mouseup', (e) => {
        e.target.style.transform = '';
      });
      
      element.addEventListener('mouseleave', (e) => {
        e.target.style.transform = '';
      });
    });

    // Add parallax effect to hero background
    this.setupParallaxEffect();
  }

  setupParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;
      
      const heroBackground = heroSection.querySelector('.hero-background');
      if (heroBackground) {
        heroBackground.style.transform = `translateY(${parallax}px)`;
      }
    });
  }

  addHoverEffect(element) {
    if (element.classList.contains('btn')) {
      element.style.transform = 'translateY(-2px) scale(1.02)';
    } else if (element.classList.contains('nav-link')) {
      element.style.transform = 'scale(1.05)';
    } else if (element.classList.contains('service-card') || 
               element.classList.contains('feature-card') || 
               element.classList.contains('contact-card')) {
      element.style.transform = 'translateY(-8px) scale(1.02)';
      
      // Add shadow animation
      element.style.boxShadow = 'var(--shadow-2xl)';
    }
  }

  removeHoverEffect(element) {
    element.style.transform = '';
    element.style.boxShadow = '';
  }

  // Scroll-triggered animations for specific elements
  setupCustomScrollAnimations() {
    const elements = [
      {
        selector: '.hero-title',
        animation: 'slideInDown',
        delay: 0
      },
      {
        selector: '.hero-subtitle',
        animation: 'slideInUp',
        delay: 200
      },
      {
        selector: '.hero-actions',
        animation: 'fadeIn',
        delay: 400
      },
      {
        selector: '.hero-stats',
        animation: 'slideInUp',
        delay: 600
      }
    ];

    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const config = elements.find(el => element.matches(el.selector));
          
          if (config && !element.classList.contains('animated')) {
            setTimeout(() => {
              element.style.animation = `${config.animation} 0.8s ease-out forwards`;
              element.classList.add('animated');
            }, config.delay);
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    });

    elements.forEach(config => {
      document.querySelectorAll(config.selector).forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
      });
    });
  }

  // Page transition animations
  setupPageTransitions() {
    // Animate page sections when navigating
    document.addEventListener('sectionchange', (e) => {
      const targetSection = document.getElementById(e.detail.section);
      if (targetSection) {
        this.animateSection(targetSection);
      }
    });
  }

  animateSection(section) {
    // Add entering animation
    section.style.animation = 'slideInRight 0.5s ease-out forwards';
  }

  // Cleanup method
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.particles = [];
    this.counters.clear();
    this.observedElements.clear();
    
    if (this.particlesCanvas && this.particlesCanvas.parentNode) {
      this.particlesCanvas.parentNode.removeChild(this.particlesCanvas);
    }
  }

  // Performance optimization
  shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Apply reduced motion settings
  applyReducedMotion() {
    if (this.shouldReduceMotion()) {
      // Disable particle animations
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      
      // Reduce animation durations
      document.documentElement.style.setProperty('--transition', 'none');
      
      // Disable AOS animations
      if (typeof AOS !== 'undefined') {
        AOS.init({
          disable: true
        });
      }
    }
  }
}

// Add animation keyframes
utils.addCSS(`
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bounceIn {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Hover animations */
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift:hover {
    transform: translateY(-4px);
  }

  .hover-scale {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-scale:hover {
    transform: scale(1.02);
  }

  /* Animation utilities */
  .animation-ready {
    opacity: 0;
  }

  .animation-ready.animated {
    opacity: 1;
  }

  /* Ripple effect */
  .ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes ripple-animation {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(1);
      opacity: 0;
    }
  }

  /* Micro-interaction enhancements */
  input, textarea, select {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    border-color: var(--primary);
  }

  button, a, .clickable {
    transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  /* Loading pulse animation */
  .pulse-loading {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Stagger animation for lists */
  .stagger-animation > * {
    opacity: 0;
    transform: translateY(20px);
    animation: stagger-in 0.6s ease-out forwards;
  }

  .stagger-animation > *:nth-child(1) { animation-delay: 0.1s; }
  .stagger-animation > *:nth-child(2) { animation-delay: 0.2s; }
  .stagger-animation > *:nth-child(3) { animation-delay: 0.3s; }
  .stagger-animation > *:nth-child(4) { animation-delay: 0.4s; }
  .stagger-animation > *:nth-child(5) { animation-delay: 0.5s; }
  .stagger-animation > *:nth-child(6) { animation-delay: 0.6s; }

  @keyframes stagger-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Enhanced focus indicators */
  .focus-ring:focus {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
    border-radius: var(--radius-md);
  }

  /* Skeleton loading animations */
  .skeleton-loading .service-card,
  .skeleton-loading .feature-card,
  .skeleton-loading .contact-card {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-lg);
    min-height: 200px;
  }

  [data-theme="dark"] .skeleton-loading .service-card,
  [data-theme="dark"] .skeleton-loading .feature-card,
  [data-theme="dark"] .skeleton-loading .contact-card {
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 200% 100%;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-loading * {
    color: transparent !important;
    background-color: transparent !important;
    border-color: transparent !important;
  }

  /* Content loading states */
  .content-loaded {
    animation: content-reveal 0.6s ease-out;
  }

  @keyframes content-reveal {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Section transitions */
  .section-loading {
    opacity: 0.7;
    pointer-events: none;
  }

  .section-loaded {
    animation: section-fade-in 0.5s ease-out;
  }

  @keyframes section-fade-in {
    from {
      opacity: 0.7;
    }
    to {
      opacity: 1;
    }
  }

  .section-enter {
    animation: section-slide-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .section-exit {
    animation: section-slide-out 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes section-slide-in {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes section-slide-out {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(-30px);
    }
  }

  /* Enhanced fade animations */
  .fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .slide-in-fade {
    animation: slideInFade 0.6s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
  }

  @keyframes slideInFade {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Progressive loading animation */
  .progressive-load > * {
    opacity: 0;
    transform: translateY(20px);
    animation: progressive-fade-in 0.6s ease-out forwards;
  }

  .progressive-load > *:nth-child(1) { animation-delay: 0.1s; }
  .progressive-load > *:nth-child(2) { animation-delay: 0.2s; }
  .progressive-load > *:nth-child(3) { animation-delay: 0.3s; }
  .progressive-load > *:nth-child(4) { animation-delay: 0.4s; }
  .progressive-load > *:nth-child(5) { animation-delay: 0.5s; }

  @keyframes progressive-fade-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Enhanced loading spinner */
  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--primary);
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Enhanced Hero Animations */
  .hero-title, .hero-subtitle {
    opacity: 0;
  }

  .typing-complete {
    position: relative;
  }

  .typing-complete::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--primary);
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  /* Floating animation for hero elements */
  .floating-animation {
    animation: float 3s ease-in-out infinite;
  }

  .floating-animation:nth-child(even) {
    animation-delay: 1.5s;
    animation-direction: reverse;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  /* Enhanced CTA button animations */
  .pulse-animation {
    animation: enhanced-pulse 1.5s infinite;
  }

  @keyframes enhanced-pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
    }
  }

  /* Bounce in up animation for stats */
  @keyframes bounceInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 3000px, 0) scaleY(5);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, -20px, 0) scaleY(0.9);
    }
    75% {
      transform: translate3d(0, 10px, 0) scaleY(0.95);
    }
    90% {
      transform: translate3d(0, -5px, 0) scaleY(0.985);
    }
    to {
      transform: translate3d(0, 0, 0) scaleY(1);
    }
  }

  /* Counter completion effect */
  @keyframes counterComplete {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
      color: var(--primary);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Hero content interactive parallax */
  .hero-content {
    transition: transform 0.1s ease-out;
  }

  /* Enhanced particle effects */
  .hero-background {
    overflow: hidden;
    position: relative;
  }

  .hero-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(var(--primary-rgb), 0.03), transparent);
    animation: shimmer 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  /* Advanced hero text effects */
  .hero-title {
    position: relative;
    background: linear-gradient(135deg, var(--text-primary), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    position: relative;
  }

  .hero-subtitle::before {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    animation: underline-expand 2s ease-out 2s forwards;
  }

  @keyframes underline-expand {
    to {
      width: 100%;
    }
  }

  /* Enhanced magnetic button effect */
  .btn {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .btn:hover::before {
    width: 300px;
    height: 300px;
  }

  /* Hero stats enhancement */
  .hero-stats {
    perspective: 1000px;
  }

  .hero-stats .stat-item {
    transform-style: preserve-3d;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-stats .stat-item:hover {
    transform: rotateY(10deg) rotateX(10deg) translateZ(20px);
  }

  /* Enhanced Service Card Designs */
  .service-card {
    --glow-opacity: 0;
    position: relative;
    transform-style: preserve-3d;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .service-card::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--primary), var(--secondary), var(--primary));
    background-size: 200% 200%;
    opacity: var(--glow-opacity);
    z-index: -1;
    border-radius: inherit;
    animation: gradient-shift 3s ease infinite;
    transition: opacity 0.3s ease;
  }

  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .service-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
    pointer-events: none;
  }

  .service-card:hover::after {
    left: 100%;
  }

  .card-elevated {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 20px rgba(var(--primary-rgb), 0.2);
  }

  /* Service card reveal animations */
  .service-card {
    opacity: 0;
    transform: translateY(30px) rotateX(10deg);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .service-card-revealed {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }

  .service-card .service-icon,
  .service-card .service-title,
  .service-card .service-description,
  .service-card .service-features {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .element-revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }

  /* Enhanced service icon effects */
  .service-icon {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(135deg, var(--primary-light), var(--primary));
    border-radius: 50%;
    padding: var(--space-lg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .service-icon::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    border-radius: 50%;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  .service-card:hover .service-icon::before {
    opacity: 0.3;
  }

  .service-icon i {
    font-size: 2rem;
    color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .icon-bounce {
    animation: icon-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  @keyframes icon-bounce {
    0%, 20%, 60%, 100% {
      transform: translateY(0) scale(1);
    }
    40% {
      transform: translateY(-10px) scale(1.1);
    }
    80% {
      transform: translateY(-5px) scale(1.05);
    }
  }

  /* Enhanced service content */
  .service-content {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .service-title {
    background: linear-gradient(135deg, var(--text-primary), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
  }

  .service-title::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  .service-card:hover .service-title::after {
    width: 100%;
  }

  .service-description {
    color: var(--text-secondary);
    line-height: 1.6;
    transition: color 0.3s ease;
  }

  .service-card:hover .service-description {
    color: var(--text-primary);
  }

  /* Service features enhancement */
  .service-features {
    list-style: none;
    padding: 0;
  }

  .service-features li {
    position: relative;
    padding-left: var(--space-lg);
    margin-bottom: var(--space-sm);
    transition: all 0.3s ease;
    opacity: 0.8;
  }

  .service-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 0;
    color: var(--primary);
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .service-card:hover .service-features li {
    opacity: 1;
    transform: translateX(5px);
  }

  .service-card:hover .service-features li::before {
    color: var(--secondary);
    transform: scale(1.2);
  }

  /* Progressive enhancement for service grid */
  .services-grid {
    perspective: 1000px;
  }

  .services-grid .service-card {
    backface-visibility: hidden;
  }

  /* Book button enhancement */
  .service-card .btn {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .service-card .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }

  .service-card .btn:hover::before {
    width: 300px;
    height: 300px;
  }

  .service-card .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(var(--primary-rgb), 0.3);
  }

  /* Dark theme enhancements */
  [data-theme="dark"] .service-card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  [data-theme="dark"] .service-card::after {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  }

  [data-theme="dark"] .card-elevated {
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(var(--primary-rgb), 0.2);
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  /* Reduce motion support */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
    
    .ripple-effect {
      display: none;
    }
  }
`);

// Initialize animations manager
window.addEventListener('DOMContentLoaded', () => {
  window.animationsManager = new AnimationsManager();
});