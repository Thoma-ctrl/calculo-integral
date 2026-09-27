import { useMemo, useState } from "react";
import { FunctionPlot } from "@/components/FunctionPlot";
import {
  Formula,
  FunctionPicker,
  NumberSlider,
  ResultGrid,
  Section,
  StepExample,
} from "@/components/module-ui";
import { Tex } from "@/components/Tex";
import { exactIntegral, fmt, getSample, trapezoidRule } from "@/lib/calculus";

export function Modulo2() {
  const [fnId, setFnId] = useState("x2");
  const fn = getSample(fnId);
  const [a, setA] = useState(fn.defaultA);
  const [b, setB] = useState(fn.defaultB);
  const [n, setN] = useState(6);

  const { value, nodes } = useMemo(() => trapezoidRule(fn.f, a, b, n), [fn, a, b, n]);
  const exact = useMemo(() => exactIntegral(fn.f, a, b), [fn, a, b]);
  const table = useMemo(
    () => [4, 8, 16, 32].map((k) => ({ k, v: trapezoidRule(fn.f, a, b, k).value })),
    [fn, a, b],
  );

  return (
    <div className="space-y-6">
      <Section eyebrow="Teoría" title="Aproximación por trapecios">
        <p>
          En lugar de rectángulos usamos trapecios: unimos con un segmento de recta los puntos{" "}
          <Tex>{"(x_{i-1}, f(x_{i-1}))"}</Tex> y <Tex>{"(x_i, f(x_i))"}</Tex>. El área de cada
          trapecio es el promedio de las dos alturas por el ancho <Tex>{"\\Delta x"}</Tex>.
        </p>
        <Formula>{"A_i = \\frac{f(x_{i-1}) + f(x_i)}{2}\\,\\Delta x"}</Formula>
        <p>Al sumar todos los trapecios los valores interiores aparecen dos veces, y resulta:</p>
        <Formula>
          {
            "T_n = \\frac{\\Delta x}{2}\\left[f(x_0) + 2f(x_1) + 2f(x_2) + \\cdots + 2f(x_{n-1}) + f(x_n)\\right]"
          }
        </Formula>
        <p>
          El error de la regla del trapecio se acota mediante la segunda derivada, por lo que es
          exacta para funciones lineales y decrece como <Tex>{"1/n^2"}</Tex>:
        </p>
        <Formula>{"|E_T| \\le \\frac{(b-a)^3}{12n^2}\\max_{[a,b]}|f''(x)|"}</Formula>
      </Section>

      <Section eyebrow="Visualizador interactivo" title="Trapecios sobre la curva">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <FunctionPlot
            f={fn.f}
            xMin={Math.min(fn.domain[0], a - 0.3)}
            xMax={Math.max(fn.domain[1], b + 0.3)}
            caption={`Regla del trapecio con n = ${n} subintervalos.`}
            overlay={(s) => (
              <g>
                {nodes.slice(0, -1).map((p, i) => {
                  const q = nodes[i + 1]!;
                  const pts = [
                    `${s.X(p.x)},${s.Y(0)}`,
                    `${s.X(p.x)},${s.Y(p.y)}`,
                    `${s.X(q.x)},${s.Y(q.y)}`,
                    `${s.X(q.x)},${s.Y(0)}`,
                  ].join(" ");
                  return (
                    <polygon
                      key={i}
                      points={pts}
                      fill="var(--color-fill)"
                      fillOpacity={0.28}
                      stroke="var(--color-fill)"
                      strokeWidth={1.2}
                    />
                  );
                })}
                {nodes.map((p, i) => (
                  <circle key={`c${i}`} cx={s.X(p.x)} cy={s.Y(p.y)} r={2.5} fill="var(--color-curve)" />
                ))}
              </g>
            )}
          />
          <div className="space-y-5">
            <FunctionPicker
              value={fnId}
              onChange={(o) => {
                setFnId(o.id);
                setA(o.defaultA);
                setB(o.defaultB);
              }}
            />
            <NumberSlider label="Subintervalos n" value={n} min={1} max={80} step={1} onChange={setN} />
            <NumberSlider
              label="Límite inferior a"
              value={a}
              min={fn.domain[0]}
              max={b - 0.2}
              step={0.1}
              onChange={setA}
              display={a.toFixed(2)}
            />
            <NumberSlider
              label="Límite superior b"
              value={b}
              min={a + 0.2}
              max={fn.domain[1]}
              step={0.1}
              onChange={setB}
              display={b.toFixed(2)}
            />
          </div>
        </div>
        <ResultGrid
          items={[
            { label: "Δx", value: fmt((b - a) / n, 5) },
            { label: "Tₙ", value: fmt(value, 5) },
            { label: "Valor exacto", value: fmt(exact, 5) },
            { label: "Error", value: fmt(Math.abs(exact - value), 6) },
          ]}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-semibold">n</th>
                <th className="py-2 pr-4 font-semibold">Tₙ</th>
                <th className="py-2 font-semibold">Error</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {table.map((r) => (
                <tr key={r.k} className="border-b border-border/60">
                  <td className="py-1.5 pr-4">{r.k}</td>
                  <td className="py-1.5 pr-4">{fmt(r.v, 6)}</td>
                  <td className="py-1.5">{fmt(Math.abs(exact - r.v), 6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section eyebrow="Ejemplos resueltos" title="Paso a paso">
        <StepExample
          title="Ejemplo 1 — Trapecio para f(x) = x² en [0, 2] con n = 4"
          statement={"\\int_0^2 x^2\\,dx \\approx T_4"}
          steps={[
            { text: "Ancho de subintervalo.", tex: "\\Delta x = \\frac{2-0}{4}=0.5" },
            { text: "Nodos y alturas.", tex: "x: 0,\\,0.5,\\,1,\\,1.5,\\,2 \\quad f: 0,\\,0.25,\\,1,\\,2.25,\\,4" },
            { text: "Aplicamos la fórmula compuesta.", tex: "T_4 = \\frac{0.5}{2}\\left[0 + 2(0.25)+2(1)+2(2.25)+4\\right]" },
            { text: "Operamos el corchete.", tex: "T_4 = 0.25\\,[0 + 0.5 + 2 + 4.5 + 4] = 0.25(11)" },
            { text: "El valor exacto es 8/3 ≈ 2.6667, así que el error es ≈ 0.0833.", tex: "|E_T| = |2.6667 - 2.75| \\approx 0.0833" },
          ]}
          result={"T_4 = 2.75"}
        />
        <StepExample
          title="Ejemplo 2 — Trapecio para f(x) = sin(x) en [0, π] con n = 4"
          statement={"\\int_0^{\\pi} \\sin x\\,dx \\approx T_4"}
          steps={[
            { text: "Ancho de subintervalo.", tex: "\\Delta x = \\frac{\\pi}{4}\\approx 0.7854" },
            { text: "Alturas en los nodos.", tex: "\\sin 0 = 0,\\; \\sin\\tfrac{\\pi}{4}\\approx0.7071,\\; \\sin\\tfrac{\\pi}{2}=1,\\; \\sin\\tfrac{3\\pi}{4}\\approx0.7071,\\; \\sin\\pi=0" },
            { text: "Sustituimos en la fórmula.", tex: "T_4 = \\frac{0.7854}{2}\\left[0 + 2(0.7071)+2(1)+2(0.7071)+0\\right]" },
            { text: "Resolvemos.", tex: "T_4 \\approx 0.3927\\,(4.8284) \\approx 1.8961" },
            { text: "Comparamos con el valor exacto 2: el trapecio subestima el área por la concavidad hacia abajo.", tex: "|E_T| \\approx 0.1039" },
          ]}
          result={"T_4 \\approx 1.8961"}
        />
      </Section>
    </div>
  );
}
