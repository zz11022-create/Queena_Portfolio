const stage = document.querySelector('.hero-stage');
const effectButton = stage.querySelector('.stage-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let effectsPaused = motionPreference.matches;

function setPaused(paused) {
  effectsPaused = paused;
  effectButton.setAttribute('aria-pressed', String(paused));
  effectButton.textContent = paused ? 'Enable effects' : 'Pause effects';
  stage.toggleAttribute('data-paused', paused);
  syncCoverVideos();
}

const coverVideos = [...document.querySelectorAll('.cover-video')];
const visibleVideos = new Set();

function syncCoverVideos() {
  for (const video of coverVideos) {
    if (effectsPaused || document.hidden || !visibleVideos.has(video)) {
      video.pause();
      if (effectsPaused) delete video.parentElement.dataset.playing;
      continue;
    }
    if (!video.hasAttribute('src')) video.src = video.dataset.src;
    video.play().catch(() => {});
  }
}

if ('IntersectionObserver' in window) {
  const coverObserver = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (isIntersecting) visibleVideos.add(target);
      else visibleVideos.delete(target);
    }
    syncCoverVideos();
  });
  for (const video of coverVideos) {
    coverObserver.observe(video);
    video.addEventListener('playing', () => {
      if (!effectsPaused) video.parentElement.dataset.playing = '';
    });
    video.addEventListener('error', () => delete video.parentElement.dataset.playing);
  }
  document.addEventListener('visibilitychange', syncCoverVideos);
}

setPaused(effectsPaused);
motionPreference.addEventListener('change', event => setPaused(event.matches));
effectButton.addEventListener('click', () => setPaused(!effectsPaused));

const gallery = document.querySelector('.projects');
const gridRows = window.matchMedia('(min-width: 701px)');

function sizeGallery() {
  for (const project of gallery.children) {
    if (!gridRows.matches || project.hidden) {
      project.style.removeProperty('grid-row-end');
      continue;
    }
    const height = project.getBoundingClientRect().height;
    project.style.gridRowEnd = 'span ' + Math.ceil((height + 26) / 4);
  }
}

const galleryResize = new ResizeObserver(sizeGallery);
for (const project of gallery.children) galleryResize.observe(project);
gridRows.addEventListener('change', sizeGallery);
sizeGallery();

const previewButton = document.querySelector('[data-preview]');
const previewCover = previewButton.parentElement;
let previewFrame;

function closePreview() {
  if (!previewFrame) return;
  previewFrame.remove();
  previewFrame = undefined;
  previewButton.setAttribute('aria-expanded', 'false');
  previewButton.textContent = 'Try it here';
}

previewButton.addEventListener('click', () => {
  if (previewFrame) {
    closePreview();
    return;
  }
  previewFrame = document.createElement('iframe');
  previewFrame.src = previewButton.dataset.preview;
  previewFrame.title = 'Interactive Three.js Canvas Study';
  previewCover.append(previewFrame);
  previewButton.setAttribute('aria-expanded', 'true');
  previewButton.textContent = 'Close preview';
});

new MutationObserver(() => {
  if (previewCover.closest('.project').hidden) closePreview();
}).observe(previewCover.closest('.project'), {attributes: true, attributeFilter: ['hidden']});
