/**
 * AURA // Generative Audio Soundscape Engine
 * Real-time procedural ambient sound synthesis via Web Audio API
 */

class SoundscapeEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.filter = null;
    this.panner = null;
    this.droneOscillators = [];

    // Ambient Pentatonic Scales
    this.scale = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63]; // C3 minor pentatonic
  }

  init() {
    if (this.audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    // Master Gain
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

    // Dynamic Filter (modulated by cursor Y)
    this.filter = this.audioCtx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    this.filter.Q.setValueAtTime(3.5, this.audioCtx.currentTime);

    // Stereo Panner (modulated by cursor X)
    if (this.audioCtx.createStereoPanner) {
      this.panner = this.audioCtx.createStereoPanner();
      this.panner.pan.setValueAtTime(0, this.audioCtx.currentTime);
      this.masterGain.connect(this.filter);
      this.filter.connect(this.panner);
      this.panner.connect(this.audioCtx.destination);
    } else {
      this.masterGain.connect(this.filter);
      this.filter.connect(this.audioCtx.destination);
    }

    // Build Continuous Ambient Drone Voices
    const droneFrequencies = [65.41, 98.00, 130.81, 196.00]; // Deep foundation chords
    droneFrequencies.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 6, this.audioCtx.currentTime); // Slight organic detune

      oscGain.gain.setValueAtTime(0.12 / droneFrequencies.length, this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start();
      this.droneOscillators.push(osc);
    });

    this.bindInteractions();
  }

  bindInteractions() {
    window.addEventListener('mousemove', (e) => {
      if (!this.isPlaying || !this.audioCtx) return;

      const normX = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const normY = 1 - (e.clientY / window.innerHeight);    // 0 to 1

      // Modulate Filter Frequency
      const targetFreq = 200 + Math.pow(normY, 1.8) * 3200;
      this.filter.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.08);

      // Modulate Stereo Pan
      if (this.panner) {
        this.panner.pan.setTargetAtTime(normX * 0.8, this.audioCtx.currentTime, 0.08);
      }
    });

    window.addEventListener('mousedown', () => {
      if (this.isPlaying) {
        this.playChime();
      }
    });
  }

  playChime() {
    if (!this.audioCtx || this.audioCtx.state === 'suspended') return;

    // Pick a harmonic note from the scale
    const note = this.scale[Math.floor(Math.random() * this.scale.length)] * 2;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, this.audioCtx.currentTime);

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc.connect(gain);
    gain.connect(this.filter);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  toggle() {
    if (!this.audioCtx) {
      this.init();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.isPlaying = !this.isPlaying;

    const now = this.audioCtx.currentTime;
    if (this.isPlaying) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.4, now + 0.8);
    } else {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.4);
    }

    return this.isPlaying;
  }
}

window.soundscapeEngine = new SoundscapeEngine();

