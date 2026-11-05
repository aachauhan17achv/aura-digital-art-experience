# PROJECT KNOWLEDGE BASE // AURA IMMERSIVE DIGITAL ART & VECTOR SYSTEM

## 1. Project Name and Purpose
* **Project Name:** AURA // Immersive Digital Art Experience & Vector Design System
* **Purpose:** A standalone, high-performance interactive web application and digital art installation inspired by the Magnific vector design system (`magnific.com/vectors/figma-design-system`). It pairs mathematical generative vector fields with real-time Web Audio API sound synthesis and a glassmorphic Figma-ready design token architecture.
* **Root Location:** `D:\Antigravity Project's File\Digital Art Immersive Experience\`

---

## 2. Current Status & Unfinished Work
* **Status:** Phase 1 Complete (Fully functional, interactive, and responsive).
* **Completed Milestones:**
  - 5 generative exhibition modes (Vector Morph, Neon Silk, Matrix 3D, Singularity, Topography).
  - Procedural real-time Web Audio ambient synthesizer with cursor filter sweeps and chime triggers.
  - Interactive floating dock with physics sliders and chromatic palette switcher.
  - W3C-standard Figma design tokens (`figma-tokens.json`) and in-app design system token drawer.
  - Snapshot export engine (PNG).
* **Upcoming / Unfinished Work:**
  - Direct SVG vector path exporter for Figma imports.
  - Preset save/load system via `localStorage`.
  - Additional generative shaders using WebGL/Three.js if 3D complexity expands.

---

## 3. Project Architecture
* **Paradigm:** Modular Vanilla ES6+ Web Architecture (zero-build, zero external runtime dependency required for maximum performance and portability).
* **Rendering Subsystem:** High-DPI HTML5 Canvas vector simulation loop (`art_engine.js`) driven by `requestAnimationFrame`.
* **Audio Subsystem:** Hardware-accelerated browser Web Audio API (`soundscape.js`) using polyphonic oscillators, dynamic biquad filters, and stereo panners.
* **UI/UX Subsystem:** Glassmorphic modern interface (`style.css` & `design_system.js`) utilizing CSS custom properties, backdrop blur filters, and micro-interactions.

---

## 4. Directory & File Structure
```
D:\Antigravity Project's File\Digital Art Immersive Experience\
├── index.html            # Main application layout, canvas container, HUD, and Design System Drawer
├── style.css             # Glassmorphic UI styling, design tokens, responsive rules, animations
├── art_engine.js         # Canvas rendering engine, multi-mode vector physics, particle life cycle
├── soundscape.js         # Web Audio API real-time ambient synthesizer & reactive filter sweeps
├── design_system.js      # HUD controls, exhibition tab switching, palette management, and event bus
├── figma-tokens.json     # W3C-compliant Figma Design Tokens (colors, typography, radii, effects)
├── codebase_memory.md    # Authoritative persistent project knowledge base
├── package.json          # Node.js project metadata and development scripts
├── .gitignore            # Git exclusion rules
└── README.md             # Project documentation and quickstart instructions
```

---

## 5. Technology Stack & Versions
* **Core Languages:** Modern HTML5, CSS3 (Custom Properties, Backdrop Filters), Vanilla ES6+ JavaScript.
* **APIs:** HTML5 Canvas 2D Context, Web Audio API (`AudioContext`, `BiquadFilterNode`, `StereoPannerNode`), Fullscreen API.
* **Typography:** Space Grotesk (Display), Plus Jakarta Sans (Body), JetBrains Mono (Code/Metrics) via Google Fonts.
* **Tooling / Dev Server:** Node.js / `serve` (^14.2.4).
* **Package Manager:** npm.

---

## 6. Entry Points, Components & Classes

### A. `ArtEngine` (`art_engine.js`)
* **Class:** `ArtEngine`
* **Entry Point:** Instantiated as `window.artEngine = new ArtEngine('art-canvas')`.
* **Key Methods:**
  - `init()` / `resize()`: Binds canvas dimensions with DPR clamping (`min(devicePixelRatio, 2)`).
  - `setMode(newMode)`: Switches simulation modes (`flowfield`, `aurora`, `lattice`, `supernova`, `topography`).
  - `setPalette(name)`: Swaps active color palette (`cyberpunk`, `spectral`, `solar`, `monochrome`).
  - `triggerBurst(x, y)`: Spawns particle burst at mouse click coordinates.
  - `exportSnapshot()`: Renders canvas content into a downloadable high-resolution PNG.

### B. `SoundscapeEngine` (`soundscape.js`)
* **Class:** `SoundscapeEngine`
* **Entry Point:** Instantiated as `window.soundscapeEngine = new SoundscapeEngine()`.
* **Key Methods:**
  - `init()`: Constructs Web Audio graph (Master Gain → Biquad Filter → Stereo Panner → Destination).
  - `toggle()`: Starts/suspends audio context with ramped gain transitions.
  - `playChime()`: Triggers random C minor pentatonic harmonic chime on click.
  - Dynamic modulation: Mouse Y modulates filter frequency (200 Hz – 3400 Hz); Mouse X modulates stereo pan (-0.8 to +0.8).

### C. UI & Event Controller (`design_system.js`)
* Manages exhibition tabs, custom range sliders, palette swatches, drawer open/close transitions, and custom cursor spring smoothing (`lerp`).

---

## 7. Data Flow & Application Flow
1. **Load:** `index.html` loads fonts, initializes `ArtEngine`, attaches canvas listeners.
2. **Animation Loop:** `requestAnimationFrame` continuously executes `art_engine.render()`:
   - Interpolates mouse coordinates toward target positions.
   - Evaluates vector noise equations for active mode.
   - Updates velocities, particle ages, and boundary wraps.
   - Traces chromatic lines using composite operation (`lighter` or `screen`).
3. **User Input:**
   - Sliders update `artEngine.params` in real-time.
   - Audio button toggles Web Audio context with gentle ramp.
   - Moving cursor over canvas modulates both audio filter and vector flow turbulence.
   - Design System button slides in token drawer from right.

---

## 8. APIs, Integrations & Figma Tokens
* **Figma Token Export:** [`figma-tokens.json`](figma-tokens.json) provides machine-readable tokens matching Magnific's UI kit:
  - Surface Void (`#05060A`), Glass Panel (`#0C0F18`), Elevated (`#141724`).
  - Neon Cyan (`#00F0FF`), Electric Violet (`#7000FF`), Plasma Pink (`#FF007A`).
  - Blur tokens (`blur(28px) saturate(180%)`).
