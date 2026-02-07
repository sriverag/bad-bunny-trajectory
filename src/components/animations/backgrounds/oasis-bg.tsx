"use client";

export function OasisBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Subtle grid pattern — minimalist street style */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 170, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Soft teal glow — top right */}
      <div
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 170, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Soft pink glow — bottom left */}
      <div
        className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255, 107, 157, 0.06) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
