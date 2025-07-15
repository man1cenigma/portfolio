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
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.options = {
      numStars: options.numStars || 25,
      maxStars: options.maxStars || 60,
      ...options
    };
    this.stars = [];
    this.animationId = null;
    
    if (this.canvas && this.ctx) {
      this.init();
    }
  }

  init() {
    this.setupCanvas();
    this.generateStars();
    this.startAnimation();
  }

  setupCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Update canvas size on resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
  }

  generateStars() {
    const { maxStars } = this.options;
    
    for (let i = 0; i < maxStars; i++) {
      this.stars.push({
        x: Utils.random(0, window.innerWidth),
        y: Utils.random(-100, -10),
        width: Utils.random(1.5, 3),
        height: Utils.random(40, 80),
        speed: Utils.random(2, 4),
        opacity: Utils.random(0.6, 1),
        type: i % 3 === 0 ? 'white' : (i % 5 === 0 ? 'dark' : 'normal'),
        resetY: Utils.random(-200, -50)
      });
    }
  }

  updateStars() {
    this.stars.forEach(star => {
      star.y += star.speed;
      
      // Reset star when it goes off screen
      if (star.y > window.innerHeight + 100) {
        star.x = Utils.random(0, window.innerWidth);
        star.y = star.resetY;
        star.speed = Utils.random(2, 4);
      }
    });
  }

  drawStars() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.stars.forEach(star => {
      this.ctx.save();
      
      // Set star color and glow based on type
      let color, glowColor;
      switch(star.type) {
        case 'white':
          color = '#ffffff';
          glowColor = '#ff2222';
          break;
        case 'dark':
          color = '#b30000';
          glowColor = '#ff2222';
          break;
        default:
          color = '#ff2222';
          glowColor = '#ff2222';
      }
      
      // Create gradient for star trail
      const gradient = this.ctx.createLinearGradient(
        star.x, star.y,
        star.x, star.y + star.height
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255, 34, 34, 0.1)');
      
      // Draw glow effect
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = glowColor;
      
      // Draw star
      this.ctx.globalAlpha = star.opacity;
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(star.x, star.y, star.width, star.height);
      
      this.ctx.restore();
    });
  }

  startAnimation() {
    const animate = () => {
      this.updateStars();
      this.drawStars();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
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
    this.components.starfall = new Starfall('starfall-canvas', {
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