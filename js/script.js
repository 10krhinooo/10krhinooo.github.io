 // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  function closeMenu() { mobileNav.classList.remove('open'); }

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

  // Smooth form feedback
  function handleFormSubmit(btn) {
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#00c080';
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.background = '';
    }, 3000);
  }
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
    const res = await fetch('http://localhost:8083/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok) {
      btn.textContent = 'Sent ✓';
      wrapper.querySelectorAll('input, textarea').forEach(el => el.value = '');
    } else {
      btn.textContent = 'Failed. Try again.';
      btn.disabled = false;
    }
  } catch (e) {
    btn.textContent = 'Network error.';
    btn.disabled = false;
  }
}