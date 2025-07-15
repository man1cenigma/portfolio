// ===== UTILITY FUNCTIONS =====
const Utils = {
  lerp(a, b, n) {
    return a + (b - a) * n;
  },
  
  setEye(eye, x, y, scale, bg) {
    if (eye) {
      eye.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
      eye.style.background = bg;
    }
  },
  
  random(min, max) {
    return Math.random() * (max - min) + min;
  },
  
  debounce(func, wait) {
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
};

// ===== STARFALL ANIMATION =====
class Starfall {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      numStars: options.numStars || 25,
      maxStars: options.maxStars || 60,
      ...options
    };
    
    if (this.container) {
      this.init();
    }
  }

  init() {
    this.generateStars();
  }

  generateStars() {
    const { numStars, maxStars } = this.options;
    
    // Generate stars with randomized properties
    for (let i = 0; i < maxStars; i++) {
      const star = document.createElement('div');
      star.className = 'falling-star';
      
      // Randomize properties for natural distribution
      star.style.left = `${Utils.random(0, 100)}vw`;
      star.style.width = `${Utils.random(1.5, 3)}px`;
      star.style.height = `${Utils.random(40, 80)}px`;
      star.style.animationDuration = `${Utils.random(2, 3.5)}s`;
      star.style.animationDelay = `${Utils.random(0, 2)}s`;
      
      this.container.appendChild(star);
    }
  }
}

// ===== SHARINGAN EYES =====
class SharinganEyes {
  constructor(containerId) {
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.eyeX = [this.mouseX, this.mouseX, this.mouseX];
    this.eyeY = [this.mouseY, this.mouseY, this.mouseY];
    this.containerId = containerId;
    
    this.sharinganFull = "url('data:image/svg+xml;utf8,<svg width=\"80\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"40\" cy=\"40\" r=\"32\" fill=\"%23ff2222\" opacity=\"0.7\"/><circle cx=\"40\" cy=\"40\" r=\"28\" stroke=\"black\" stroke-width=\"5\" fill=\"none\"/><circle cx=\"40\" cy=\"40\" r=\"8\" fill=\"black\"/><g><ellipse cx=\"40\" cy=\"18\" rx=\"5\" ry=\"8\" fill=\"black\" transform=\"rotate(0 40 40)\"/><ellipse cx=\"62\" cy=\"52\" rx=\"5\" ry=\"8\" fill=\"black\" transform=\"rotate(120 40 40)\"/><ellipse cx=\"18\" cy=\"52\" rx=\"5\" ry=\"8\" fill=\"black\" transform=\"rotate(240 40 40)\"/></g></svg>')";
    
    this.tomoe = [
      "url('data:image/svg+xml;utf8,<svg width=\"80\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"40\" cy=\"40\" r=\"32\" fill=\"%23ff2222\" opacity=\"0.7\"/><circle cx=\"40\" cy=\"40\" r=\"28\" stroke=\"black\" stroke-width=\"5\" fill=\"none\"/><circle cx=\"40\" cy=\"40\" r=\"8\" fill=\"black\"/><ellipse cx=\"40\" cy=\"18\" rx=\"5\" ry=\"8\" fill=\"black\"/></svg>')",
      "url('data:image/svg+xml;utf8,<svg width=\"80\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"40\" cy=\"40\" r=\"32\" fill=\"%23ff2222\" opacity=\"0.7\"/><circle cx=\"40\" cy=\"40\" r=\"28\" stroke=\"black\" stroke-width=\"5\" fill=\"none\"/><circle cx=\"40\" cy=\"40\" r=\"8\" fill=\"black\"/><ellipse cx=\"62\" cy=\"52\" rx=\"5\" ry=\"8\" fill=\"black\"/></svg>')",
      "url('data:image/svg+xml;utf8,<svg width=\"80\" height=\"80\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"40\" cy=\"40\" r=\"32\" fill=\"%23ff2222\" opacity=\"0.7\"/><circle cx=\"40\" cy=\"40\" r=\"28\" stroke=\"black\" stroke-width=\"5\" fill=\"none\"/><circle cx=\"40\" cy=\"40\" r=\"8\" fill=\"black\"/><ellipse cx=\"18\" cy=\"52\" rx=\"5\" ry=\"8\" fill=\"black\"/></svg>')"
    ];
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  animate() {
    this.eyeX[0] = Utils.lerp(this.eyeX[0], this.mouseX, 0.15);
    this.eyeY[0] = Utils.lerp(this.eyeY[0], this.mouseY, 0.15);
    this.eyeX[1] = Utils.lerp(this.eyeX[1], this.eyeX[0], 0.15);
    this.eyeY[1] = Utils.lerp(this.eyeY[1], this.eyeY[0], 0.15);
    this.eyeX[2] = Utils.lerp(this.eyeX[2], this.eyeX[1], 0.15);
    this.eyeY[2] = Utils.lerp(this.eyeY[2], this.eyeY[1], 0.15);

    const container = document.getElementById(this.containerId);
    if (container) {
      const centerX = this.eyeX[2];
      const centerY = this.eyeY[2];
      
      container.style.left = (centerX - 60) + 'px';
      container.style.top = (centerY - 60) + 'px';

      const dx = this.mouseX - centerX;
      const dy = this.mouseY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spread = Math.min(3, 1 + dist / 60);

      const eyes = [
        container.querySelector('.sharingan-eye-1'),
        container.querySelector('.sharingan-eye-2'),
        container.querySelector('.sharingan-eye-3')
      ];

      if (spread < 1.2) {
        eyes.forEach(eye => Utils.setEye(eye, 0, 0, 1, this.sharinganFull));
      } else {
        for (let i = 0; i < eyes.length; i++) {
          Utils.setEye(eyes[i], this.eyeX[i] - centerX, this.eyeY[i] - centerY, 0.9, this.tomoe[i]);
        }
      }
    }

    requestAnimationFrame(this.animate.bind(this));
  }
}

// ===== NAVIGATION =====
class Navigation {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-links a');
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateActiveLink();
  }

