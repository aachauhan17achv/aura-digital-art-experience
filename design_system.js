/**
 * AURA // UI Controller & Design System Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const exhibitTabs = document.querySelectorAll('.exhibit-tab');
  const paletteSwatches = document.querySelectorAll('.palette-swatch');
  
  const sliderChaos = document.getElementById('slider-chaos');
  const sliderParticles = document.getElementById('slider-particles');
  const sliderSpeed = document.getElementById('slider-speed');
  
  const valChaos = document.getElementById('val-chaos');
  const valParticles = document.getElementById('val-particles');
  const valSpeed = document.getElementById('val-speed');

  const btnGravity = document.getElementById('btn-gravity');
  const btnAudio = document.getElementById('btn-audio');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnExport = document.getElementById('btn-export-canvas');
  const btnInteract = document.getElementById('btn-interact');
  const heroStage = document.getElementById('hero-stage');

  const btnDesignSystem = document.getElementById('btn-design-system');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const drawer = document.getElementById('design-system-drawer');

  const cursor = document.getElementById('custom-cursor');

  // 1. Exhibition Mode Switcher
  exhibitTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      exhibitTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.getAttribute('data-mode');
      if (window.artEngine) {
        window.artEngine.setMode(mode);
      }
    });
  });

  // 2. Palette Swatches
  paletteSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      paletteSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const palette = swatch.getAttribute('data-palette');
      if (window.artEngine) {
        window.artEngine.setPalette(palette);
      }
    });
  });

  // 3. Slider Controls
  if (sliderChaos) {
    sliderChaos.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      valChaos.textContent = val.toFixed(2);
      if (window.artEngine) window.artEngine.params.turbulence = val;
    });
  }

  if (sliderParticles) {
    sliderParticles.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      valParticles.textContent = val;
      if (window.artEngine) {
        window.artEngine.params.particleCount = val;
        window.artEngine.initParticles();
      }
    });
  }

  if (sliderSpeed) {
    sliderSpeed.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      valSpeed.textContent = val.toFixed(1);
      if (window.artEngine) window.artEngine.params.speed = val;
    });
  }

  // 4. Gravity / Vortex Toggle
  if (btnGravity) {
    btnGravity.addEventListener('click', () => {
      btnGravity.classList.toggle('active');
      const isVortex = btnGravity.classList.contains('active');
      btnGravity.querySelector('span:last-child').textContent = isVortex ? 'VORTEX FIELD' : 'GRAVITY WELL';
      if (window.artEngine) window.artEngine.params.vortex = isVortex;
    });
  }

  // 5. Audio Toggle
  if (btnAudio) {
    btnAudio.addEventListener('click', () => {
      if (window.soundscapeEngine) {
        const isPlaying = window.soundscapeEngine.toggle();
        btnAudio.classList.toggle('active', isPlaying);
        btnAudio.querySelector('.btn-label').textContent = isPlaying ? 'SOUNDSCAPE: ON' : 'AUDIO SOUNDSCAPE';
      }
    });
  }

  // 6. Fullscreen
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    });
  }

  // 7. Design System Drawer
  if (btnDesignSystem && drawer && btnCloseDrawer) {
    btnDesignSystem.addEventListener('click', () => {
      drawer.classList.add('open');
    });

    btnCloseDrawer.addEventListener('click', () => {
      drawer.classList.remove('open');
    });

    // Close on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
      }
    });
  }

  // 8. Hero Minimization / Immersion
  if (btnInteract && heroStage) {
    btnInteract.addEventListener('click', () => {
      heroStage.classList.add('minimized');
    });
  }

  // 9. Export Snapshot
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      if (window.artEngine) {
        window.artEngine.exportSnapshot();
      }
    });
  }

  // 10. Smooth Custom Cursor Follower
  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.25;
    cursorY += (mouseY - cursorY) * 0.25;
    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
});

