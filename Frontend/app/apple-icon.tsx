import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "hsl(160, 70%, 45%)",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 28,
              height: 72,
              background: "white",
              borderRadius: 8,
            }}
          />
          <div
            style={{
              width: 14,
              height: 42,
              background: "white",
              borderRadius: 4,
              marginLeft: 4,
            }}
          />
          <div
            style={{
              width: 56,
              height: 18,
              background: "white",
              borderRadius: 8,
              marginLeft: 2,
              marginRight: 2,
            }}
          />
          <div
            style={{
              width: 14,
              height: 42,
              background: "white",
              borderRadius: 4,
              marginRight: 4,
            }}
          />
          <div
            style={{
              width: 28,
              height: 72,
              background: "white",
              borderRadius: 8,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
