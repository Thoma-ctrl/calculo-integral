import { useMemo, type ReactNode } from "react";

export type Scales = {
  X: (x: number) => number;
  Y: (y: number) => number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type Props = {
  f: (x: number) => number;
  g?: ((x: number) => number) | undefined;

  xMin: number;
  xMax: number;
  height?: number;
  padY?: number;
  overlay?: (s: Scales) => ReactNode;
  caption?: string;
};

const W = 720;

export function FunctionPlot({
  f,
  g,
  xMin,
  xMax,
  height = 340,
  padY = 0.18,
  overlay,
  caption,
}: Props) {
  const H = height;
  const m = { top: 18, right: 18, bottom: 30, left: 44 };

  const { scales, path, pathG, ticksX, ticksY } = useMemo(() => {
    const samples = 400;
    const pts: { x: number; y: number }[] = [];
    const ptsG: { x: number; y: number }[] = [];
    for (let i = 0; i <= samples; i++) {
      const x = xMin + ((xMax - xMin) * i) / samples;
      const y = f(x);
      if (Number.isFinite(y)) pts.push({ x, y });
      if (g) {
        const yg = g(x);
        if (Number.isFinite(yg)) ptsG.push({ x, y: yg });
      }
    }
    const ys = [...pts, ...ptsG].map((p) => p.y);
    let lo = Math.min(0, ...ys);
    let hi = Math.max(0, ...ys);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) {
      lo = lo - 1;
      hi = hi + 1;
    }
    const span = hi - lo;
    lo -= span * padY;
    hi += span * padY;

    const X = (x: number) => m.left + ((x - xMin) / (xMax - xMin)) * (W - m.left - m.right);
    const Y = (y: number) => H - m.bottom - ((y - lo) / (hi - lo)) * (H - m.top - m.bottom);

    const toPath = (arr: { x: number; y: number }[]) =>
      arr.map((p, i) => `${i === 0 ? "M" : "L"}${X(p.x).toFixed(2)},${Y(p.y).toFixed(2)}`).join(" ");

    const tickVals = (a: number, b: number, count: number) => {
      const out: number[] = [];
      for (let i = 0; i <= count; i++) out.push(a + ((b - a) * i) / count);
      return out;
    };

    return {
      scales: { X, Y, xMin, xMax, yMin: lo, yMax: hi } as Scales,
      path: toPath(pts),
      pathG: g ? toPath(ptsG) : null,
      ticksX: tickVals(xMin, xMax, 6),
      ticksY: tickVals(lo, hi, 5),
    };
  }, [f, g, xMin, xMax, H, padY, m.left, m.right, m.top, m.bottom]);

  const fmtTick = (v: number) => (Math.abs(v) < 1e-9 ? "0" : v.toFixed(Math.abs(v) < 10 ? 1 : 0));

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-lg border border-border bg-paper"
        role="img"
        aria-label={caption ?? "Gráfica de la función"}
      >
        {ticksY.map((v, i) => (
          <g key={`gy${i}`}>
            <line
              x1={m.left}
              x2={W - m.right}
              y1={scales.Y(v)}
              y2={scales.Y(v)}
              stroke="var(--color-grid)"
              strokeWidth={1}
            />
            <text
              x={m.left - 8}
              y={scales.Y(v) + 4}
              textAnchor="end"
              className="fill-muted-foreground font-mono"
              fontSize={10}
            >
              {fmtTick(v)}
            </text>
          </g>
        ))}
        {ticksX.map((v, i) => (
          <g key={`gx${i}`}>
            <line
              y1={m.top}
              y2={H - m.bottom}
              x1={scales.X(v)}
              x2={scales.X(v)}
              stroke="var(--color-grid)"
              strokeWidth={1}
            />
            <text
              x={scales.X(v)}
              y={H - m.bottom + 16}
              textAnchor="middle"
              className="fill-muted-foreground font-mono"
              fontSize={10}
            >
              {fmtTick(v)}
            </text>
          </g>
        ))}

        {/* axes */}
        <line
          x1={m.left}
          x2={W - m.right}
          y1={scales.Y(0)}
          y2={scales.Y(0)}
          stroke="var(--color-foreground)"
          strokeWidth={1.4}
        />
        <line
          x1={scales.X(Math.max(xMin, Math.min(0, xMax)))}
          x2={scales.X(Math.max(xMin, Math.min(0, xMax)))}
          y1={m.top}
          y2={H - m.bottom}
          stroke="var(--color-foreground)"
          strokeWidth={1}
          opacity={0.45}
        />

        {overlay?.(scales)}

        {pathG && (
          <path d={pathG} fill="none" stroke="var(--color-curve-2)" strokeWidth={2} strokeDasharray="6 4" />
        )}
        <path d={path} fill="none" stroke="var(--color-curve)" strokeWidth={2.4} />
      </svg>
      {caption && (
        <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
