import { BEATS_PER_MEASURE, toTimeline, type Rhythm } from './rhythm';

export type PlayOptions = {
  tempo: number;
  countIn: boolean;
  metronome: boolean;
  onCountIn?: (beat: number) => void;
  onNote?: (index: number | null) => void;
  onEnd?: () => void;
};

type AudioContextCtor = typeof AudioContext;
type WindowWithWebkit = Window & { webkitAudioContext?: AudioContextCtor };
type NavigatorWithAudioSession = Navigator & { audioSession?: { type: string } };

const LEAD_TIME = 0.1;

let context: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let unlocked = false;
let stopCurrent: (() => void) | null = null;

function getCtor(): AudioContextCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext ?? (window as WindowWithWebkit).webkitAudioContext;
}

function getContext(): AudioContext | null {
  if (context) return context;
  const Ctor = getCtor();
  if (!Ctor) return null;
  context = new Ctor();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAll();
  });
  return context;
}

function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const length = Math.floor(ctx.sampleRate * 0.05);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buffer;
  return buffer;
}

export function isAudioSupported(): boolean {
  return getCtor() !== undefined;
}

export async function unlockAudio(): Promise<void> {
  if (typeof navigator !== 'undefined') {
    const { audioSession } = navigator as NavigatorWithAudioSession;
    if (audioSession) {
      try {
        audioSession.type = 'playback';
      } catch {
        // Not settable in every implementation.
      }
    }
  }
  const ctx = getContext();
  if (!ctx) return;
  if (!unlocked) {
    unlocked = true;
    const source = ctx.createBufferSource();
    source.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    source.connect(ctx.destination);
    source.start(0);
  }
  if (ctx.state !== 'running') {
    try {
      await ctx.resume();
    } catch {
      // Resume fails outside a user gesture; the next gesture retries.
    }
  }
}

function envelope(gain: GainNode, time: number, peak: number, decay: number) {
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + decay);
}

function scheduleClick(
  ctx: AudioContext,
  out: AudioNode,
  sources: AudioScheduledSourceNode[],
  time: number,
  accent: boolean,
  volume: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(accent ? 3200 : 2400, time);
  envelope(gain, time, volume * (accent ? 1 : 0.75), 0.025);
  osc.connect(gain).connect(out);
  osc.start(time);
  osc.stop(time + 0.03);
  sources.push(osc);
}

function scheduleWoodblock(
  ctx: AudioContext,
  out: AudioNode,
  sources: AudioScheduledSourceNode[],
  time: number,
  maxLength: number,
) {
  // The tail must end within the note's own duration so nothing rings into a following rest.
  const length = Math.max(0.01, maxLength);
  const toneEnd = Math.min(0.1, length);

  const osc = ctx.createOscillator();
  const toneGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, time);
  osc.frequency.exponentialRampToValueAtTime(380, time + 0.06);
  envelope(toneGain, time, 0.5, Math.min(0.09, length));
  osc.connect(toneGain).connect(out);
  osc.start(time);
  osc.stop(time + toneEnd);
  sources.push(osc);

  // Quiet second partial so small phone speakers still carry the note.
  const partial = ctx.createOscillator();
  const partialGain = ctx.createGain();
  partial.type = 'sine';
  partial.frequency.setValueAtTime(880, time);
  partial.frequency.exponentialRampToValueAtTime(760, time + 0.06);
  envelope(partialGain, time, 0.12, Math.min(0.05, length));
  partial.connect(partialGain).connect(out);
  partial.start(time);
  partial.stop(time + toneEnd);
  sources.push(partial);

  const noise = ctx.createBufferSource();
  noise.buffer = getNoise(ctx);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 900;
  filter.Q.value = 1.2;
  const noiseGain = ctx.createGain();
  envelope(noiseGain, time, 0.18, Math.min(0.025, length));
  noise.connect(filter).connect(noiseGain).connect(out);
  noise.start(time);
  noise.stop(time + Math.min(0.05, length));
  sources.push(noise);
}

