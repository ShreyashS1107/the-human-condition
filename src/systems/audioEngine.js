/**
 * Procedural Web Audio API Cinematic Sound Engine for THE HUMAN CONDITION
 * 100% Free & Open-Source. Zero external paid assets or network dependencies.
 * 
 * Generates all stage-aware cinematic musical scores, binaural drones,
 * philosopher soundscapes, ink/parchment acoustics, and the escalating
 * Nietzsche Machine rhythmic breakdown in real-time.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.filter = null;
    this.activeHarmonicNodes = [];
    this.activeIntervals = [];
    this.isInitialized = false;
    this.isMuted = false;
    this.activePortalType = null;
    this.activeStage = null;
    this.activePhilosopherId = null;
    this.rhythmInterval = null;
  }

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      this.ctx = new AudioContext();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.68, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      // Low pass filter for dark, muffled cosmic atmosphere
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3.5, this.ctx.currentTime);
      this.filter.connect(this.ambientGain);

      // Sub-bass drone 1 (43.65 Hz - F1)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sine';
      this.droneOsc1.frequency.setValueAtTime(43.65, this.ctx.currentTime);
      this.droneOsc1.connect(this.filter);
      this.droneOsc1.start();

      // Sub-bass drone 2 (55.0 Hz - A1) with slight detune for slow binaural beat
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(55.0, this.ctx.currentTime);
      this.droneOsc2.connect(this.filter);
      this.droneOsc2.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn('[SoundEngine] Web Audio initialization deferred:', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return Boolean(this.ctx);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.68, now + 0.1);
    }
    return this.isMuted;
  }

  createNoiseBuffer(duration = 2.0) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filtering
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  clearHarmonics() {
    this.activeHarmonicNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // cleanup safe
      }
    });
    this.activeHarmonicNodes = [];

    if (this.rhythmInterval) {
      clearInterval(this.rhythmInterval);
      this.rhythmInterval = null;
    }
  }

  // --- STAGE 01: OPENING SOUNDSCAPE ---
  startOpeningRoomTone() {
    if (!this.ensureContext()) return;
    this.clearHarmonics();
    const now = this.ctx.currentTime;

    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(0, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.18, now + 4.0);
    }
    if (this.filter) {
      this.filter.frequency.setValueAtTime(95, now);
    }
  }

  playSubtlePulse(frequency = 110, duration = 1.2, gainLevel = 0.15) {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, frequency * 0.5), now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  playManipulationBeat(beatIndex) {
    if (!this.ensureContext()) return;
    const frequencies = [82.4, 73.4, 65.4, 55.0];
    const freq = frequencies[beatIndex] || 60;
    this.playSubtlePulse(freq, 2.2, 0.22);

    if (this.filter) {
      const now = this.ctx.currentTime;
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.setValueAtTime(260, now);
      this.filter.frequency.exponentialRampToValueAtTime(110, now + 2.5);
    }
  }

  playEntranceResonance() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    this.playSubtlePulse(48.0, 3.5, 0.28);

    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.linearRampToValueAtTime(0.35, now + 2.5);
    }
  }

  // --- STAGE 02: TOUR SELECTION SOUNDSCAPE ---
  playPortalHover(portalType) {
    if (!this.ensureContext() || this.activePortalType === portalType) return;
    this.activePortalType = portalType;

    const portalFreqs = {
      LIBRARY: { freq: 174.6, filter: 280 }, // F3 - archival wood
      MUSEUM: { freq: 130.8, filter: 220 },  // C3 - monumental cold void
      BOOK: { freq: 98.0, filter: 160 },     // G2 - intimate, quiet
    };

    const target = portalFreqs[portalType] || { freq: 140, filter: 200 };
    const now = this.ctx.currentTime;

    if (this.filter) {
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.linearRampToValueAtTime(target.filter, now + 0.8);
    }

    this.playSubtlePulse(target.freq, 1.8, 0.14);
  }

  playTransitionSwell() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 2.0);

    const bpFilter = this.ctx.createBiquadFilter();
    bpFilter.type = 'bandpass';
    bpFilter.frequency.setValueAtTime(120, now);
    bpFilter.frequency.exponentialRampToValueAtTime(600, now + 2.0);
    bpFilter.Q.setValueAtTime(6, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(bpFilter);
    bpFilter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.6);
  }

  // --- STAGE 03: LIBRARY ATMOSPHERES & PHILOSOPHER MUSICAL PROFILES ---
  setLibraryAtmosphere() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    if (this.filter) {
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.linearRampToValueAtTime(220, now + 2.0);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.linearRampToValueAtTime(0.3, now + 2.0);
    }
  }

  playPhilosopherProximity(philosopher) {
    if (!this.ensureContext() || !philosopher) return;
    const now = this.ctx.currentTime;
    this.activePhilosopherId = philosopher.id;

    // Philosophical thematic audio identities
    switch (philosopher.id) {
      case 'SOCRATES': {
        // Warm Athenian harmonic strings drone (A2 110Hz + E3 164.8Hz)
        this.playHarmonicChord([110, 164.8], 3.0, 0.12, 'sine');
        if (this.filter) this.filter.frequency.linearRampToValueAtTime(320, now + 1.0);
        break;
      }
      case 'NIETZSCHE': {
        // Unstable low-frequency pulse + sharp dissonance (49Hz + 73.4Hz)
        this.playHarmonicChord([49.0, 73.4], 3.2, 0.18, 'sawtooth');
        if (this.filter) this.filter.frequency.linearRampToValueAtTime(450, now + 0.8);
        break;
      }
      case 'DOSTOEVSKY': {
        // Low claustrophobic cello-like drone (65.4Hz + 98Hz)
        this.playHarmonicChord([65.4, 98.0], 3.5, 0.16, 'triangle');
        if (this.filter) this.filter.frequency.linearRampToValueAtTime(180, now + 1.2);
        break;
      }
      case 'CAMUS': {
        // Sparse crystalline tone followed by vast quiet (261.6Hz + 392Hz)
        this.playHarmonicChord([261.6, 392.0], 2.8, 0.10, 'sine');
        if (this.filter) this.filter.frequency.linearRampToValueAtTime(240, now + 1.0);
        break;
      }
      case 'WOOLF': {
        // Flowing fluid memory waves (146.8Hz + 220Hz + 293.6Hz)
        this.playHarmonicChord([146.8, 220.0, 293.6], 4.0, 0.12, 'sine');
        if (this.filter) this.filter.frequency.linearRampToValueAtTime(380, now + 1.5);
        break;
      }
      default: {
        this.playSubtlePulse(philosopher.soundTone?.freq || 140, 2.0, 0.18);
      }
    }
  }

  playHarmonicChord(frequencies = [], duration = 3.0, gainLevel = 0.1, type = 'sine') {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(gainLevel / (idx + 1), now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  // --- STAGE 04: MUSEUM CHAMBERS ---
  playMuseumRoomAcoustic(room) {
    if (!this.ensureContext() || !room || !room.soundProfile) return;
    const now = this.ctx.currentTime;

    if (this.filter) {
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.linearRampToValueAtTime(room.soundProfile.filter || 200, now + 1.2);
    }

    this.playSubtlePulse(room.soundProfile.freq, 2.5, 0.22);
  }

  // --- STAGE 05: THE BOOK (MOST INTIMATE SCENE) ---
  playBookOpen() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    // Organic leather & parchment friction
    const noiseBuffer = this.createNoiseBuffer(0.9);
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(320, now);
    bandpass.frequency.exponentialRampToValueAtTime(120, now + 0.85);
    bandpass.Q.setValueAtTime(2.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.9);

    // Warm deep resonant thud
    this.playSubtlePulse(65.4, 1.2, 0.18);
  }

  playPageTurn() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    // Organic paper sweep with slight random velocity
    const noiseBuffer = this.createNoiseBuffer(0.5);
    if (!noiseBuffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const randomFreq = 480 + (Math.random() - 0.5) * 80;
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(randomFreq, now);
    bandpass.frequency.linearRampToValueAtTime(randomFreq * 0.6, now + 0.45);
    bandpass.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.04, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.5);
  }

  playQuestionArrival() {
    if (!this.ensureContext()) return;
    this.playSubtlePulse(130.8, 2.4, 0.16);
  }

  playInkSettling() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    // Low fluid absorption pulse
    this.playSubtlePulse(88.0, 1.2, 0.15);

    // Microscopic friction click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  playUnderstandBed() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;

    // Chord: E2 (82.4Hz) + B2 (123.4Hz) + E3 (164.8Hz) - Intimate Warm Bed
    const freqs = [82.4, 123.4, 164.8];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 1.2);

      gain.gain.setValueAtTime(0.0001, now + 1.2);
      gain.gain.linearRampToValueAtTime(0.08 / (idx + 1), now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + 1.2);
      osc.stop(now + 7.8);
    });
  }

  // --- STAGE 06: THE NIETZSCHE MACHINE RHYTHMIC ESCALATION (DIRECTIVE #12) ---
  startMachineRhythm(speed = 1.0) {
    if (!this.ensureContext()) return;
    if (this.rhythmInterval) clearInterval(this.rhythmInterval);

    const intervalMs = Math.max(120, 600 / speed);
    this.rhythmInterval = setInterval(() => {
      const now = this.ctx.currentTime;
      // Mechanical percussive impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75 * speed, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);

      gain.gain.setValueAtTime(0.12 * Math.min(2.0, speed), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    }, intervalMs);
  }

  stopMachineRhythm() {
    if (this.rhythmInterval) {
      clearInterval(this.rhythmInterval);
      this.rhythmInterval = null;
    }
  }

  playFinaleAcceleration(progress = 0) {
    if (!this.ensureContext()) return;
    const freq = 65 + progress * 130;
    this.playSubtlePulse(freq, 0.9, 0.16 + progress * 0.18);

    if (this.filter) {
      const now = this.ctx.currentTime;
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.linearRampToValueAtTime(180 + progress * 420, now + 0.4);
    }
  }

  playDevastatingSilence() {
    // Sudden dramatic drop during "WHAT IF YOU ARE WRONG ABOUT YOURSELF?"
    this.stopMachineRhythm();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(0.02, now);
    }
  }

  playDevastatingResurgence() {
    // Violent resurgence at "WHAT IF YOU ARE WRONG ABOUT EVERYTHING?"
    if (!this.ensureContext()) return;
    this.startMachineRhythm(2.5);
    this.playHarmonicChord([55, 110, 155.5], 4.0, 0.28, 'sawtooth');
  }

  playFinaleCollapse() {
    if (!this.ensureContext()) return;
    this.stopMachineRhythm();
    const now = this.ctx.currentTime;
    this.playSubtlePulse(38, 1.2, 0.4);

    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(0, now + 1.0);
    }
  }

  playFinaleBreakdownTone() {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(45, now + 2.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.5);
  }

  // --- STAGE 07 & HARD SILENCE CLEANUP (DIRECTIVES #14 & #16) ---
  cutAudioImmediately() {
    this.stopMachineRhythm();
    this.clearHarmonics();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0, now);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(0, now);
    }
  }

  silenceAll() {
    this.cutAudioImmediately();
  }

  startAmbient(fadeTime = 3) {
    if (!this.ensureContext()) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.68, now);
    }
    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.32, now + fadeTime);
    }
  }
}

export const soundEngine = new SoundEngine();