  bindEvents() {
    window.addEventListener('scroll', Utils.debounce(this.updateActiveLink.bind(this), 100));
    
    this.navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  handleNavClick(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  updateActiveLink() {
    let currentSection = '';
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) {
        currentSection = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

// ===== MAIN APP =====
class PortfolioApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    this.initializeComponents();
    this.bindEvents();
    console.log('Portfolio initialized successfully!');
  }

  initializeComponents() {
    this.components.navigation = new Navigation();
    this.components.starfall = new Starfall('.starfall', {
      numStars: 25,
      maxStars: 60
    });
    
    const eyeContainer = document.getElementById('sharingan-eye-container');
    if (eyeContainer) {
      this.components.sharinganEyes = new SharinganEyes('sharingan-eye-container');
    }
    
    const contactForm = document.getElementById('contact_form');
    if (contactForm) {
      this.initializeContactForm(contactForm);
    }
  }

  initializeContactForm(form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      if (this.validateForm(data)) {
        this.showConfirmation(form);
      }
    });
  }

  validateForm(data) {
    const requiredFields = ['name', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]?.trim());
    
    if (missingFields.length > 0) {
      this.showError(`Please fill in: ${missingFields.join(', ')}`);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }

  showConfirmation(form) {
    const confirmation = document.getElementById('confirmation');
    
    form.style.display = 'none';
    confirmation.style.display = 'block';
    
    setTimeout(() => {
      form.reset();
      form.style.display = 'block';
      confirmation.style.display = 'none';
    }, 5000);
  }

  showError(message) {
    let errorDiv = document.getElementById('form-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'form-error';
      errorDiv.style.cssText = `
        color: var(--primary-color);
        background: rgba(255, 34, 34, 0.1);
        padding: 0.5rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        border: 1px solid var(--primary-color);
      `;
      document.getElementById('contact_form').prepend(errorDiv);
    }
    
    errorDiv.textContent = message;
    setTimeout(() => errorDiv.remove(), 4000);
  }

  bindEvents() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        sidebar?.classList.remove('active');
      }
    });
  }
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});