* **Figma MCP Integration:** Prepared for Code Connect and `send_code_to_figma` workflows.

---

## 9. Environment & Commands
* **Run directly in browser:** Double click `index.html` or execute:
  ```powershell
  Start-Process "D:\Antigravity Project's File\Digital Art Immersive Experience\index.html"
  ```
* **Local HTTP Server (optional):**
  ```powershell
  npm start
  # or
  npx serve .
  ```

---

## 10. UI/UX Conventions & State Management
* **Aesthetic Theme:** Obsidian Void dark mode with luminous chromatic vector accents and glassmorphism.
* **Cursor:** Custom animated dual-ring cursor follower with scale feedback on click.
* **State Management:** Lightweight centralized parameters stored on `window.artEngine.params`.

---

## 11. Known Constraints & Key Decisions
* **Decision:** Zero external npm runtime dependencies used for core rendering to guarantee instant startup and eliminate build tooling overhead.
* **Constraint:** Device pixel ratio is capped at 2.0 to ensure 60 FPS performance on ultra-high-resolution 4K/Retina displays.

---

## 12. Repository & Remote Tracking
* **Local Repository:** `D:\Antigravity Project's File\Digital Art Immersive Experience`
* **Default Branch:** `main`
* **Git User:** `aachauhan17achv` <`aachauhan17.ac.hv@gmail.com`>
