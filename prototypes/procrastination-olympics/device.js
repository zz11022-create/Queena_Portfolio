// Keep the app's 402 × 874 layout stable; fit the complete handset, never its axes independently.
(() => {
  const slot = document.querySelector('.device-slot');
  const device = document.querySelector('.device');
  function fitDevice() {
    const width = document.documentElement.clientWidth;
    const height = window.visualViewport?.height || window.innerHeight;
    const gutter = width < 600 ? 16 : 32;
    const scale = Math.max(0.1, Math.min(1, (width - gutter * 2 - 8) / 434, (height - gutter * 2) / 906));
    slot.style.width = `${434 * scale}px`;
    slot.style.height = `${906 * scale}px`;
    device.style.transform = `scale(${scale})`;
  }
  window.addEventListener('resize', fitDevice);
  window.visualViewport?.addEventListener('resize', fitDevice);
  fitDevice();
})();
