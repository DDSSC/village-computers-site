// ============================================
// Mobile nav toggle
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// ============================================
// Dropdown nav — click toggle, close on outside click
// ============================================
const dropdowns = document.querySelectorAll('.nav-dropdown');

dropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');

    // Close all other open dropdowns first
    dropdowns.forEach(d => d.classList.remove('open'));

    // Toggle this one
    if (!isOpen) {
      dropdown.classList.add('open');
    }
  });
});

// Close dropdowns when clicking anywhere outside
document.addEventListener('click', () => {
  dropdowns.forEach(d => d.classList.remove('open'));
});

// Prevent clicks inside the menu from closing it
document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
  menu.addEventListener('click', (e) => e.stopPropagation());
});

// Close dropdowns on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dropdowns.forEach(d => d.classList.remove('open'));
  }
});

// ============================================
// Contact form -> Cloudflare Worker
// ============================================
// Update WORKER_URL to your deployed Worker endpoint, e.g.
// https://contact-form.<your-subdomain>.workers.dev
const WORKER_URL = 'https://contact-form.villagecomputersmtp.workers.dev';

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const submitBtn = document.getElementById('contact-submit');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
    };

    statusEl.textContent = '';
    statusEl.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      statusEl.textContent = 'Message sent! We\u2019ll get back to you soon.';
      statusEl.classList.add('success');
      form.reset();
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Please call us at (843) 608-6560 or try again.';
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
