class ToneGenerator {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public play() {
    if (this.isPlaying) return;
    this.init();
    if (!this.audioCtx) return;

    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    this.oscillator.type = "sine";
    this.oscillator.frequency.value = 396; // 396 Hz - associated with removing fear/guilt

    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.1, this.audioCtx.currentTime + 3); // 3 sec fade in

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.oscillator.start();
    this.isPlaying = true;
  }

  public stop() {
    if (!this.isPlaying || !this.audioCtx || !this.gainNode || !this.oscillator) return;
    
    // Fade out
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioCtx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 2);

    this.oscillator.stop(this.audioCtx.currentTime + 2);
    
    setTimeout(() => {
      this.oscillator?.disconnect();
      this.gainNode?.disconnect();
      this.oscillator = null;
      this.gainNode = null;
      this.isPlaying = false;
    }, 2000);
  }

  public toggle(force?: boolean) {
    if (force !== undefined) {
      if (force && !this.isPlaying) this.play();
      else if (!force && this.isPlaying) this.stop();
      return;
    }
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }
}

export const toneFeature = new ToneGenerator();
