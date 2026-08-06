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
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const submitButton = quoteForm.querySelector('button[type="submit"]');
    const formData = new FormData(quoteForm);
    const email = String(formData.get('email') || '').trim();

    formData.set('_replyto', email);
    formData.set('_subject', `New Pest Guard 360 quote request from ${String(formData.get('name') || '').trim()}`);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    if (formStatus) {
      formStatus.textContent = 'Sending your request...';
    }

    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      quoteForm.reset();

      if (formStatus) {
        formStatus.textContent = 'Thank you. Your request was sent successfully.';
      }
    } catch {
      if (formStatus) {
        formStatus.textContent = 'Your request could not be sent. Please call 1-855-3-PESTGUARD or email team@pestguard360.com.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Quote Request';
      }
    }
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
