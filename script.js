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
