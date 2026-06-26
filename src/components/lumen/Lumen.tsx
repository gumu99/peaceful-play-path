import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientBackground } from "./AmbientBackground";
import { PadGrid } from "./PadGrid";
import { ControlBar, type Settings } from "./ControlBar";
import {
  ensureAudio,
  setDelay,
  setInstrument,
  setReverb,
  setVolume,
} from "@/lib/lumen/audio";

const STORAGE_KEY = "lumen.settings.v1";

const DEFAULTS: Settings = {
  scaleId: "calm",
  instrument: "crystal",
  volume: 0.8,
  reverb: 0.45,
  delay: 0.25,
};

export function Lumen() {
  const [started, setStarted] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);

  // Hydrate settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  // Apply audio settings
  useEffect(() => {
    if (!started) return;
    setVolume(settings.volume);
    setReverb(settings.reverb);
    setDelay(settings.delay);
    setInstrument(settings.instrument);
  }, [started, settings.volume, settings.reverb, settings.delay, settings.instrument]);

  const handleStart = async () => {
    await ensureAudio();
    setVolume(settings.volume);
    setReverb(settings.reverb);
    setDelay(settings.delay);
    setInstrument(settings.instrument);
    setStarted(true);
  };

  const update = (s: Partial<Settings>) =>
    setSettings((prev) => ({ ...prev, ...s }));

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <AmbientBackground />

      <header className="flex items-center justify-between px-6 pt-5 sm:px-10">
        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-glow-violet text-2xl font-medium tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Lumen
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            ambient pad
          </span>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">
          tap · hold · sweep
        </span>
      </header>

      <section className="flex flex-1 items-center justify-center px-4">
        <PadGrid rows={4} cols={4} scaleId={settings.scaleId} />
      </section>

      <footer className="px-4 pb-5 sm:px-6">
        <ControlBar settings={settings} onChange={update} />
      </footer>

      <AnimatePresence>
        {!started && (
          <motion.button
            type="button"
            onClick={handleStart}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 text-center"
            style={{ background: "oklch(0.09 0.02 270 / 0.85)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="font-display text-glow-violet text-6xl font-medium sm:text-7xl"
            >
              Lumen
            </motion.div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              An ambient music pad. Tap anywhere to begin — every note is in
              tune, every sound is calm.
            </p>
            <span
              className="rounded-full px-6 py-2.5 text-sm font-medium"
              style={{
                background: "var(--gradient-neon)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow-glow-violet)",
              }}
            >
              Tap to begin
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
