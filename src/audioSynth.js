// audioSynth.js - Web Audio API Synthesizer for game sounds

let audioCtx = null;
let isMuted = false;

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// ─── GLOBAL MUTE ────────────────────────────────────────────
export function getIsMuted() {
  return isMuted;
}

export function toggleGlobalMute() {
  isMuted = !isMuted;
  if (isMuted) {
    stopAmbientSound();
  }
  return isMuted;
}


// ─── DICE SOUND ─────────────────────────────────────────────
export function playDiceSound() {
  if (isMuted) return;
  const ctx = getContext();

  const numBounces = Math.floor(Math.random() * 3) + 3;
  let startTime = ctx.currentTime;

  for (let i = 0; i < numBounces; i++) {
    playClick(ctx, startTime);
    startTime += 0.05 + (i * 0.05);
  }
}

function playClick(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.05);

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.6, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

  filter.type = 'lowpass';
  filter.frequency.value = 1000;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.06);
}

// ─── MOVE / SLIDE SOUND ─────────────────────────────────────
// Soft, short white-noise "swish" instead of a tonal blip
export function playMoveSound() {
  if (isMuted) return;
  const ctx = getContext();
  const time = ctx.currentTime;

  // Short burst of filtered noise = slide/swish
  const bufLen = Math.floor(ctx.sampleRate * 0.08); // 80ms
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2000, time);
  filter.frequency.exponentialRampToValueAtTime(4000, time + 0.08);
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  src.start(time);
  src.stop(time + 0.09);
}

// ─── AMBIENT BACKGROUND SOUND ───────────────────────────────
let ambientGainNode = null;
let ambientSourceNode = null;
let ambientFilterNode = null;
let isAmbientPlaying = false;

export function startAmbientSound() {
  if (isMuted) return;
  if (isAmbientPlaying) return;

  const ctx = getContext();

  // Generate Brown Noise buffer (2 seconds, looped)
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    data[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5;
  }

  ambientSourceNode = ctx.createBufferSource();
  ambientSourceNode.buffer = buffer;
  ambientSourceNode.loop = true;

  ambientFilterNode = ctx.createBiquadFilter();
  ambientFilterNode.type = 'lowpass';
  ambientFilterNode.frequency.value = 350;

  ambientGainNode = ctx.createGain();
  ambientGainNode.gain.setValueAtTime(0, ctx.currentTime);
  ambientGainNode.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3);

  ambientSourceNode.connect(ambientFilterNode);
  ambientFilterNode.connect(ambientGainNode);
  ambientGainNode.connect(ctx.destination);

  ambientSourceNode.start();
  isAmbientPlaying = true;
}

export function stopAmbientSound() {
  if (!isAmbientPlaying) return;

  try {
    if (ambientGainNode && audioCtx) {
      ambientGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, audioCtx.currentTime);
      ambientGainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
    }
    setTimeout(() => {
      try {
        if (ambientSourceNode) {
          ambientSourceNode.stop();
        }
      } catch (e) { /* already stopped */ }
      ambientSourceNode = null;
      ambientGainNode = null;
      ambientFilterNode = null;
      isAmbientPlaying = false;
    }, 600);
  } catch (e) {
    ambientSourceNode = null;
    ambientGainNode = null;
    ambientFilterNode = null;
    isAmbientPlaying = false;
  }
}

export function toggleAmbientSound(forceState) {
  const newState = forceState !== undefined ? forceState : !isAmbientPlaying;
  if (newState) {
    startAmbientSound();
  } else {
    stopAmbientSound();
  }
  return newState;
}

export function isAmbientActive() {
  return isAmbientPlaying;
}
