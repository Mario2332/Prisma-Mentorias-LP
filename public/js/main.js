/* ========================================
   MENTORIA PRISMA - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initScrollReveal();
  initParticles();
  initFloatingShapes();
  initSmoothScroll();
  initCountUp();
  initMentorModal();
});

/* ---- Navbar scroll effect ---- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar-links a:not(.navbar-cta-btn)');
  const sections = document.querySelectorAll('section[id]');
  const toggle = document.querySelector('.navbar-toggle');
  const navMenu = document.querySelector('.navbar-links');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    lastScroll = currentScroll;
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ---- Scroll progress bar ---- */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

/* ---- Scroll reveal animations ---- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ---- Particles canvas ---- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '74, 159, 229' : '227, 38, 54';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const opacity = (1 - distance / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Only animate when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
      } else {
        cancelAnimationFrame(animationId);
      }
    });
  }, { threshold: 0 });

  heroObserver.observe(canvas.parentElement);
}

/* ---- Floating geometric shapes ---- */
function initFloatingShapes() {
  const container = document.querySelector('.hero-shapes');
  if (!container) return;

  const shapeTypes = ['triangle', 'circle', 'square', 'diamond'];

  for (let i = 0; i < 15; i++) {
    const shape = document.createElement('div');
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    shape.classList.add('shape', type);

    shape.style.left = Math.random() * 100 + '%';
    shape.style.animationDuration = (Math.random() * 20 + 15) + 's';
    shape.style.animationDelay = (Math.random() * 20) + 's';

    container.appendChild(shape);
  }
}

/* ---- Smooth scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ---- Count-up animation ---- */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          const current = Math.floor(eased * target);
          el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ---- Mentor selection modal ---- */
function initMentorModal() {
  const modal = document.getElementById('mentorModal');
  const modalClose = document.getElementById('modalClose');
  const modalPlanName = document.getElementById('modalPlanName');
  const planButtons = document.querySelectorAll('.plan-btn[data-plan]');

  if (!modal || !planButtons.length) return;

  function openModal(planName) {
    modalPlanName.textContent = planName;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open modal on plan button click
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan');
      openModal(planName);
    });
  });

  // Close modal
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Mentor button clicks (placeholder - links to be added later)
  const mentorBtns = modal.querySelectorAll('.modal-mentor-btn');
  mentorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mentor = btn.getAttribute('data-mentor');
      const plan = modalPlanName.textContent;
      // TODO: Replace with actual purchase links per mentor/plan
      console.log(`Selected mentor: ${mentor}, Plan: ${plan}`);
      alert(`Mentor selecionado: ${btn.querySelector('strong').textContent}\nPlano: ${plan}\n\n(Link de compra será adicionado em breve)`);
      closeModal();
    });
  });
}

/* ---- Parallax on mouse move (hero) ---- */
document.addEventListener('mousemove', (e) => {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  const glows = hero.querySelectorAll('.hero-glow');
  glows.forEach((glow, i) => {
    const speed = (i + 1) * 8;
    glow.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });

  const rings = hero.querySelectorAll('.hero-logo-ring');
  rings.forEach((ring, i) => {
    const speed = (i + 1) * 3;
    ring.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${ring.style.transform ? '' : '0deg'})`;
  });
});
