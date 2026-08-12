import React from "react";

export default function RevenueChart({ points }) {
  const max = Math.max(...points);
  const width = 520, height = 190, padX = 24, padY = 20;
  const usableW = width - padX * 2, usableH = height - padY * 2;
  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * usableW;
    const y = height - padY - (p / max) * usableH;
    return [x, y];
  });
  const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue chart">
        {[0, 1, 2, 3].map((i) => {
          const y = padY + i * ((usableH) / 3);
          return <line key={i} x1={padX} x2={width-padX} y1={y} y2={y} className="grid-line" />;
        })}
        <polyline points={polyline} className="chart-line" fill="none" />
        {coords.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" className="chart-dot" />)}
      </svg>
      <div className="chart-labels">
        {["1 Aug", "4 Aug", "7 Aug", "10 Aug", "13 Aug"].map(x => <span key={x}>{x}</span>)}
      </div>
    </div>
  );
}
