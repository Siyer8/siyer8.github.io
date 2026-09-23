const dialog = document.querySelector('.lightbox');
const dialogImage = dialog?.querySelector('img');
const dialogCaption = dialog?.querySelector('p');
const closeButton = dialog?.querySelector('.lightbox-close');
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.project-head, .image-card, .project-details').forEach(el => {
    if (el.classList.contains('image-card')) el.style.setProperty('--delay', (Array.from(el.parentElement.children).indexOf(el) * 90) + 'ms');
    el.classList.add('reveal', 'reveal-pending');
    observer.observe(el);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      observer.disconnect();
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    }
  });
}
let trigger;

document.querySelectorAll('[data-image]').forEach((button) => {
  button.addEventListener('click', () => {
    trigger = button;
    dialogImage.src = button.dataset.image;
    dialogImage.alt = button.querySelector('img').alt;
    dialogCaption.textContent = button.dataset.caption;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
});

closeButton?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  trigger?.focus({ preventScroll: true });
});
