import { useEffect, useState } from "react";
import runGif from "@/assets/fast-run.gif";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
    const onLoad = () => setTimeout(() => setVisible(false), 400);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500"
    >
      <img src={runGif} alt="" width={160} height={160} className="select-none" />
      <p className="mt-6 text-lg font-semibold text-primary">Fetching furry friends…</p>
    </div>
  );
}
