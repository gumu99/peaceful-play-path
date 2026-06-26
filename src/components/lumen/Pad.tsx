import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PadProps {
  row: number;
  col: number;
  active: boolean;
  hue: number; // 0..1 — position across grid for color blend
}

export function Pad({ row, col, active, hue }: PadProps) {
  const [pulses, setPulses] = useState<number[]>([]);

  useEffect(() => {
    if (!active) return;
    const id = Date.now() + Math.random();
    setPulses((p) => [...p, id]);
    const t = setTimeout(() => {
      setPulses((p) => p.filter((x) => x !== id));
    }, 900);
    return () => clearTimeout(t);
  }, [active]);

  // Blend violet <-> cyan based on position
  const color = hue < 0.5 ? "var(--neon-violet)" : "var(--neon-cyan)";
  const altColor = hue < 0.5 ? "var(--neon-cyan)" : "var(--neon-pink)";

  return (
    <div
      data-pad
      data-row={row}
      data-col={col}
      className="relative aspect-square select-none"
    >
      <motion.div
        className="absolute inset-1 rounded-2xl border"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%), radial-gradient(circle at 70% 80%, ${altColor}, transparent 75%)`,
          borderColor: "var(--border)",
          opacity: 0.55,
          animation: `breathe ${4 + ((row + col) % 5)}s ease-in-out infinite`,
        }}
        animate={{
          scale: active ? 0.92 : 1,
          opacity: active ? 1 : undefined,
          boxShadow: active
            ? `0 0 40px ${color}, 0 0 80px ${color}`
            : "0 0 0px transparent",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      />
      <AnimatePresence>
        {pulses.map((id) => (
          <motion.span
            key={id}
            className="pointer-events-none absolute inset-1 rounded-2xl"
            style={{
              border: `2px solid ${color}`,
              boxShadow: `0 0 30px ${color}`,
            }}
            initial={{ scale: 0.7, opacity: 0.9 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
