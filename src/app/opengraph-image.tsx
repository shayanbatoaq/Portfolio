import { ImageResponse } from "next/og";

export const alt = "Shayan Batoaq — Full-Stack & AI Product Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Keep social previews in code so the professional positioning stays editable.
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", padding: "72px", background: "radial-gradient(circle at 90% 15%, #20143c, #07070f 65%)", color: "white", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", color: "#78b7ff", fontSize: 22, letterSpacing: 5, marginBottom: 32 }}>SOFTWARE · PRODUCT · APPLIED AI</div>
      <div style={{ display: "flex", fontSize: 88, fontWeight: 700, letterSpacing: -4 }}>Shayan Batoaq</div>
      <div style={{ display: "flex", fontSize: 35, color: "#c4b5fd", marginTop: 24 }}>Full-Stack &amp; AI Product Engineer</div>
      <div style={{ display: "flex", fontSize: 23, color: "#a4a4b4", marginTop: 48 }}>TypeScript · Next.js · Python · FastAPI</div>
      <div style={{ display: "flex", fontSize: 21, color: "#77778d", marginTop: 16 }}>Creator of LapSignal · Co-founder of Patricians</div>
    </div>,
    size,
  );
}
