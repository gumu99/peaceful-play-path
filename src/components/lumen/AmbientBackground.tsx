export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--neon-violet), transparent 60%)",
          animation: "orb-drift 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full opacity-35 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--neon-cyan), transparent 60%)",
          animation: "orb-drift 22s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[34rem] w-[34rem] rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--neon-pink), transparent 60%)",
          animation: "orb-drift 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
