import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Polar — Build Web3 Apps on Avalanche";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0B101B",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,65,66,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Snowflake icon */}
        <svg
          width="72"
          height="72"
          viewBox="0 0 32 32"
          fill="none"
          stroke="#E84142"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ marginBottom: 32 }}
        >
          <g transform="translate(16,16)">
            <line x1="0" y1="-12" x2="0" y2="12" />
            <line x1="-10.39" y1="-6" x2="10.39" y2="6" />
            <line x1="-10.39" y1="6" x2="10.39" y2="-6" />
            <line x1="0" y1="-12" x2="-3.5" y2="-8.5" />
            <line x1="0" y1="-12" x2="3.5" y2="-8.5" />
            <line x1="0" y1="12" x2="-3.5" y2="8.5" />
            <line x1="0" y1="12" x2="3.5" y2="8.5" />
            <line x1="-10.39" y1="-6" x2="-7" y2="-2" />
            <line x1="-10.39" y1="-6" x2="-6.5" y2="-6.5" />
            <line x1="10.39" y1="6" x2="7" y2="2" />
            <line x1="10.39" y1="6" x2="6.5" y2="6.5" />
          </g>
        </svg>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          POLAR
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "#8b919e",
            fontWeight: 400,
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Build apps that live forever on Avalanche
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#E84142",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
