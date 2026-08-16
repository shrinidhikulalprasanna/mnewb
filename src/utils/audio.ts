// Web Audio API Sound Synthesizer Engine
// Generates warm, sweet sound effects and melody without external audio files!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private melodyTimeoutId: number | null = null;
  private isMelodyPlaying: boolean = false;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMelodyPlaying) {
      this.stopMelody();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft note player helper with warm acoustic envelope
  private playTone(freq: number, type: OscillatorType, startTime: number, duration: number, volume: number = 0.15) {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore audio failure
    }
  }

  // Cute tap sound
  public playTap() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    this.playTone(659.25, "sine", now, 0.08, 0.12); // E5
  }

  // Candle blow whoosh & smoke sound
  public playCandleBlow() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();

      // Soft magical twinkle
      this.playTone(880, "sine", ctx.currentTime + 0.1, 0.2, 0.08);
      this.playTone(1174.66, "sine", ctx.currentTime + 0.2, 0.25, 0.06);
    } catch {
      // Fallback
    }
  }

  // Confetti explosive fanfare sound
  public playConfettiFanfare() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const notes = [
      { f: 523.25, d: 0.15, t: 0.0 }, // C5
      { f: 659.25, d: 0.15, t: 0.1 }, // E5
      { f: 783.99, d: 0.2, t: 0.2 },  // G5
      { f: 1046.50, d: 0.6, t: 0.35 },// C6
      { f: 1318.51, d: 0.7, t: 0.4 }, // E6
      { f: 1567.98, d: 0.8, t: 0.45 },// G6
    ];

    notes.forEach((n) => {
      this.playTone(n.f, "triangle", now + n.t, n.d, 0.16);
    });
  }

  // Scratch card friction sound
  public playScratch() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    // Micro high sparkle
    const randomFreq = 800 + Math.random() * 400;
    this.playTone(randomFreq, "sine", now, 0.04, 0.05);
  }

  // Slot machine spinning tick
  public playSlotTick() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;
    this.playTone(900 + Math.random() * 200, "triangle", now, 0.05, 0.1);
  }

  // Slot machine winner fanfare
  public playSlotWin() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    const chords = [587.33, 739.99, 880.0, 1174.66]; // D maj
    chords.forEach((f, idx) => {
      this.playTone(f, "sine", now + idx * 0.08, 0.4, 0.15);
    });
  }

  // Envelope seal crack / open swoosh
  public playEnvelopeOpen() {
    const ctx = this.getContext();
    if (!ctx || this.isMuted) return;
    const now = ctx.currentTime;

    this.playTone(440, "sine", now, 0.2, 0.1);
    this.playTone(554.37, "sine", now + 0.1, 0.25, 0.12);
    this.playTone(659.25, "sine", now + 0.2, 0.35, 0.15);
    this.playTone(880, "sine", now + 0.3, 0.5, 0.18);
  }

  // Synthesized Lofi "Happy Birthday" Melodic Loop
  public startMelody() {
    if (this.isMelodyPlaying || this.isMuted) return;
    this.isMelodyPlaying = true;
    this.loopMelody();
  }

  public stopMelody() {
    this.isMelodyPlaying = false;
    if (this.melodyTimeoutId) {
      window.clearTimeout(this.melodyTimeoutId);
      this.melodyTimeoutId = null;
    }
  }

  public isPlaying(): boolean {
    return this.isMelodyPlaying;
  }

  private loopMelody() {
    if (!this.isMelodyPlaying || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.0, A4 = 440.0, Bb4 = 466.16, C5 = 523.25;

    // Melody sheet: [note, duration in seconds]
    const notes: Array<[number, number]> = [
      [C4, 0.35], [C4, 0.18], [D4, 0.5], [C4, 0.5], [F4, 0.5], [E4, 0.9],
      [C4, 0.35], [C4, 0.18], [D4, 0.5], [C4, 0.5], [G4, 0.5], [F4, 0.9],
      [C4, 0.35], [C4, 0.18], [C5, 0.5], [A4, 0.5], [F4, 0.5], [E4, 0.5], [D4, 0.8],
      [Bb4, 0.35], [Bb4, 0.18], [A4, 0.5], [F4, 0.5], [G4, 0.5], [F4, 1.1],
    ];

    let offset = 0;
    const now = ctx.currentTime + 0.05;

    notes.forEach(([freq, dur]) => {
      if (this.isMelodyPlaying && !this.isMuted) {
        // Main music box chime
        this.playTone(freq, "sine", now + offset, dur * 0.9, 0.07);
        // Soft harmonic overtone
        this.playTone(freq * 2, "sine", now + offset, dur * 0.5, 0.02);
      }
      offset += dur * 0.95;
    });

    const totalMelodyDurationMs = (offset + 1.5) * 1000;

    this.melodyTimeoutId = window.setTimeout(() => {
      if (this.isMelodyPlaying) {
        this.loopMelody();
      }
    }, totalMelodyDurationMs);
  }
}

export const sound = new SoundEngine();
