/* DréCar Technologies — Main JavaScript */

// ── NAVBAR: scroll effect & active link ──
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
}, { passive: true });

function updateActiveLink() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const isOpen = navLinksEl.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// ── SMOOTH SCROLL for all anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── INTERSECTION OBSERVER: Animate on scroll ──
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    shakeForm();
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn.querySelector('.btn-text');
  const originalText = btnText.textContent;

  btn.disabled = true;
  btnText.textContent = 'Sending...';

  const subject = form.subject ? form.subject.value : '';
  const budget  = form.budget  ? form.budget.value  : '';

  fetch('https://formsubmit.co/ajax/westcottcarien@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      message,
      _subject: `New enquiry from ${name} — DréCar Technologies`,
      'Project Type': subject,
      'Budget Range': budget,
      _captcha: 'false'
    })
  })
  .then(res => res.json())
  .then(() => {
    btn.disabled = false;
    btnText.textContent = originalText;
    form.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  })
  .catch(() => {
    btn.disabled = false;
    btnText.textContent = originalText;
    alert('Something went wrong. Please email us directly at info@drecar.co.za');
  });
});

function shakeForm() {
  form.style.animation = 'shake 0.4s ease';
  form.addEventListener('animationend', () => { form.style.animation = ''; }, { once: true });
}

// ── TYPED CURSOR EFFECT ──
const cursorEl = document.querySelector('.cursor');
if (cursorEl) {
  setInterval(() => {
    cursorEl.style.opacity = cursorEl.style.opacity === '0' ? '1' : '0';
  }, 530);
}

// ── COUNTER ANIMATION for stats ──
function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  const hasPlus = el.textContent.includes('+');
  const suffix = hasPlus ? '+' : el.textContent.replace(/[\d.]/g, '');

  const update = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.textContent.replace(/[^0-9]/g, '');
    if (raw) animateCounter(el, parseInt(raw));
    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number, .metric-val').forEach(el => statsObserver.observe(el));

// ── SERVICE CARD: ripple effect ──
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('click', e => {
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,101,0,0.1);
      transform:scale(0); animation:ripple 0.6s ease-out forwards;
    `;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// ── CSS keyframes injected for ripple & shake ──
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(2); opacity: 0; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-6px); }
    40%,80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(style);

// ── INIT ──
navbar.classList.toggle('scrolled', window.scrollY > 20);
updateActiveLink();
