/**
 * AURA // Generative Vector Art Engine
 * Immersive procedural rendering with multi-mode mathematical vector fields
 */

class ArtEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Engine State
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.mode = 'flowfield'; // 'flowfield' | 'aurora' | 'lattice' | 'supernova' | 'topography'
    this.palette = 'cyberpunk';
    
    // Physics & Simulation Parameters
    this.params = {
      turbulence: 1.2,
      particleCount: 1200,
      speed: 1.4,
      vortex: true,
      timeScale: 0.003
    };

    // Interaction State
    this.mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      down: false,
      speed: 0
    };
    this.prevMouse = { x: -1000, y: -1000 };

    // Simulation Objects
    this.particles = [];
    this.time = 0;
    this.animationFrameId = null;

    // Palettes Definition
    this.palettes = {
      cyberpunk: [
        { r: 0, g: 240, b: 255 },   // Cyan
        { r: 112, g: 0, b: 255 },   // Violet
        { r: 255, g: 0, b: 122 },   // Pink
        { r: 79, g: 70, b: 229 }    // Deep Indigo
      ],
      spectral: [
        { r: 16, g: 185, b: 129 },  // Emerald
        { r: 6, g: 182, b: 212 },   // Teal
        { r: 99, g: 102, b: 241 },  // Violet
        { r: 147, g: 51, b: 234 }   // Purple
      ],
      solar: [
        { r: 245, g: 158, b: 11 },  // Amber
        { r: 239, g: 68, b: 68 },   // Crimson
        { r: 124, g: 58, b: 237 },  // Purple
        { r: 251, g: 191, b: 36 }   // Gold
      ],
      monochrome: [
        { r: 255, g: 255, b: 255 }, // White
        { r: 203, g: 213, b: 225 }, // Silver
        { r: 148, g: 163, b: 184 }, // Slate
        { r: 71, g: 85, b: 105 }    // Deep Gray
      ]
    };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindEvents();
    this.initParticles();
    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    
    // Clear background on resize
    this.ctx.fillStyle = '#05060A';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;

      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
    });

    window.addEventListener('mousedown', () => {
      this.mouse.down = true;
      document.body.classList.add('clicking');
      // Burst effect on click
      this.triggerBurst(this.mouse.x, this.mouse.y);
    });

    window.addEventListener('mouseup', () => {
      this.mouse.down = false;
      document.body.classList.remove('clicking');
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.targetX = e.touches[0].clientX;
        this.mouse.targetY = e.touches[0].clientY;
      }
    }, { passive: true });
  }

  initParticles() {
    this.particles = [];
    const count = this.params.particleCount;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: 0,
        vy: 0,
        age: Math.random() * 200,
        life: 150 + Math.random() * 200,
        colorIndex: Math.floor(Math.random() * 4),
        size: 0.8 + Math.random() * 1.6,
        seed: Math.random() * 1000
      });
    }
  }

  setMode(newMode) {
    this.mode = newMode;
    // Wipe canvas with smooth fade on mode change
    this.ctx.fillStyle = 'rgba(5, 6, 10, 0.9)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.initParticles();
  }

  setPalette(paletteName) {
    if (this.palettes[paletteName]) {
      this.palette = paletteName;
    }
  }

  triggerBurst(x, y) {
    const burstCount = 180;
    for (let i = 0; i < burstCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const force = 3 + Math.random() * 9;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        age: 0,
        life: 80 + Math.random() * 60,
        colorIndex: Math.floor(Math.random() * 4),
        size: 1.5 + Math.random() * 2.5,
        seed: Math.random() * 100
      });
    }
    // Limit particles array
    if (this.particles.length > 3000) {
      this.particles.splice(0, burstCount);
    }
  }

  // Simplex-inspired trigonometric noise
  noise(x, y, z) {
    return Math.sin(x * 0.003 + z) * Math.cos(y * 0.003 - z) +
           Math.sin(x * 0.008 - y * 0.008 + z * 1.5) * 0.5;
  }

  render() {
    // Smooth mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.15;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.15;
    this.time += this.params.timeScale * this.params.speed;

    switch (this.mode) {
      case 'flowfield':
        this.renderFlowField();
        break;
      case 'aurora':
        this.renderAuroraSilk();
        break;
      case 'lattice':
        this.renderMatrixLattice();
        break;
      case 'supernova':
        this.renderSupernova();
        break;
      case 'topography':
        this.renderTopography();
        break;
      default:
        this.renderFlowField();
    }

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  // 1. Vector Flow Field with Chromatic Particle Ribbons
  renderFlowField() {
    this.ctx.fillStyle = 'rgba(5, 6, 10, 0.12)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const activeColors = this.palettes[this.palette];
    const turb = this.params.turbulence;
    const speed = this.params.speed;

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.age++;

      if (p.age > p.life || p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) {
        p.x = Math.random() * this.width;
        p.y = Math.random() * this.height;
        p.vx = 0;
        p.vy = 0;
        p.age = 0;
      }

      // Base vector angle from trigonometric noise
      const angle = this.noise(p.x, p.y, this.time) * Math.PI * 4 * turb;
      let ax = Math.cos(angle) * 0.5 * speed;
      let ay = Math.sin(angle) * 0.5 * speed;

      // Mouse interactive influence (Vortex / Repulsion)
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 320 && dist > 5) {
        const force = (1 - dist / 320) * (this.mouse.down ? 4 : 1.8);
        if (this.params.vortex) {
          // Tangential vortex rotation
          ax += (-dy / dist) * force * 2.2;
          ay += (dx / dist) * force * 2.2;
        } else {
          // Gravitational attraction
          ax += (dx / dist) * force * 1.5;
          ay += (dy / dist) * force * 1.5;
        }
      }

      p.vx = p.vx * 0.94 + ax;
      p.vy = p.vy * 0.94 + ay;

      const prevX = p.x;
      const prevY = p.y;
      p.x += p.vx;
      p.y += p.vy;

      // Render ribbon trace
      const col = activeColors[p.colorIndex];
      const alpha = Math.sin((p.age / p.life) * Math.PI) * 0.75;
      
      this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
      this.ctx.lineWidth = p.size;
      this.ctx.beginPath();
      this.ctx.moveTo(prevX, prevY);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // 2. Neon Silk / Fluid Aurora Ribbon Waves
  renderAuroraSilk() {
    this.ctx.fillStyle = 'rgba(5, 6, 10, 0.08)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const activeColors = this.palettes[this.palette];
    const waveCount = 7;
    const pointsCount = 48;
    const step = this.width / pointsCount;

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    for (let w = 0; w < waveCount; w++) {
      const col = activeColors[w % activeColors.length];
      const yOffset = this.height * (0.3 + w * 0.08);

      this.ctx.beginPath();
      this.ctx.moveTo(0, yOffset);

      for (let i = 0; i <= pointsCount; i++) {
        const x = i * step;
        const wave1 = Math.sin(x * 0.004 + this.time * 2 + w * 1.2) * 60;
        const wave2 = Math.cos(x * 0.009 - this.time * 1.5 + w * 0.7) * 40;
        
        // Mouse reaction warp
        const distToMouse = Math.abs(x - this.mouse.x);
        const mouseEffect = distToMouse < 260 ? Math.sin((1 - distToMouse / 260) * Math.PI) * (this.mouse.y - yOffset) * 0.5 : 0;
        
        const y = yOffset + wave1 + wave2 + mouseEffect;
        this.ctx.lineTo(x, y);
      }

      this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.55)`;
      this.ctx.lineWidth = 3 + (w % 3) * 2;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // 3. 3D Isometric Matrix Lattice
  renderMatrixLattice() {
    this.ctx.fillStyle = 'rgba(5, 6, 10, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const activeColors = this.palettes[this.palette];
    const cols = 24;
    const rows = 16;
    const gapX = this.width / cols;
    const gapY = this.height / rows;

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';

    const mouseNormX = (this.mouse.x / this.width - 0.5) * 2;
    const mouseNormY = (this.mouse.y / this.height - 0.5) * 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const baseX = c * gapX + gapX / 2;
        const baseY = r * gapY + gapY / 2;

        const dist = Math.hypot(baseX - this.mouse.x, baseY - this.mouse.y);
        const z = Math.sin(dist * 0.015 - this.time * 3) * 35 +
                  (dist < 220 ? (1 - dist / 220) * 80 : 0);

        const px = baseX + mouseNormX * z * 0.3;
        const py = baseY + mouseNormY * z * 0.3;

        const colorIdx = (r + c) % activeColors.length;
        const col = activeColors[colorIdx];
        const alpha = Math.min(1, Math.max(0.15, (z + 40) / 100));

        // Connect lines to neighboring nodes
        if (c < cols - 1) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha * 0.35})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(px + gapX, py);
          this.ctx.stroke();
        }

        // Draw luminous node point
        this.ctx.beginPath();
        this.ctx.arc(px, py, 1.8 + (z / 35), 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }

  // 4. Chromatic Singularity / Supernova
  renderSupernova() {
    this.ctx.fillStyle = 'rgba(5, 6, 10, 0.15)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const activeColors = this.palettes[this.palette];
    const centerX = this.mouse.x > 0 ? this.mouse.x : this.width / 2;
    const centerY = this.mouse.y > 0 ? this.mouse.y : this.height / 2;

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.age++;

      if (p.age > p.life) {
        p.x = centerX + (Math.random() - 0.5) * 20;
        p.y = centerY + (Math.random() - 0.5) * 20;
        const angle = Math.random() * Math.PI * 2;
        const speed = (2 + Math.random() * 8) * this.params.speed;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.age = 0;
      }

      // Gravitational attraction back toward the center
      const dx = centerX - p.x;
      const dy = centerY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      p.vx = p.vx * 0.98 + (dx / dist) * 0.08;
      p.vy = p.vy * 0.98 + (dy / dist) * 0.08;

      p.x += p.vx;
      p.y += p.vy;

      const col = activeColors[p.colorIndex];
      const alpha = Math.sin((p.age / p.life) * Math.PI) * 0.8;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * (1 - p.age / p.life) * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // 5. Procedural Cyber Topography
  renderTopography() {
    this.ctx.fillStyle = 'rgba(5, 6, 10, 0.2)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const activeColors = this.palettes[this.palette];
    const linesCount = 28;
    const stepY = this.height / linesCount;
    const pointsX = 80;
    const stepX = this.width / pointsX;

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    for (let j = 0; j < linesCount; j++) {
      const baseY = j * stepY + stepY;
      const col = activeColors[j % activeColors.length];

      this.ctx.beginPath();
      this.ctx.moveTo(0, baseY);

      for (let i = 0; i <= pointsX; i++) {
        const x = i * stepX;
        
        // Multi-frequency Perlin terrain
        const elev = Math.sin(x * 0.006 + this.time) * 25 +
                     Math.cos(x * 0.015 - j * 0.2 + this.time * 1.2) * 15;

        // Interactive cursor depression
        const dist = Math.hypot(x - this.mouse.x, baseY - this.mouse.y);
        const push = dist < 250 ? Math.sin((1 - dist / 250) * Math.PI) * -60 : 0;

        const y = baseY + elev + push;
        this.ctx.lineTo(x, y);
      }

      this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.6)`;
      this.ctx.lineWidth = 1.6;
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  // Export current canvas frame as High-Res PNG
  exportSnapshot() {
    const link = document.createElement('a');
    link.download = `AURA-VECTOR-ART-${Date.now()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  start() {
    if (!this.animationFrameId) {
      this.render();
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

// Global Art Engine Instance
window.artEngine = new ArtEngine('art-canvas');

