import * as Tone from "tone";

export type InstrumentId = "crystal" | "bells" | "pluck" | "pad";

interface Nodes {
  reverb: Tone.Reverb;
  delay: Tone.FeedbackDelay;
  gain: Tone.Gain;
  instrument: Tone.PolySynth;
  drone?: Tone.PolySynth;
  droneGain?: Tone.Gain;
}

let nodes: Nodes | null = null;
let currentInstrument: InstrumentId = "crystal";

function buildInstrument(id: InstrumentId): Tone.PolySynth {
  switch (id) {
    case "bells":
      return new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3.5,
        modulationIndex: 10,
        envelope: { attack: 0.005, decay: 1.2, sustain: 0, release: 2.5 },
        modulationEnvelope: { attack: 0.01, decay: 0.6, sustain: 0, release: 1.5 },
      });
    case "pluck":
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.002, decay: 0.4, sustain: 0, release: 1.2 },
      });
    case "pad":
      return new Tone.PolySynth(Tone.AMSynth, {
        harmonicity: 2,
        envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 3 },
      });
    case "crystal":
    default:
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine" },
        envelope: { attack: 0.005, decay: 0.8, sustain: 0.05, release: 2.5 },
      });
  }
}

export async function ensureAudio(): Promise<void> {
  if (nodes) {
    if (Tone.getContext().state !== "running") await Tone.start();
    return;
  }
  await Tone.start();

  const gain = new Tone.Gain(0.8).toDestination();
  const reverb = new Tone.Reverb({ decay: 6, wet: 0.45 }).connect(gain);
  const delay = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.3, wet: 0.25 }).connect(reverb);
  const instrument = buildInstrument(currentInstrument).connect(delay);

  // Ambient drone underneath
  const droneGain = new Tone.Gain(0.06).connect(reverb);
  const drone = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 1.5,
    envelope: { attack: 4, decay: 1, sustain: 1, release: 6 },
  }).connect(droneGain);
  drone.triggerAttack(["C2", "G2", "D#3"]);

  nodes = { reverb, delay, gain, instrument, drone, droneGain };
}

export function setInstrument(id: InstrumentId) {
  currentInstrument = id;
  if (!nodes) return;
  nodes.instrument.disconnect();
  nodes.instrument.dispose();
  nodes.instrument = buildInstrument(id).connect(nodes.delay);
}

export function setVolume(v: number) {
  if (nodes) nodes.gain.gain.rampTo(v, 0.1);
}

export function setReverb(v: number) {
  if (nodes) nodes.reverb.wet.rampTo(v, 0.1);
}

export function setDelay(v: number) {
  if (nodes) nodes.delay.wet.rampTo(v, 0.1);
}

export function playNote(note: string, duration: string = "2n") {
  if (!nodes) return;
  try {
    nodes.instrument.triggerAttackRelease(note, duration, undefined, 0.7);
  } catch {
    /* ignore overlap errors */
  }
}
