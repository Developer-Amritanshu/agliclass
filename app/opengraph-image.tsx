import { ImageResponse } from "next/og";

export const alt = "AgliClass school book kits and used school book resale";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f7f3eb 0%, #f3ece0 50%, #e9efe8 100%)",
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              height: 64,
              width: 64,
              borderRadius: 999,
              background: "#14161a",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#14161a" }}>AgliClass</div>
            <div style={{ fontSize: 18, color: "#5f6670" }}>Verified school book kits and used school book resale</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 72, lineHeight: 1.02, fontWeight: 800, color: "#14161a" }}>
            Buy school book kits. Sell used school books.
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#5f6670" }}>
            Hyperlocal school book resale and class-specific book kits for Indian parents.
          </div>
        </div>

        <div style={{ display: "flex", gap: 18, color: "#1f2a22", fontSize: 22 }}>
          <div style={{ padding: "12px 20px", borderRadius: 999, background: "rgba(20,22,26,0.06)" }}>School book kits</div>
          <div style={{ padding: "12px 20px", borderRadius: 999, background: "rgba(20,22,26,0.06)" }}>Used school books</div>
          <div style={{ padding: "12px 20px", borderRadius: 999, background: "rgba(20,22,26,0.06)" }}>Book resale</div>
        </div>
      </div>
    ),
    size,
  );
}
