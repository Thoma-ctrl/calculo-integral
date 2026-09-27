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
import { exactIntegral, fmt, getSample, riemannSum, trapezoidRule } from "@/lib/calculus";

export function Modulo3() {
  const [fnId, setFnId] = useState("cubic");
  const fn = getSample(fnId);
  const [a, setA] = useState(fn.defaultA);
  const [b, setB] = useState(fn.defaultB);
  const [n, setN] = useState(6);

  const mid = useMemo(() => riemannSum(fn.f, a, b, n, "midpoint"), [fn, a, b, n]);
  const trap = useMemo(() => trapezoidRule(fn.f, a, b, n), [fn, a, b, n]);
  const exact = useMemo(() => exactIntegral(fn.f, a, b), [fn, a, b]);

  return (
    <div className="space-y-6">
      <Section eyebrow="Teoría" title="Regla del punto medio">
        <p>
          Se usan rectángulos cuya altura se evalúa en el <strong>centro</strong> de cada
          subintervalo. Ese punto compensa parte del exceso y del defecto del rectángulo, de modo
          que la aproximación suele ser mejor que la del trapecio.
        </p>
        <Formula>
          {
            "M_n = \\Delta x\\sum_{i=1}^{n} f\\!\\left(\\bar{x}_i\\right), \\qquad \\bar{x}_i = \\frac{x_{i-1}+x_i}{2}, \\qquad \\Delta x = \\frac{b-a}{n}"
          }
        </Formula>
        <p>
          Su cota de error es la mitad de la del trapecio y tiene signo opuesto cuando{" "}
          <Tex>{"f''"}</Tex> no cambia de signo:
        </p>
        <Formula>{"|E_M| \\le \\frac{(b-a)^3}{24n^2}\\max_{[a,b]}|f''(x)|"}</Formula>
      </Section>

      <Section eyebrow="Visualizador interactivo" title="Rectángulos de punto medio">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <FunctionPlot
            f={fn.f}
            xMin={Math.min(fn.domain[0], a - 0.3)}
            xMax={Math.max(fn.domain[1], b + 0.3)}
            caption={`Rectángulos evaluados en el punto medio, n = ${n}.`}
            overlay={(s) => (
              <g>
                {mid.nodes.map((nd, i) => {
                  const y0 = s.Y(0);
                  const y1 = s.Y(nd.y);
                  return (
                    <g key={i}>
                      <rect
                        x={s.X(nd.x0)}
                        y={Math.min(y0, y1)}
                        width={Math.max(0.5, s.X(nd.x1) - s.X(nd.x0))}
                        height={Math.abs(y1 - y0)}
                        fill="var(--color-fill)"
                        fillOpacity={0.28}
                        stroke="var(--color-fill)"
                        strokeWidth={1}
                      />
                      <line
                        x1={s.X(nd.x)}
                        x2={s.X(nd.x)}
                        y1={y0}
                        y2={y1}
                        stroke="var(--color-highlight)"
                        strokeWidth={1.2}
                        strokeDasharray="3 3"
                      />
                      <circle cx={s.X(nd.x)} cy={y1} r={2.6} fill="var(--color-highlight)" />
                    </g>
                  );
                })}
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
            { label: "Mₙ (punto medio)", value: fmt(mid.value, 5) },
            { label: "Tₙ (trapecio)", value: fmt(trap.value, 5) },
            { label: "Valor exacto", value: fmt(exact, 5) },
            {
              label: "Error M vs error T",
              value: `${fmt(Math.abs(exact - mid.value), 4)} / ${fmt(Math.abs(exact - trap.value), 4)}`,
              hint: "el punto medio suele ser ~2× más preciso",
            },
          ]}
        />
      </Section>

      <Section eyebrow="Ejemplos resueltos" title="Paso a paso">
        <StepExample
          title="Ejemplo 1 — Punto medio para f(x) = x² en [0, 2] con n = 4"
          statement={"\\int_0^2 x^2\\,dx \\approx M_4"}
          steps={[
            { text: "Ancho de subintervalo.", tex: "\\Delta x = 0.5" },
            { text: "Puntos medios.", tex: "\\bar{x}_i = 0.25,\\; 0.75,\\; 1.25,\\; 1.75" },
            { text: "Alturas.", tex: "f(\\bar{x}_i) = 0.0625,\\; 0.5625,\\; 1.5625,\\; 3.0625" },
            { text: "Sumamos y multiplicamos por Δx.", tex: "M_4 = 0.5\\,(5.25) = 2.625" },
            { text: "El error es menor que el del trapecio (0.0833).", tex: "|E_M| = |2.6667-2.625| \\approx 0.0417" },
          ]}
          result={"M_4 = 2.625"}
        />
        <StepExample
          title="Ejemplo 2 — Punto medio para f(x) = x³ − 2x en [0, 2] con n = 4"
          statement={"\\int_0^2 (x^3-2x)\\,dx \\approx M_4"}
          steps={[
            { text: "Ancho de subintervalo.", tex: "\\Delta x = \\frac{2-0}{4} = 0.5" },
            { text: "Puntos medios y alturas.", tex: "f(0.25)=-0.4844,\\; f(0.75)=-1.0781,\\; f(1.25)=-0.5469,\\; f(1.75)=1.8594" },
            { text: "Sumamos las alturas.", tex: "\\sum f(\\bar{x}_i) = -0.25" },
            { text: "Multiplicamos por Δx.", tex: "M_4 = 0.5(-0.25) = -0.125" },
            { text: "Valor exacto por el TFC.", tex: "\\left[\\frac{x^4}{4}-x^2\\right]_0^2 = 4-4 = 0" },
          ]}
          result={"M_4 = -0.125 \\quad\\text{(área con signo; el error se reduce al crecer } n)"}
        />
      </Section>
    </div>
  );
}
