/** Numeric integration helpers and the sample function catalogue. */

export type SampleFn = {
  id: string;
  label: string;
  latex: string;
  antiderivativeLatex?: string;
  f: (x: number) => number;
  F?: (x: number) => number;
  defaultA: number;
  defaultB: number;
  domain: [number, number];
};

export const SAMPLE_FUNCTIONS: SampleFn[] = [
  {
    id: "x2",
    label: "f(x) = x²",
    latex: "f(x) = x^2",
    antiderivativeLatex: "F(x) = \\dfrac{x^3}{3}",
    f: (x) => x * x,
    F: (x) => (x * x * x) / 3,
    defaultA: 0,
    defaultB: 2,
    domain: [-3, 3],
  },
  {
    id: "sin",
    label: "f(x) = sin(x)",
    latex: "f(x) = \\sin(x)",
    antiderivativeLatex: "F(x) = -\\cos(x)",
    f: (x) => Math.sin(x),
    F: (x) => -Math.cos(x),
    defaultA: 0,
    defaultB: Math.PI,
    domain: [-1, Math.PI + 1],
  },
  {
    id: "cubic",
    label: "f(x) = x³ − 2x",
    latex: "f(x) = x^3 - 2x",
    antiderivativeLatex: "F(x) = \\dfrac{x^4}{4} - x^2",
    f: (x) => x * x * x - 2 * x,
    F: (x) => (x * x * x * x) / 4 - x * x,
    defaultA: 0,
    defaultB: 2,
    domain: [-2.5, 2.5],
  },
  {
    id: "quad3",
    label: "f(x) = 3x² + 1",
    latex: "f(x) = 3x^2 + 1",
    antiderivativeLatex: "F(x) = x^3 + x",
    f: (x) => 3 * x * x + 1,
    F: (x) => x * x * x + x,
    defaultA: 1,
    defaultB: 3,
    domain: [-1, 4],
  },
  {
    id: "sqrt",
    label: "f(x) = √x",
    latex: "f(x) = \\sqrt{x}",
    antiderivativeLatex: "F(x) = \\tfrac{2}{3}x^{3/2}",
    f: (x) => Math.sqrt(Math.max(x, 0)),
    F: (x) => (2 / 3) * Math.pow(Math.max(x, 0), 1.5),
    defaultA: 0,
    defaultB: 4,
    domain: [0, 5],
  },
  {
    id: "invx",
    label: "f(x) = 1/x",
    latex: "f(x) = \\dfrac{1}{x}",
    antiderivativeLatex: "F(x) = \\ln|x|",
    f: (x) => 1 / x,
    F: (x) => Math.log(Math.abs(x)),
    defaultA: 1,
    defaultB: 3,
    domain: [0.25, 4],
  },
];

export function getSample(id: string): SampleFn {
  return SAMPLE_FUNCTIONS.find((s) => s.id === id) ?? SAMPLE_FUNCTIONS[0]!;
}

export type RiemannKind = "left" | "right" | "midpoint";

export function riemannSum(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  kind: RiemannKind,
) {
  const h = (b - a) / n;
  let sum = 0;
  const nodes: { x: number; y: number; x0: number; x1: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = a + i * h;
    const x1 = x0 + h;
    const x = kind === "left" ? x0 : kind === "right" ? x1 : (x0 + x1) / 2;
    const y = f(x);
    sum += y;
    nodes.push({ x, y, x0, x1 });
  }
  return { value: sum * h, h, nodes };
}

export function trapezoidRule(f: (x: number) => number, a: number, b: number, n: number) {
  const h = (b - a) / n;
  let sum = (f(a) + f(b)) / 2;
  const nodes: { x: number; y: number }[] = [{ x: a, y: f(a) }];
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    sum += f(x);
    nodes.push({ x, y: f(x) });
  }
  nodes.push({ x: b, y: f(b) });
  return { value: sum * h, h, nodes };
}

export function simpsonRule(f: (x: number) => number, a: number, b: number, n: number) {
  const m = n % 2 === 0 ? n : n + 1; // Simpson requires an even number of subintervals
  const h = (b - a) / m;
  let sum = f(a) + f(b);
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i <= m; i++) nodes.push({ x: a + i * h, y: f(a + i * h) });
  for (let i = 1; i < m; i++) sum += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return { value: (h / 3) * sum, h, n: m, nodes };
}

/** High-accuracy reference value (composite Simpson with many nodes). */
export function exactIntegral(f: (x: number) => number, a: number, b: number) {
  return simpsonRule(f, a, b, 2000).value;
}

export function fmt(value: number, digits = 6) {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(digits);
}

/** Parabola through 3 points, used by the Simpson visualiser. */
export function lagrangeParabola(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  return (x: number) =>
    (p0.y * ((x - p1.x) * (x - p2.x))) / ((p0.x - p1.x) * (p0.x - p2.x)) +
    (p1.y * ((x - p0.x) * (x - p2.x))) / ((p1.x - p0.x) * (p1.x - p2.x)) +
    (p2.y * ((x - p0.x) * (x - p1.x))) / ((p2.x - p0.x) * (p2.x - p1.x));
}
