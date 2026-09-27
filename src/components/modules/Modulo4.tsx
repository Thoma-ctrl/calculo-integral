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
import { exactIntegral, fmt, getSample, lagrangeParabola, simpsonRule, trapezoidRule } from "@/lib/calculus";

export function Modulo4() {
  const [fnId, setFnId] = useState("sin");
  const fn = getSample(fnId);
  const [a, setA] = useState(fn.defaultA);
  const [b, setB] = useState(fn.defaultB);
  const [nRaw, setNRaw] = useState(6);

  const isEven = nRaw % 2 === 0;
  const simpson = useMemo(() => simpsonRule(fn.f, a, b, nRaw), [fn, a, b, nRaw]);
  const trap = useMemo(() => trapezoidRule(fn.f, a, b, simpson.n), [fn, a, b, simpson.n]);
  const exact = useMemo(() => exactIntegral(fn.f, a, b), [fn, a, b]);

  return (
    <div className="space-y-6">
      <Section eyebrow="Teoría" title="Regla de Simpson 1/3">
        <p>
          Simpson aproxima la función por <strong>arcos de parábola</strong> que pasan por tres
          nodos consecutivos. Cada par de subintervalos aporta el área bajo una parábola, lo que da
          una precisión de orden <Tex>{"1/n^4"}</Tex>.
        </p>
        <Formula>
          {
            "S_n = \\frac{\\Delta x}{3}\\left[f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \\cdots + 4f(x_{n-1}) + f(x_n)\\right]"
          }
        </Formula>
        <p>
          <strong>Condición obligatoria:</strong> <Tex>n</Tex> debe ser <strong>par</strong>, porque
          los subintervalos se agrupan de dos en dos. Los coeficientes alternan{" "}
          <Tex>{"4, 2, 4, 2, \\ldots"}</Tex> y los extremos llevan coeficiente 1.
        </p>
        <Formula>{"|E_S| \\le \\frac{(b-a)^5}{180n^4}\\max_{[a,b]}\\left|f^{(4)}(x)\\right|"}</Formula>
        <p>Como consecuencia, Simpson es exacta para polinomios de grado ≤ 3.</p>
      </Section>

      <Section eyebrow="Visualizador interactivo" title="Parábolas ajustadas a la curva">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <FunctionPlot
            f={fn.f}
            xMin={Math.min(fn.domain[0], a - 0.3)}
            xMax={Math.max(fn.domain[1], b + 0.3)}
            caption={`Simpson con n = ${simpson.n} subintervalos (${simpson.n / 2} parábolas).`}
            overlay={(s) => (
              <g>
                {Array.from({ length: simpson.n / 2 }, (_, k) => {
                  const p0 = simpson.nodes[2 * k]!;
                  const p1 = simpson.nodes[2 * k + 1]!;
                  const p2 = simpson.nodes[2 * k + 2]!;
                  const par = lagrangeParabola(p0, p1, p2);
                  const steps = 24;
                  const top: string[] = [];
                  for (let i = 0; i <= steps; i++) {
                    const x = p0.x + ((p2.x - p0.x) * i) / steps;
                    top.push(`${s.X(x)},${s.Y(par(x))}`);
                  }
                  const poly = [`${s.X(p0.x)},${s.Y(0)}`, ...top, `${s.X(p2.x)},${s.Y(0)}`].join(" ");
                  return (
                    <g key={k}>
                      <polygon
                        points={poly}
                        fill="var(--color-fill)"
                        fillOpacity={k % 2 === 0 ? 0.3 : 0.18}
                        stroke="var(--color-highlight)"
                        strokeWidth={1.4}
                      />
                      {[p0, p1, p2].map((p, i) => (
                        <circle key={i} cx={s.X(p.x)} cy={s.Y(p.y)} r={2.6} fill="var(--color-curve)" />
                      ))}
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
            <NumberSlider
              label="Subintervalos n"
              value={nRaw}
              min={2}
              max={60}
              step={1}
              onChange={setNRaw}
              display={isEven ? String(nRaw) : `${nRaw} → ${nRaw + 1}`}
            />
            {!isEven && (
              <p className="rounded-md border border-highlight bg-highlight/20 px-3 py-2 text-xs text-highlight-foreground">
                La regla de Simpson exige n par. Se ajustó automáticamente a n = {simpson.n}.
              </p>
            )}
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
            { label: "Δx", value: fmt((b - a) / simpson.n, 5) },
            { label: "Sₙ (Simpson)", value: fmt(simpson.value, 6) },
            { label: "Tₙ (trapecio)", value: fmt(trap.value, 6) },
            {
              label: "Error Simpson",
              value: fmt(Math.abs(exact - simpson.value), 8),
              hint: `exacto ≈ ${fmt(exact, 6)}`,
            },
          ]}
        />
      </Section>

      <Section eyebrow="Ejemplos resueltos" title="Paso a paso">
        <StepExample
          title="Ejemplo 1 — Simpson para f(x) = x² en [0, 2] con n = 4"
          statement={"\\int_0^2 x^2\\,dx \\approx S_4"}
          steps={[
            { text: "Verificamos que n sea par: 4 es par, se puede aplicar.", tex: "n = 4 \\Rightarrow \\Delta x = 0.5" },
            { text: "Nodos y alturas.", tex: "f(0)=0,\\; f(0.5)=0.25,\\; f(1)=1,\\; f(1.5)=2.25,\\; f(2)=4" },
            { text: "Aplicamos los coeficientes 1, 4, 2, 4, 1.", tex: "S_4 = \\frac{0.5}{3}\\left[0 + 4(0.25) + 2(1) + 4(2.25) + 4\\right]" },
            { text: "Operamos el corchete.", tex: "S_4 = \\frac{0.5}{3}(16) = \\frac{8}{3}" },
            { text: "Simpson es exacta para polinomios de grado ≤ 3, así que el error es 0.", tex: "|E_S| = 0" },
          ]}
          result={"S_4 = \\frac{8}{3} \\approx 2.666667"}
        />
        <StepExample
          title="Ejemplo 2 — Simpson para f(x) = sin(x) en [0, π] con n = 4"
          statement={"\\int_0^{\\pi}\\sin x\\,dx \\approx S_4"}
          steps={[
            { text: "n = 4 es par.", tex: "\\Delta x = \\frac{\\pi}{4} \\approx 0.785398" },
            { text: "Alturas en los nodos.", tex: "0,\\; 0.707107,\\; 1,\\; 0.707107,\\; 0" },
            { text: "Sustituimos con coeficientes 1, 4, 2, 4, 1.", tex: "S_4 = \\frac{0.785398}{3}\\left[0+4(0.707107)+2(1)+4(0.707107)+0\\right]" },
            { text: "Calculamos.", tex: "S_4 \\approx 0.261799\\,(7.656854) \\approx 2.004560" },
            { text: "Comparado con el trapecio (1.8961) el error cae de 0.104 a 0.0046.", tex: "|E_S| \\approx 0.00456" },
          ]}
          result={"S_4 \\approx 2.004560 \\quad (\\text{exacto} = 2)"}
        />
      </Section>
    </div>
  );
}