export function stopAll(): void {
  stopCurrent?.();
}

export function playRhythm(rhythm: Rhythm, options: PlayOptions): () => void {
  stopAll();
  const ctx = getContext();
  if (!ctx) return () => {};
  // Safari reports 'interrupted' after a call or a backgrounded tab, which also needs a resume.
  if (ctx.state !== 'running' && ctx.state !== 'closed') void ctx.resume().catch(() => {});

  const { onCountIn, onNote, onEnd } = options;
  const beat = 60 / Math.max(1, options.tempo);
  const timeline = toTimeline(rhythm);
  const totalBeats = rhythm.measures.length * BEATS_PER_MEASURE;

  const master = ctx.createGain();
  master.gain.value = 1;
  master.connect(ctx.destination);
  const sources: AudioScheduledSourceNode[] = [];

  const t0 = ctx.currentTime + LEAD_TIME;
  const countTimes = options.countIn
    ? Array.from({ length: BEATS_PER_MEASURE }, (_, i) => t0 + i * beat)
    : [];
  const rhythmStart = t0 + countTimes.length * beat;
  const endTime = rhythmStart + totalBeats * beat;

  countTimes.forEach((time, i) => scheduleClick(ctx, master, sources, time, i === 0, 0.35));
  if (options.metronome) {
    const rests = timeline.filter((note) => note.rest);
    const inRest = (b: number) =>
      rests.some((rest) => b >= rest.start - 1e-6 && b < rest.start + rest.duration - 1e-6);
    for (let b = 0; b < totalBeats; b++) {
      if (inRest(b)) continue;
      const time = rhythmStart + b * beat;
      scheduleClick(ctx, master, sources, time, b % BEATS_PER_MEASURE === 0, 0.1);
    }
  }
  for (const note of timeline) {
    if (note.rest) continue;
    const time = rhythmStart + note.start * beat;
    scheduleWoodblock(ctx, master, sources, time, note.duration * beat - 0.005);
  }

  let stopped = false;
  let frame = 0;
  let nextCount = 0;
  let noteCursor = 0;
  let activeNote: number | null = null;

  const setActive = (index: number | null) => {
    if (index === activeNote) return;
    activeNote = index;
    onNote?.(index);
  };

  const release = (fade: boolean) => {
    const now = ctx.currentTime;
    if (fade) {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.015);
      for (const source of sources) {
        try {
          source.stop(now + 0.02);
        } catch {
          // Already stopped.
        }
      }
    }
    window.setTimeout(() => master.disconnect(), fade ? 60 : 300);
  };

  const finish = (natural: boolean) => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    if (stopCurrent === stop) stopCurrent = null;
    release(!natural);
    setActive(null);
    if (natural) onEnd?.();
  };

  const stop = () => finish(false);

  const tick = () => {
    if (stopped) return;
    // Visuals follow what is heard, so shift by the output latency where the browser reports it.
    const latency = Number.isFinite(ctx.outputLatency) ? Math.max(0, ctx.outputLatency) : 0;
    const now = ctx.currentTime - latency;

    while (nextCount < countTimes.length && now >= countTimes[nextCount]) {
      nextCount++;
      onCountIn?.(nextCount);
    }

    if (now >= endTime) {
      finish(true);
      return;
    }

    if (now < rhythmStart) {
      setActive(null);
    } else {
      const beatPos = (now - rhythmStart) / beat;
      while (
        noteCursor < timeline.length - 1 &&
        beatPos >= timeline[noteCursor].start + timeline[noteCursor].duration
      ) {
        noteCursor++;
      }
      const note = timeline[noteCursor];
      const inside = note && beatPos >= note.start && beatPos < note.start + note.duration;
      setActive(inside ? note.index : null);
    }

    frame = requestAnimationFrame(tick);
  };

  stopCurrent = stop;
  frame = requestAnimationFrame(tick);
  return stop;
}
