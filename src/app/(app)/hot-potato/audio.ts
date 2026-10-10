type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

export class BombAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  // Must run inside a user gesture, otherwise iOS keeps the context suspended.
  unlock() {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
        if (!Ctor) return;
        // Lets iOS play Web Audio even when the ringer switch is on silent.
        const session = (navigator as AudioSessionNavigator).audioSession;
        if (session) session.type = 'playback';
        this.ctx = new Ctor();
      }
      if (this.ctx.state !== 'running') this.ctx.resume().catch(() => {});
      const silent = this.ctx.createBufferSource();
      silent.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
      silent.connect(this.ctx.destination);
      silent.start();
    } catch {
      this.ctx = null;
    }
  }

  private output() {
    if (!this.ctx || this.ctx.state === 'closed') return null;
    if (!this.master) {
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.8;
      this.master.connect(this.ctx.destination);
    }
    return { ctx: this.ctx, out: this.master };
  }

  tick(accent: boolean) {
    const target = this.output();
    if (!target) return;
    const { ctx, out } = target;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = accent ? 1500 : 1100;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  explode() {
    const target = this.output();
    if (!target) return;
    const { ctx, out } = target;
    const t = ctx.currentTime;

    if (!this.noise) {
      const length = Math.floor(ctx.sampleRate * 1.6);
      this.noise = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = this.noise.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = this.noise;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + 1.4);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    source.connect(filter).connect(noiseGain).connect(out);
    source.start(t);
    source.stop(t + 1.6);

    const thump = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(100, t);
    thump.frequency.exponentialRampToValueAtTime(30, t + 0.8);
    thumpGain.gain.setValueAtTime(1, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    thump.connect(thumpGain).connect(out);
    thump.start(t);
    thump.stop(t + 1);
  }

  // Cuts every sound that is still playing. The next sound reconnects a fresh output.
  stop() {
    try {
      this.master?.disconnect();
    } catch {}
    this.master = null;
  }

  close() {
    this.stop();
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.noise = null;
  }
}
