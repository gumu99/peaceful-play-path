export type ScaleId = "calm" | "dreamy" | "mystic" | "warm";

export interface Scale {
  id: ScaleId;
  label: string;
  // semitone offsets relative to root
  intervals: number[];
  rootMidi: number; // base note
}

export const SCALES: Record<ScaleId, Scale> = {
  calm:   { id: "calm",   label: "Calm",   intervals: [0, 3, 5, 7, 10], rootMidi: 48 }, // C minor pent
  dreamy: { id: "dreamy", label: "Dreamy", intervals: [0, 2, 4, 7, 9],  rootMidi: 50 }, // D major pent
  mystic: { id: "mystic", label: "Mystic", intervals: [0, 1, 5, 7, 8],  rootMidi: 52 }, // Hirajoshi-ish
  warm:   { id: "warm",   label: "Warm",   intervals: [0, 2, 4, 6, 7, 9, 11], rootMidi: 53 }, // F lydian
};

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiToNote(midi: number): string {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}

/** Map (row, col) of a grid into a note. Rows = pitch (top = high). */
export function padNote(
  scale: Scale,
  rows: number,
  cols: number,
  row: number,
  col: number,
): string {
  const ivl = scale.intervals;
  // Sweep notes across the grid; rows raise by octave bands.
  const colIdx = col % ivl.length;
  const octaveBoost = Math.floor((cols * (rows - 1 - row) + col) / ivl.length);
  const midi = scale.rootMidi + ivl[colIdx] + octaveBoost * 2;
  return midiToNote(Math.min(96, Math.max(24, midi)));
}
