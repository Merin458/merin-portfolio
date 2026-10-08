/**
 * Merin P Eldho — Personal Portfolio
 * Futuristic Cosmic Night Sky & Interactive Experiences
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Star & Cosmic Particle Field Canvas
  initStarCanvas();

  // 2. Navigation & Header Scroll State
  initNavigation();

  // 3. Theme Toggle (Dark Universe & Celestial Twilight)
  initThemeToggle();

  // 4. Certificate Lightbox Modal
  initCertificateModal();

  // 5. Quick Copy to Clipboard & Toast
  initClipboardActions();

  // 6. Interactive Skills Category Switcher
  initSkillsTabs();
});

/* ==========================================================================
   1. STAR & COSMIC PARTICLES CANVAS
   ========================================================================== */
function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  });

  const starCount = Math.floor((width * height) / 9000);
  let stars = [];

  class Star {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.6 + 0.3;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.speed = Math.random() * 0.25 + 0.05;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
      
      // Star colors: Soft Cyan, Violet, Warm Pearl
      const colors = ['#ffffff', '#c7d2fe', '#bae6fd', '#e9d5ff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speed;
      if (this.y < 0) {
        this.y = height;
        this.x = Math.random() * width;
      }

      this.alpha += this.twinkleSpeed * this.twinkleDirection;
      if (this.alpha > 0.95) {
        this.twinkleDirection = -1;
      } else if (this.alpha < 0.2) {
        this.twinkleDirection = 1;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initStars() {
    stars = [];
    const count = Math.min(starCount, 160);
    for (let i = 0; i < count; i++) {
      stars.push(new Star());
    }
  }

  initStars();

  // Mouse Parallax Effect
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / width - 0.5) * 15;
    mouseY = (e.clientY / height - 0.5) * 15;
  });

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.update();
      star.draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. NAVIGATION & SCROLL HIGHLIGHTING
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileNav = document.querySelector('.mobile-nav-overlay');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on clicking any link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active section spy using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   3. THEME TOGGLE (DARK / LIGHT CELESTIAL)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.querySelector('.theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('merin_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('merin_portfolio_theme', newTheme);
  });
}

/* ==========================================================================
   4. CERTIFICATE LIGHTBOX MODAL
   ========================================================================== */
function initCertificateModal() {
  const modal = document.getElementById('cert-modal');
  if (!modal) return;

  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalVerifyLink = modal.querySelector('#modal-verify-link');
  const closeBtn = modal.querySelector('.modal-close-btn');

  function openModal(title, imgSrc, verifyUrl) {
    modalTitle.textContent = title;
    modalImg.src = imgSrc;
    modalImg.alt = title;

    if (verifyUrl && verifyUrl.trim() !== '') {
      modalVerifyLink.href = verifyUrl;
      modalVerifyLink.style.display = 'inline-flex';
    } else {
      modalVerifyLink.style.display = 'none';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind to cards and view buttons
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach((card) => {
    const title = card.getAttribute('data-title');
    const imgSrc = card.getAttribute('data-img');
    const verifyUrl = card.getAttribute('data-verify');

    const triggerWrap = card.querySelector('.cert-preview-wrap');
    if (triggerWrap) {
      triggerWrap.addEventListener('click', () => {
        openModal(title, imgSrc, verifyUrl);
      });
    }

    const viewBtn = card.querySelector('.view-cert-btn');
    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(title, imgSrc, verifyUrl);
      });
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. CLIPBOARD ACTIONS & TOAST
   ========================================================================== */
function initClipboardActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast-notification');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Copied to clipboard!';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(label);
        }).catch(() => {
          fallbackCopy(textToCopy, label);
        });
      } else {
        fallbackCopy(textToCopy, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(label);
  }
}

/* ==========================================================================
   6. SKILLS CATEGORY TAB SWITCHER
   ========================================================================== */
function initSkillsTabs() {
  const tabButtons = document.querySelectorAll('.skills-tab-btn');
  const skillGroups = document.querySelectorAll('.skills-category-group');

  if (!tabButtons.length || !skillGroups.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-skill-tab');

      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      skillGroups.forEach((group) => {
        const groupCat = group.getAttribute('data-category');
        if (targetCategory === 'all' || groupCat === targetCategory) {
          group.style.display = 'flex';
          setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
          }, 10);
        } else {
          group.style.opacity = '0';
          group.style.transform = 'translateY(10px)';
          group.style.display = 'none';
        }
      });
    });
  });
}

