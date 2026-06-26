import { createFileRoute } from "@tanstack/react-router";
import { Lumen } from "@/components/lumen/Lumen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Ambient Music Pad" },
      {
        name: "description",
        content:
          "A satisfying, easy-to-play ambient music pad. Tap, hold, and sweep glowing pads to create calming neon soundscapes.",
      },
      { property: "og:title", content: "Lumen — Ambient Music Pad" },
      {
        property: "og:description",
        content:
          "Tap glowing pads, create beautiful music. A relaxation game where nothing can sound wrong.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Lumen />;
}
