import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#030712",
          color: "#9ef7c1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <p style={{ letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Classified Portfolio
        </p>
        <h1 style={{ fontSize: 72, margin: "20px 0", color: "#ecfdf5" }}>
          Xander Nova
        </h1>
        <p style={{ fontSize: 32, color: "#d1fae5" }}>
          Internal systems for high-trust teams.
        </p>
      </div>
    ),
    size,
  );
}

