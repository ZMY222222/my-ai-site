type Subscriber = (energy: number) => void;

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
const subs = new Set<Subscriber>();
let raf = 0;
let lastEnergy = 0;

function getOrCreateCtx() {
  if (!audioCtx) {
    const ctx = new AudioContext();
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    an.smoothingTimeConstant = 0.7;
    an.connect(ctx.destination);
    audioCtx = ctx;
    analyser = an;
  }
  return { audioCtx: audioCtx!, analyser: analyser! };
}

export function connectAudio(el: HTMLAudioElement) {
  const { audioCtx: ctx, analyser: an } = getOrCreateCtx();
  if (sourceNode) {
    try { sourceNode.disconnect(); } catch {}
    sourceNode = null;
  }
  try {
    sourceNode = ctx.createMediaElementSource(el);
    sourceNode.connect(an);
  } catch {
    // already connected or cross-origin
  }
  startLoop();
}

function startLoop() {
  if (raf) return;
  const data = new Uint8Array(256);
  function tick() {
    const an = analyser;
    if (!an) return;
    an.getByteFrequencyData(data);
    // bass energy: average of first 8 bins (roughly < 170 Hz)
    let sum = 0;
    for (let i = 0; i < 8; i++) sum += data[i];
    const energy = sum / (8 * 255);
    // smooth transitions
    lastEnergy = lastEnergy * 0.6 + energy * 0.4;
    for (const fn of subs) fn(lastEnergy);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
}

export function subscribe(fn: Subscriber) {
  subs.add(fn);
  return () => { subs.delete(fn); };
}
