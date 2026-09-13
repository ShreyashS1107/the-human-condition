/**
 * ARCHITECTURAL NARRATION LAYER — THE HUMAN CONDITION
 * 100% Free & Open-Source. No paid APIs, no subscriptions.
 * 
 * Artistic Director Persona:
 * A Shakespearean theatre / literary audiobook actor reading a private manuscript.
 * Mature, calm, emotionally intelligent, slightly theatrical, natural breathing,
 * with contemplative pauses and zero "AI assistant" or corporate inflections.
 */

class NarrationEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.isCancelled = false;
    this.currentFolioIndex = 0;
    this.pages = [];
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    this.onPageAdvanceCallback = null;
    this.onCompleteCallback = null;
    this.timerId = null;

    if (this.synth) {
      this.initVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
      if (this.voices.length > 0) {
        this.selectedVoice = this.findBestTheatricalVoice();
      }
    } catch (e) {
      console.warn('[NarrationEngine] Voice enumeration deferred:', e);
    }
  }

  /**
   * Discovers the deepest, most natural theatrical English narrator available on the user's system.
   */
  findBestTheatricalVoice() {
    if (!this.voices || this.voices.length === 0) return null;

    // Prioritized list of natural / neural / theatrical English voice descriptors
    const theatricalPreferences = [
      'natural',
      'neural',
      'google uk english male',
      'microsoft guy online',
      'microsoft ryan online',
      'daniel',
      'george',
      'arthur',
      'oliver',
      'david',
      'alex',
      'google us english',
      'en-gb',
      'en_gb',
      'en-us',
    ];

    for (const pref of theatricalPreferences) {
      const match = this.voices.find((v) => {
        const name = (v.name || '').toLowerCase();
        const lang = (v.lang || '').toLowerCase();
        return (lang.startsWith('en') || lang.startsWith('en_') || lang.startsWith('en-')) &&
               (name.includes(pref) || lang.includes(pref));
      });
      if (match) return match;
    }

    // Fallback to any English voice
    const anyEn = this.voices.find((v) => v.lang.toLowerCase().startsWith('en'));
    if (anyEn) return anyEn;

    return this.voices[0] || null;
  }

  /**
   * Prepares narrative text into dramatic chunks with punctuation-aware pause markers.
   * Strips all UI artifacts (e.g., 'FOLIO 1 OF 3', markdown symbols) to speak strictly the literature.
   */
  prepareDramaticChunks(text) {
    if (!text) return [];

    // Strip markdown formatting & UI metadata
    const sanitized = text
      .replace(/^#+\s+/gm, '')
      .replace(/FOLIO\s+\d+\s+OF\s+\d+/gi, '')
      .replace(/---/g, '')
      .replace(/\*{1,3}/g, '')
      .replace(/\r\n/g, '\n')
      .trim();

    const paragraphs = sanitized
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const chunks = [];

    paragraphs.forEach((para) => {
      // Split into sentences or clauses (periods, question marks, exclamation, semicolons, em-dashes)
      const sentences = para.match(/[^.?!;—]+[.?!;—]+(\s|$)|[^.?!;—]+$/g) || [para];
      
      sentences.forEach((s) => {
        const trimmed = s.trim();
        if (trimmed) {
          chunks.push(trimmed);
          // Check if this sentence contains a profound philosophical contradiction
          const isContradiction = /\b(yet|however|contradiction|fear|free|trap|mirror|abyss|silence|death|meaning)\b/i.test(trimmed);
          if (isContradiction) {
            chunks.push('__DRAMATIC_PAUSE__');
          }
        }
      });

      chunks.push('__PARAGRAPH_PAUSE__');
    });

    return chunks;
  }

  /**
   * Public API: Speak narrative manuscript pages sequentially
   */
  speakNarrative(pages = [], onFolioChange = null, onComplete = null) {
    this.stopNarrative();
    if (!this.synth || !pages || pages.length === 0) return;

    this.isCancelled = false;
    this.isSpeaking = true;
    this.isPaused = false;
    this.pages = pages;
    this.currentFolioIndex = 0;
    this.onPageAdvanceCallback = onFolioChange;
    this.onCompleteCallback = onComplete;

    this.readFolio(0);
  }

  readFolio(folioIndex) {
    if (this.isCancelled || !this.synth) return;

    if (folioIndex >= this.pages.length) {
      this.isSpeaking = false;
      if (this.onCompleteCallback) this.onCompleteCallback();
      return;
    }

    this.currentFolioIndex = folioIndex;
    if (this.onPageAdvanceCallback) {
      this.onPageAdvanceCallback(folioIndex);
    }

    const folioText = this.pages[folioIndex];
    this.chunkQueue = this.prepareDramaticChunks(folioText);
    this.currentChunkIndex = 0;

    this.speakNextChunk();
  }

  speakNextChunk() {
    if (this.isCancelled || !this.synth) return;

    if (this.currentChunkIndex >= this.chunkQueue.length) {
      // End of current folio: take a solemn 1.8s breath pause before turning page
      this.timerId = setTimeout(() => {
        if (!this.isCancelled && this.isSpeaking) {
          this.readFolio(this.currentFolioIndex + 1);
        }
      }, 1800);
      return;
    }

    const chunk = this.chunkQueue[this.currentChunkIndex];
    this.currentChunkIndex += 1;

    // Handle structural dramatic pauses
    if (chunk === '__DRAMATIC_PAUSE__') {
      this.timerId = setTimeout(() => {
        this.speakNextChunk();
      }, 700);
      return;
    }

    if (chunk === '__PARAGRAPH_PAUSE__') {
      this.timerId = setTimeout(() => {
        this.speakNextChunk();
      }, 1100);
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }

      const utterance = new SpeechSynthesisUtterance(chunk);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      // Calm, reflective, slightly lowered pitch with measured cadence
      utterance.rate = 0.84;
      utterance.pitch = 0.92;
      utterance.volume = 0.95;

      utterance.onend = () => {
        if (!this.isCancelled) {
          // Natural breathing space between sentences
          this.timerId = setTimeout(() => {
            this.speakNextChunk();
          }, 380);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[NarrationEngine] Note:', e.error);
        }
        if (!this.isCancelled) {
          this.speakNextChunk();
        }
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('[NarrationEngine] Speak invocation note:', err);
    }
  }

  pauseNarrative() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resumeNarrative() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stopNarrative() {
    this.isCancelled = true;
    this.isSpeaking = false;
    this.isPaused = false;
    this.chunkQueue = [];
    this.currentChunkIndex = 0;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Safe silence
      }
    }
  }

  // Alias methods for compatibility
  stop() {
    this.stopNarrative();
  }

  startManuscriptNarration(pages, onPageChange, onComplete) {
    this.speakNarrative(pages, onPageChange, onComplete);
  }

  jumpToFolio(folioIndex) {
    if (!this.pages || folioIndex >= this.pages.length) return;
    this.stopNarrative();
    this.isCancelled = false;
    this.isSpeaking = true;
    this.readFolio(folioIndex);
  }
}

export const narrationEngine = new NarrationEngine();

export function speakNarrative(pages, onFolioChange, onComplete) {
  narrationEngine.speakNarrative(pages, onFolioChange, onComplete);
}

export function stopNarrative() {
  narrationEngine.stopNarrative();
}

export function pauseNarrative() {
  narrationEngine.pauseNarrative();
}

export function resumeNarrative() {
  narrationEngine.resumeNarrative();
}
