 // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => obs.observe(r));

  // Active nav link on scroll
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const spyObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(s => spyObs.observe(s));

  // Scroll progress + back-to-top
  const progressBar = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    backToTop.classList.toggle('visible', scrollTop > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Form submit
  async function handleFormSubmit(btn) {
  const wrapper = btn.closest('.contact-form-side');
  const name    = wrapper.querySelector('input[type="text"]').value.trim();
  const email   = wrapper.querySelector('input[type="email"]').value.trim();
  const message = wrapper.querySelector('textarea').value.trim();

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch('https://portfolio-be-production-dd7f.up.railway.app/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok) {
      const originalHTML = btn.innerHTML;
      btn.textContent = 'Sent ✓';
      wrapper.querySelectorAll('input, textarea').forEach(el => el.value = '');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 3000);
    } else {
      btn.textContent = 'Failed. Try again.';
      btn.disabled = false;
    }
  } catch (e) {
    btn.textContent = 'Network error.';
    btn.disabled = false;
  }
}

// Theme toggle
const themeToggles = document.querySelectorAll('.theme-toggle');
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('theme', theme); } catch (e) {}
  themeToggles.forEach(btn => {
    btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  });
}
themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
});
applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

// Starfield background
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let width, height, dpr;

  function styleColor(alpha) {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--star-color').trim() || '255,255,255';
    return `rgba(${raw},${alpha})`;
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(150, Math.floor((width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() < 0.06 ? Math.random() * 1.5 + 1.5 : Math.random() * 1.1 + 0.4,
      baseAlpha: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      ring: Math.random() < 0.06
    }));
  }

  function draw(t) {
    const baseOpacity = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--star-opacity')) || 1;
    ctx.clearRect(0, 0, width, height);
    stars.forEach(s => {
      const twinkle = reduceMotion ? 0 : Math.sin(t / 1400 + s.phase) * 0.3;
      const alpha = Math.max(0.1, Math.min(1, s.baseAlpha + twinkle)) * baseOpacity;
      ctx.beginPath();
      ctx.fillStyle = styleColor(alpha);
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      if (s.ring) {
        ctx.beginPath();
        ctx.strokeStyle = styleColor(alpha * 0.5);
        ctx.lineWidth = 1;
        ctx.arc(s.x, s.y, s.r + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  requestAnimationFrame(draw);
  if (reduceMotion) draw(0);
}

initStarfield();
