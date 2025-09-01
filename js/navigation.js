// Navigation Module
window.NavigationManager = class {
  constructor() {
    this.navbar = null;
    this.navLinks = [];
    this.mobileToggle = null;
    this.scrollToTopBtn = null;
    this.lastScrollY = 0;
    this.isNavbarVisible = true;
    
    this.init();
  }

  init() {
    this.navbar = document.getElementById('navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.mobileToggle = document.getElementById('mobile-toggle');
    this.scrollToTopBtn = document.getElementById('scroll-to-top');
    this.scrollProgress = document.getElementById('scroll-progress');
    
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupActiveSection();
    this.setupScrollToTop();
    this.setupScrollProgress();
    
    // Handle mobile navigation
    if (this.mobileToggle) {
      this.setupMobileNavigation();
    }
  }

  setupNavigation() {
    // Add click handlers to nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        this.navigateToSection(targetId);
        
        // Close mobile menu if open
        this.closeMobileMenu();
      });
    });
  }

  setupScrollEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleScroll() {
    const currentScrollY = window.pageYOffset;
    
    // Hide/show navbar on scroll
    if (currentScrollY > 100) {
      if (currentScrollY > this.lastScrollY && this.isNavbarVisible) {
        // Scrolling down - hide navbar
        this.hideNavbar();
      } else if (currentScrollY < this.lastScrollY && !this.isNavbarVisible) {
        // Scrolling up - show navbar
        this.showNavbar();
      }
    } else {
      // Near top - always show navbar
      this.showNavbar();
    }
    
    this.lastScrollY = currentScrollY;
    
    // Update navbar background opacity
    this.updateNavbarBackground(currentScrollY);
    
    // Update scroll to top button
    this.updateScrollToTop(currentScrollY);
  }

  hideNavbar() {
    if (this.navbar) {
      this.navbar.style.transform = 'translateY(-100%)';
      this.isNavbarVisible = false;
    }
  }

  showNavbar() {
    if (this.navbar) {
      this.navbar.style.transform = 'translateY(0)';
      this.isNavbarVisible = true;
    }
  }

  updateNavbarBackground(scrollY) {
    // Disabled - let CSS handle all navbar styling to prevent conflicts
    // The navbar should stay dark through CSS only
    return;
  }

  setupActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = utils.createIntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveNavLink(entry.target.id);
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    
    sections.forEach(section => {
      observer.observe(section);
    });
  }

  setActiveNavLink(sectionId) {
    // Remove active class from all links
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current section link
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`) || 
                      document.querySelector(`[href="#${sectionId}"]`);
    
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  navigateToSection(sectionId) {
    utils.scrollToElement(sectionId);
    
    // Update active state immediately
    this.setActiveNavLink(sectionId);
    
    // Update URL without page reload
    if (history.pushState) {
      const newUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
      history.pushState(null, '', newUrl);
    }
  }

  setupScrollToTop() {
    if (!this.scrollToTopBtn) return;
    
    this.scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  updateScrollToTop(scrollY) {
    if (!this.scrollToTopBtn) return;
    
    if (scrollY > 500) {
      this.scrollToTopBtn.classList.add('visible');
    } else {
      this.scrollToTopBtn.classList.remove('visible');
    }
  }

  setupScrollProgress() {
    if (!this.scrollProgress) return;
    
    window.addEventListener('scroll', () => {
      this.updateScrollProgress();
    });
  }

  updateScrollProgress() {
    if (!this.scrollProgress) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
    this.scrollProgress.style.width = Math.min(Math.max(scrollPercent, 0), 100) + '%';
  }

  setupMobileNavigation() {
    // Create mobile menu
    this.createMobileMenu();
    
    // Toggle button event
    this.mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && 
          mobileMenu.classList.contains('open') && 
          !mobileMenu.contains(e.target) && 
          !this.mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  createMobileMenu() {
    // Check if mobile menu already exists
    if (document.getElementById('mobile-menu')) return;
    
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'mobile-menu';
    
    // Create menu content
    const menuContent = document.createElement('div');
    menuContent.className = 'mobile-menu-content';
    
    // Add navigation links
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      const mobileNavLinks = navMenu.cloneNode(true);
      mobileNavLinks.className = 'mobile-nav-links';
      
      // Add click handlers to mobile links
      const mobileLinks = mobileNavLinks.querySelectorAll('.nav-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          this.navigateToSection(targetId);
          this.closeMobileMenu();
        });
      });
      
      menuContent.appendChild(mobileNavLinks);
    }
    
    // Add CTA button
    const ctaButton = document.createElement('a');
    ctaButton.href = '#appointment';
    ctaButton.className = 'btn btn-primary btn-lg mobile-cta';
    ctaButton.innerHTML = `
      <i class="fas fa-calendar-check"></i>
      <span class="lang en">Book Now</span>
      <span class="lang ar">احجز الآن</span>
    `;
    
    ctaButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigateToSection('appointment');
      this.closeMobileMenu();
    });
    
    menuContent.appendChild(ctaButton);
    
    mobileMenu.appendChild(menuContent);
    document.body.appendChild(mobileMenu);
    
    // Update language elements
    if (window.languageManager) {
      window.languageManager.updateLanguageElements();
    }
  }

  toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    
    const isOpen = mobileMenu.classList.contains('open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
    
    // Animate toggle button
    this.animateMobileToggle(true);
    
    // Focus first link for accessibility
    setTimeout(() => {
      const firstLink = mobileMenu.querySelector('.nav-link');
      if (firstLink) firstLink.focus();
    }, 300);
  }

  closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;
    
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    
    // Animate toggle button
    this.animateMobileToggle(false);
  }

  animateMobileToggle(isOpen) {
    if (!this.mobileToggle) return;
    
    const spans = this.mobileToggle.querySelectorAll('span');
    
    if (isOpen) {
      // Transform to X
      spans[0].style.transform = 'rotate(45deg) translateY(6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-6px)';
    } else {
      // Transform back to hamburger
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  // Handle browser back/forward buttons
  handlePopState() {
    window.addEventListener('popstate', (e) => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        this.navigateToSection(hash);
      }
    });
  }

  // Smooth scroll to hash on page load
  handleInitialHash() {
    window.addEventListener('load', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Delay to ensure page is fully loaded
        setTimeout(() => {
          this.navigateToSection(hash);
        }, 500);
      }
    });
  }

  // Update navigation for theme changes
  updateForTheme(theme) {
    // Always use dark theme since light theme is removed
    const currentScrollY = window.pageYOffset;
    this.updateNavbarBackground(currentScrollY);
  }

  // Keyboard navigation support
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Alt + arrow keys for section navigation
      if (e.altKey && !e.ctrlKey && !e.shiftKey) {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentSection = sections.find(section => 
          section.getBoundingClientRect().top <= 100 && 
          section.getBoundingClientRect().bottom > 100
        );
        
        if (currentSection) {
          const currentIndex = sections.indexOf(currentSection);
          let targetIndex = -1;
          
          if (e.key === 'ArrowUp' && currentIndex > 0) {
            targetIndex = currentIndex - 1;
          } else if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            targetIndex = currentIndex + 1;
          }
          
          if (targetIndex >= 0) {
            e.preventDefault();
            this.navigateToSection(sections[targetIndex].id);
          }
        }
      }
    });
  }
}

// Add mobile menu CSS
utils.addCSS(`
  .mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background: var(--bg-primary);
    box-shadow: -10px 0 30px rgba(0,0,0,0.3);
    z-index: 1060;
    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
  }

  .mobile-menu.open {
    right: 0;
  }

  .mobile-menu-content {
    padding: var(--space-xl) var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    min-height: 100%;
  }

  .mobile-nav-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .mobile-nav-links .nav-link {
    padding: var(--space-md);
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: var(--radius-lg);
    transition: var(--transition);
  }

  .mobile-nav-links .nav-link:hover,
  .mobile-nav-links .nav-link.active {
    background: var(--primary-light);
    color: var(--primary);
  }

  .mobile-cta {
    margin-top: auto;
    justify-content: center;
  }

  body.menu-open {
    overflow: hidden;
  }

  @media (min-width: 969px) {
    .mobile-menu {
      display: none;
    }
  }
`);

// Initialize navigation manager
window.addEventListener('DOMContentLoaded', () => {
  window.navigationManager = new NavigationManager();
});