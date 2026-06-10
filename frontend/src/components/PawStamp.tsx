import { useEffect, useState } from "react";

export function PawStamp({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"slam" | "fade">("slam");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 700);
    const t2 = setTimeout(onDone, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center bg-black/80 transition-opacity duration-700 ${phase === "fade" ? "opacity-0" : "opacity-100"}`}
      style={{ pointerEvents: phase === "fade" ? "none" : "auto" }}
    >
      <svg
        viewBox="0 0 200 200"
        className={`h-[60vmin] w-[60vmin] text-primary drop-shadow-[0_0_40px_rgba(167,139,250,0.6)] ${phase === "slam" ? "animate-[stamp_0.7s_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
        fill="currentColor"
      >
        <ellipse cx="100" cy="130" rx="45" ry="38" />
        <ellipse cx="50" cy="80" rx="18" ry="24" />
        <ellipse cx="85" cy="55" rx="18" ry="26" />
        <ellipse cx="125" cy="55" rx="18" ry="26" />
        <ellipse cx="160" cy="80" rx="18" ry="24" />
      </svg>
      <style>{`@keyframes stamp { 0% { transform: scale(3); opacity: 0; } 40% { transform: scale(0.92); opacity: 1; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
