import { Slider } from "@/components/ui/slider";
import { SCALES, type ScaleId } from "@/lib/lumen/scales";
import type { InstrumentId } from "@/lib/lumen/audio";

export interface Settings {
  scaleId: ScaleId;
  instrument: InstrumentId;
  volume: number;
  reverb: number;
  delay: number;
}

interface Props {
  settings: Settings;
  onChange: (s: Partial<Settings>) => void;
}

const INSTRUMENTS: { id: InstrumentId; label: string }[] = [
  { id: "crystal", label: "Crystal" },
  { id: "bells", label: "Bells" },
  { id: "pluck", label: "Pluck" },
  { id: "pad", label: "Pad" },
];

export function ControlBar({ settings, onChange }: Props) {
  return (
    <div
      className="pointer-events-auto mx-auto flex w-full max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 px-5 py-4 backdrop-blur-xl"
      style={{ background: "oklch(0.16 0.03 270 / 0.6)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {Object.values(SCALES).map((s) => (
            <button
              key={s.id}
              onClick={() => onChange({ scaleId: s.id })}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all"
              style={{
                background:
                  settings.scaleId === s.id
                    ? "var(--gradient-neon)"
                    : "transparent",
                color:
                  settings.scaleId === s.id
                    ? "var(--primary-foreground)"
                    : "var(--muted-foreground)",
                border:
                  settings.scaleId === s.id
                    ? "1px solid transparent"
                    : "1px solid var(--border)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INSTRUMENTS.map((i) => (
            <button
              key={i.id}
              onClick={() => onChange({ instrument: i.id })}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all"
              style={{
                background:
                  settings.instrument === i.id
                    ? "oklch(0.82 0.13 195 / 0.18)"
                    : "transparent",
                color:
                  settings.instrument === i.id
                    ? "var(--neon-cyan)"
                    : "var(--muted-foreground)",
                border: `1px solid ${
                  settings.instrument === i.id
                    ? "var(--neon-cyan)"
                    : "var(--border)"
                }`,
              }}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SliderRow
          label="Volume"
          value={settings.volume}
          onChange={(v) => onChange({ volume: v })}
        />
        <SliderRow
          label="Reverb"
          value={settings.reverb}
          onChange={(v) => onChange({ reverb: v })}
        />
        <SliderRow
          label="Echo"
          value={settings.delay}
          onChange={(v) => onChange({ delay: v })}
        />
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <Slider
        value={[value * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(v) => onChange((v[0] ?? 0) / 100)}
        className="flex-1"
      />
    </div>
  );
}
