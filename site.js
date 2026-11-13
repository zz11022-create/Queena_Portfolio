const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('[data-categories]')];

for (const button of filters) {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    for (const control of filters) {
      control.setAttribute('aria-pressed', String(control === button));
    }
    for (const project of projects) {
      project.hidden = category !== 'all' && !project.dataset.categories.split(' ').includes(category);
    }
  });
}

const guestbook = document.querySelector('#guestbook');
const note = document.querySelector('#guest-note');
const status = document.querySelector('#note-status');
const key = 'queena-portfolio-preview-note';

document.querySelector('#open-guestbook').addEventListener('click', () => {
  status.textContent = '';
  try {
    note.value = localStorage.getItem(key) ?? note.value;
  } catch {
    // Keep the current draft when browser storage is unavailable.
  }
  guestbook.showModal();
});

document.querySelector('#close-guestbook').addEventListener('click', () => guestbook.close());
document.querySelector('#note-form').addEventListener('submit', event => {
  event.preventDefault();
  const message = note.value.trim();
  if (!message) {
    status.textContent = 'Write a note first.';
    note.focus();
    return;
  }
  try {
    localStorage.setItem(key, message);
    status.textContent = 'Saved on this device.';
  } catch {
    status.textContent = 'Storage is unavailable. Your note is still in the field.';
  }
});

function setupVercelAnalytics() {
  if (location.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.append(script);
}

setupVercelAnalytics();
