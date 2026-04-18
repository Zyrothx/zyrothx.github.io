/* ═══════════════════════════════════════════════════════
   JOSUE I. CORONADO — PORTFOLIO
   script.js
   Smooth scroll | Animations | Canvas particles | UX
═══════════════════════════════════════════════════════ */

'use strict';

/* ─── LUCIDE ICONS INIT ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

/* ─── SCROLL PROGRESS BAR ────────────────────────────── */
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
}

/* ─── NAVBAR: glassmorphism on scroll + active links ─── */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  const scrolled = window.scrollY > 40;
  navbar.classList.toggle('scrolled', scrolled);
}

function updateActiveNavLink() {
  const scrollMid = window.scrollY + window.innerHeight / 2;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollMid >= top && scrollMid < bottom) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

/* ─── HAMBURGER MENU ─────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks   = document.querySelectorAll('.mob-link');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ─── SMOOTH SCROLLING (for nav links) ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const offset = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ─── INTERSECTION OBSERVER (reveal on scroll) ───────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when skills section enters view
        if (entry.target.closest('.skills')) {
          animateSkillBars(entry.target);
        }
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ─── SKILL BARS ANIMATION ───────────────────────────── */
function animateSkillBars(card) {
  card.querySelectorAll('.skill-fill').forEach(bar => {
    const pct = bar.style.getPropertyValue('--pct');
    // Small delay so bar animates after card reveals
    setTimeout(() => {
      bar.style.width = pct;
    }, 200);
  });
}

/* ─── PROJECT FILTERS ────────────────────────────────── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    const filter = this.dataset.filter;

    // Update active state
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-selected', 'true');

    // Show/hide cards
    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        card.style.display = '';
      } else {
        card.classList.add('hidden');
        // Delay display:none so opacity transition plays
        setTimeout(() => {
          if (card.classList.contains('hidden')) card.style.display = 'none';
        }, 350);
      }
    });
  });
});

/* ─── HERO CANVAS — PARTICLE NETWORK ─────────────────── */
const canvas = document.getElementById('heroCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let W, H;

  // Particle configuration
  const CONFIG = {
    count:        55,
    maxDist:      140,
    speed:        0.35,
    radius:       1.5,
    colorPrimary: '0, 191, 255',   // blue
    colorAccent:  '0, 255, 255',   // cyan
  };

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r  = Math.random() * CONFIG.radius + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.hue = Math.random() > 0.6 ? CONFIG.colorAccent : CONFIG.colorPrimary;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDist) {
          const opacity = (1 - dist / CONFIG.maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.colorPrimary}, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrame = requestAnimationFrame(animate);
  }

  // Pause animation when hero is out of viewport (performance)
  const heroSection = document.getElementById('hero');
  const canvasObserver = new IntersectionObserver(
    entries => {
      entries[0].isIntersecting
        ? (animFrame = requestAnimationFrame(animate))
        : cancelAnimationFrame(animFrame);
    },
    { threshold: 0.1 }
  );
  canvasObserver.observe(heroSection);

  // Resize handler (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });

  init();
  animate();
}

/* ─── SCROLL EVENT HANDLER (single rAF loop) ─────────── */
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScrollProgress();
      updateNavbar();
      updateActiveNavLink();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ─── INITIAL CALL on load ───────────────────────────── */
updateNavbar();
updateActiveNavLink();
updateScrollProgress();

/* ─── KEYBOARD ACCESSIBILITY: Escape closes mobile menu ─ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});