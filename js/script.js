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

  // Card mouse glow
  function handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  }
  function handleMouseLeave(card) {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  }

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
      btn.textContent = 'Sent ✓';
      wrapper.querySelectorAll('input, textarea').forEach(el => el.value = '');
      setTimeout(() => {
        btn.textContent = 'Send Message →';
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
