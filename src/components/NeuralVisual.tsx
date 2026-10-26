// Lightweight vector geometry provides dimensionality without a WebGL context.
export default function NeuralVisual() {
  const points = Array.from({ length: 32 }, (_, i) => {
    const a = i * 2.39996;
    const r = 32 + Math.sqrt(i / 32) * 118;
    return { x: 200 + Math.cos(a) * r, y: 200 + Math.sin(a) * r * 0.72 };
  });
  return (
    <svg viewBox="0 0 400 400" className="neural-visual" aria-hidden="true">
      <defs>
        <radialGradient id="neural-glow">
          <stop stopColor="#8b5cf6" stopOpacity=".2" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="190" fill="url(#neural-glow)" />
      <g fill="none" stroke="#a78bfa" strokeWidth=".7">
        <ellipse
          cx="200"
          cy="200"
          rx="165"
          ry="72"
          transform="rotate(-28 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="165"
          ry="72"
          transform="rotate(52 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="165"
          ry="72"
          transform="rotate(110 200 200)"
        />
        {points.map((p, i) => (
          <path
            key={i}
            opacity=".22"
            d={`M ${p.x} ${p.y} L ${points[(i + 7) % 32].x} ${points[(i + 7) % 32].y}`}
          />
        ))}
      </g>
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i % 4 === 0 ? 3 : 1.7}
          fill={i % 4 === 0 ? "#e5d8ff" : "#8b5cf6"}
        />
      ))}
    </svg>
  );
}
