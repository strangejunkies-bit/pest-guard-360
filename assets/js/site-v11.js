const root = document.documentElement;
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const quoteForm = document.querySelector('#quote-form');
const serviceSelect = document.querySelector('#service');
const formStatus = document.querySelector('#form-status');
const announcement = document.querySelector('#company-announcement');

root.classList.add('js');

function closeNavigation() {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  const label = menuButton.querySelector('.sr-only');
  if (label) label.textContent = 'Open navigation';
}

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
    const label = menuButton.querySelector('.sr-only');
    if (label) label.textContent = isOpen ? 'Open navigation' : 'Close navigation';
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeNavigation();
  });
}


document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    if (!serviceSelect) return;
    serviceSelect.value = link.dataset.service || '';
  });
});

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const formData = new FormData(quoteForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const service = String(formData.get('service') || 'Not sure yet').trim();
    const message = String(formData.get('message') || '').trim();

    const subject = `Quote request from ${name}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Service: ${service || 'Not sure yet'}`,
      '',
      'Details:',
      message || 'No additional details provided.'
    ].join('\n');

    if (formStatus) {
      formStatus.textContent = 'Opening your email app. Review the message and press send.';
    }

    window.location.href = `mailto:team@pestguard360.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

if (announcement && typeof announcement.showModal === 'function') {
  let hasSeenAnnouncement = false;

  try {
    hasSeenAnnouncement = sessionStorage.getItem('pg360-announcement-seen') === 'true';
  } catch {
    hasSeenAnnouncement = false;
  }

  if (!hasSeenAnnouncement) {
    announcement.showModal();
  }

  announcement.addEventListener('close', () => {
    try {
      sessionStorage.setItem('pg360-announcement-seen', 'true');
    } catch {
      return;
    }
  });

  announcement.addEventListener('click', (event) => {
    const bounds = announcement.getBoundingClientRect();
    const clickedOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (clickedOutside) announcement.close();
  });
}
