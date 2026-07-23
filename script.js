// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Announcement modal
const overlay = document.getElementById('announcementOverlay');
const closeBtn = document.getElementById('modalCloseBtn');
const continueBtn = document.getElementById('modalContinueBtn');

function closeModal() {
  overlay.classList.add('is-hidden');
  document.body.style.overflow = '';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 250);
}

document.body.style.overflow = 'hidden';

closeBtn.addEventListener('click', closeModal);
continueBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', (event) => {
  if (event.target === overlay) closeModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

// Quote forms (desktop + mobile share the same handling)
const QUOTE_EMAIL = 'team@pestguard360.com';

function buildMailtoLink({ name, email, phone, message }) {
  const subject = `Quote Request from ${name}`;
  const bodyLines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    'Message:',
    message || '(no message provided)',
  ];
  const params = new URLSearchParams({
    subject,
    body: bodyLines.join('\n'),
  });
  // URLSearchParams encodes spaces as "+" — mailto needs "%20", so swap those back
  return `mailto:${QUOTE_EMAIL}?${params.toString().replace(/\+/g, '%20')}`;
}

function handleQuoteSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const statusEl = form.querySelector('[data-status]');
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const phone = form.elements.phone.value.trim();
  const message = form.elements.message.value.trim();

  if (!name || !email || !phone) {
    statusEl.textContent = 'Please fill out your name, email, and phone number.';
    statusEl.className = 'quote-status error';
    return;
  }

  // No form backend wired up yet — this opens the visitor's own email
  // client with a pre-filled draft to team@pestguard360.com. Swap this
  // out for a real fetch() call to a form backend (or serverless
  // function) whenever one is ready.
  window.location.href = buildMailtoLink({ name, email, phone, message });

  statusEl.textContent = 'Opening your email app to send this request to our team...';
  statusEl.className = 'quote-status success';
  form.reset();
}

document.getElementById('quoteFormDesktop').addEventListener('submit', handleQuoteSubmit);
document.getElementById('quoteFormMobile').addEventListener('submit', handleQuoteSubmit);
