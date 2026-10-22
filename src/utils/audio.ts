// Web Speech API and Web Audio API synthesized sound effects

class AudioService {
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Initialized lazily on first user gesture
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.92; // Comfortable speed for elementary school children
      utterance.pitch = 1.05;

      // Try finding Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }

  // Synthesised Sound Effects using Web Audio API
  public playCorrectSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.26);
    });
  }

  public playEncouragingSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Gentle soft dual tone (G4 -> E4), positive and warm
    const notes = [392.0, 329.63];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + idx * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  public playWrongSound() {
    this.playEncouragingSound();
  }

  public speakText(text: string, onEnd?: () => void) {
    this.speak(text, onEnd);
  }

  public playDiceRollSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 200 + Math.random() * 400;

      const startTime = ctx.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.06);
    }
  }

  public playFanfareSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const chords = [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.1 },
      { freq: 783.99, time: 0.2 },
      { freq: 1046.5, time: 0.35 },
      { freq: 1318.51, time: 0.5 },
    ];

    chords.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = ctx.currentTime + time;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  public playClickSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playBellSound() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    // Pleasant school bell chime (880Hz -> 440Hz harmonic decay)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.82);
  }

  public playLevelUpSound() {
    this.playFanfareSound();
  }
}

export const audioManager = new AudioService();
