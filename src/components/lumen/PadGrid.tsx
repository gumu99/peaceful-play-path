import { useCallback, useEffect, useRef, useState } from "react";
import { Pad } from "./Pad";
import { padNote, SCALES, type ScaleId } from "@/lib/lumen/scales";
import { playNote } from "@/lib/lumen/audio";

interface PadGridProps {
  rows: number;
  cols: number;
  scaleId: ScaleId;
}

export function PadGrid({ rows, cols, scaleId }: PadGridProps) {
  const [active, setActive] = useState<Record<string, number>>({});
  const lastPad = useRef<string | null>(null);
  const isDown = useRef(false);

  const trigger = useCallback(
    (row: number, col: number) => {
      const key = `${row}-${col}`;
      if (lastPad.current === key) return;
      lastPad.current = key;
      const scale = SCALES[scaleId];
      const note = padNote(scale, rows, cols, row, col);
      playNote(note);
      setActive((a) => ({ ...a, [key]: (a[key] ?? 0) + 1 }));
    },
    [rows, cols, scaleId],
  );

  const handlePointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      const pad = el?.closest<HTMLElement>("[data-pad]");
      if (!pad) return;
      const row = Number(pad.dataset.row);
      const col = Number(pad.dataset.col);
      trigger(row, col);
    },
    [trigger],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDown.current) return;
      handlePointer(e.clientX, e.clientY);
    };
    const onUp = () => {
      isDown.current = false;
      lastPad.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [handlePointer]);

  return (
    <div
      className="grid w-full max-w-[min(92vw,72vh)] gap-2 sm:gap-3"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      onPointerDown={(e) => {
        isDown.current = true;
        lastPad.current = null;
        handlePointer(e.clientX, e.clientY);
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const key = `${row}-${col}`;
        const hue = (row * cols + col) / (rows * cols);
        return (
          <Pad
            key={`${key}-${active[key] ?? 0}`}
            row={row}
            col={col}
            active={(active[key] ?? 0) > 0}
            hue={hue}
          />
        );
      })}
    </div>
  );
}
