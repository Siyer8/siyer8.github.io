const dialog = document.querySelector('.lightbox');
// Small, consistent navigation icons, drawn specifically for these projects.
const icons = {
  wind: '<path d="M8 18Q22 26 28 26H37Q46 26 56 17V47Q46 38 37 38H28Q22 38 8 46Z"/><path d="M3 32H48m-5-5 5 5-5 5M28 26v12M37 26v12"/>',
  engine: '<rect x="12" y="8" width="24" height="23" rx="3"/><path d="M12 15h24M12 21h24M24 31v12l17 7M7 8v30M41 8v24"/><circle cx="45" cy="47" r="12"/><circle cx="45" cy="47" r="3"/>',
  jarvis: '<rect x="13" y="13" width="38" height="38" rx="8"/><path d="M23 25l-7 7 7 7M41 25l7 7-7 7M35 23l-6 18M23 5v8M41 5v8M23 51v8M41 51v8M5 23h8M5 41h8M51 23h8M51 41h8"/>',
  steering: '<path d="M18 9 10 16 5 43q0 10 10 10l7-13h20l7 13q10 0 10-10l-5-27-8-7-8 8H26Z"/><rect x="23" y="24" width="18" height="11" rx="2"/><circle cx="15" cy="24" r="2"/><circle cx="49" cy="24" r="2"/><path d="M26 45v5M38 45v5"/>',
  bus: '<rect x="5" y="15" width="54" height="31" rx="5"/><path d="M7 32h50M17 16v16M29 16v16M41 16v16M49 33v13M10 40h5M54 39h4"/><circle cx="17" cy="48" r="6"/><circle cx="46" cy="48" r="6"/>',
  gearbox: '<circle cx="24" cy="27" r="13"/><circle cx="24" cy="27" r="4"/><circle cx="44" cy="45" r="10"/><circle cx="44" cy="45" r="3"/><path d="M24 8v6M24 40v6M5 27h6M37 27h6M11 14l4 4M33 36l5 5M11 40l4-4M33 18l5-5M44 29v6M44 55v6M28 45h6M54 45h6"/>',
  keyboard: '<path d="m5 18 21-5 3 34-22 4Zm54 0-21-5-3 34 22 4Z"/><path d="m11 24 10-2m-10 10 11-2m-10 10 11-2m20-16 10 2m-11 6 11 2m-12 6 11 2M17 22l2 17M47 22l-2 17"/>'
};
document.querySelectorAll('[data-icon]').forEach(el => {
  el.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[el.dataset.icon] || '') + '</svg>';
});
document.querySelector('#print-resume')?.addEventListener('click', () => window.print());
if (document.body.classList.contains('project-view')) {
  const selectProject = () => {
    const projects = Array.from(document.querySelectorAll('.project'));
    const selected = projects.find(el => '#' + el.id === location.hash) || projects[0];
    projects.forEach(el => el.hidden = el !== selected);
    document.title = selected.querySelector('h3').textContent + ' — Suraj Iyer';
  };
  selectProject();
  window.addEventListener('hashchange', selectProject);
}
const dialogImage = dialog?.querySelector('img');
const dialogCaption = dialog?.querySelector('p');
const closeButton = dialog?.querySelector('.lightbox-close');
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Pair images into proportional rows, preserving their full original frames.
document.querySelectorAll('.gallery').forEach(gallery => {
  const cards = Array.from(gallery.querySelectorAll('.image-card'));
  for (let i = 0; i < cards.length; i += 2) {
    const row = document.createElement('div');
    row.className = 'gallery-row';
    const pair = cards.slice(i, i + 2);
    const sizeRow = () => {
      let total = 0;
      pair.forEach(card => {
        const img = card.querySelector('img');
        const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        card.style.setProperty('--image-ratio', ratio);
        total += ratio;
      });
      row.style.maxWidth = `${total * 520 + (pair.length - 1) * 20}px`;
    };
    pair.forEach(card => {
      row.append(card);
      card.querySelector('img').addEventListener('load', sizeRow);
    });
    gallery.append(row);
    sizeRow();
  }
});
if ('IntersectionObserver' in window && !motion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.project-head, .project-details').forEach(el => {
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
