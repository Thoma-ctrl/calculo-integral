import { useMemo, useState } from "react";
import { FunctionPlot } from "@/components/FunctionPlot";
import {
  FunctionPicker,
  Formula,
  NumberSlider,
  ResultGrid,
  Section,
  StepExample,
} from "@/components/module-ui";
import { Tex } from "@/components/Tex";
import { cn } from "@/lib/utils";
import {
  exactIntegral,
  fmt,
  getSample,
  riemannSum,
  type RiemannKind,
  SAMPLE_FUNCTIONS,
} from "@/lib/calculus";

const KINDS: { id: RiemannKind; label: string }[] = [
  { id: "left", label: "Izquierda" },
  { id: "right", label: "Derecha" },
  { id: "midpoint", label: "Punto medio" },
];

export function Modulo1() {
  const [fnId, setFnId] = useState("x2");
  const fn = getSample(fnId);
  const [a, setA] = useState(fn.defaultA);
  const [b, setB] = useState(fn.defaultB);
  const [n, setN] = useState(8);
  const [kind, setKind] = useState<RiemannKind>("left");

  const { value, nodes } = useMemo(() => riemannSum(fn.f, a, b, n, kind), [fn, a, b, n, kind]);
  const exact = useMemo(() => exactIntegral(fn.f, a, b), [fn, a, b]);
  const convergence = useMemo(
    () => [4, 8, 16, 32, 64].map((k) => ({ k, v: riemannSum(fn.f, a, b, k, kind).value })),
    [fn, a, b, kind],
  );

  return (
    <div className="space-y-6">
      <Section eyebrow="Teoría" title="¿Qué es una suma de Riemann?">
        <p>
          Para aproximar el área bajo <Tex>{fn.latex}</Tex> en el intervalo <Tex>{"[a,b]"}</Tex>{" "}
          dividimos el intervalo en <Tex>n</Tex> subintervalos de ancho igual{" "}
          <Tex>{"\\Delta x = \\frac{b-a}{n}"}</Tex> y sobre cada uno levantamos un rectángulo cuya
          altura es el valor de la función en un punto muestra <Tex>{"x_i^*"}</Tex>.
        </p>
        <Formula>{"S_n = \\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x"}</Formula>
        <p>Según el punto muestra elegido obtenemos tres variantes clásicas:</p>
        <Formula>
          {
            "\\text{Izquierda: } x_i^* = a+(i-1)\\Delta x \\qquad \\text{Derecha: } x_i^* = a+i\\Delta x \\qquad \\text{Punto medio: } x_i^* = a+\\left(i-\\tfrac12\\right)\\Delta x"
          }
        </Formula>
        <p>
          Cuando <Tex>{"n \\to \\infty"}</Tex> las tres sumas convergen al mismo valor: la integral
          definida.
        </p>
        <Formula>{"\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x"}</Formula>
      </Section>

      <Section eyebrow="Visualizador interactivo" title="Ajusta n y observa la convergencia">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <FunctionPlot
            f={fn.f}
            xMin={Math.min(fn.domain[0], a - 0.3)}
            xMax={Math.max(fn.domain[1], b + 0.3)}
            caption={`Suma de Riemann (${KINDS.find((k) => k.id === kind)!.label}) con n = ${n}.`}
            overlay={(s) => (
              <g>
                {nodes.map((nd, i) => {
                  const y0 = s.Y(0);
                  const y1 = s.Y(nd.y);
                  return (
                    <rect
                      key={i}
                      x={s.X(nd.x0)}
                      y={Math.min(y0, y1)}
                      width={Math.max(0.5, s.X(nd.x1) - s.X(nd.x0))}
                      height={Math.abs(y1 - y0)}
                      fill="var(--color-fill)"
                      fillOpacity={0.3}
                      stroke="var(--color-fill)"
                      strokeWidth={1}
                    />
                  );
                })}
              </g>
            )}
          />
          <div className="space-y-5">
            <FunctionPicker value={fnId} onChange={(o) => { setFnId(o.id); setA(o.defaultA); setB(o.defaultB); }} />
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tipo de suma
              </span>
              <div className="flex flex-wrap gap-2">
                {KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-sm transition-colors",
                      kind === k.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-paper hover:bg-accent/60",
                    )}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
            <NumberSlider label="Subintervalos n" value={n} min={1} max={120} step={1} onChange={setN} />
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
            { label: "Suma aproximada", value: fmt(value, 5) },
            { label: "Valor exacto", value: fmt(exact, 5) },
            { label: "Error absoluto", value: fmt(Math.abs(exact - value), 5) },
          ]}
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <caption className="mb-2 text-left text-xs text-muted-foreground">
              Convergencia de la suma al aumentar n
            </caption>
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-semibold">n</th>
                <th className="py-2 pr-4 font-semibold">Aproximación</th>
                <th className="py-2 font-semibold">Error</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {convergence.map((r) => (
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
          title="Ejemplo 1 — Suma izquierda de f(x) = x² en [0, 2] con n = 4"
          statement={"\\int_0^2 x^2\\,dx \\approx \\sum_{i=1}^{4} f(x_{i-1})\\,\\Delta x"}
          steps={[
            { text: "Calculamos el ancho de cada subintervalo.", tex: "\\Delta x = \\frac{2-0}{4} = 0.5" },
            { text: "Determinamos los puntos muestra (extremos izquierdos).", tex: "x_0=0,\\; x_1=0.5,\\; x_2=1,\\; x_3=1.5" },
            { text: "Evaluamos la función en cada punto.", tex: "f = 0,\\; 0.25,\\; 1,\\; 2.25" },
            { text: "Sumamos las alturas y multiplicamos por Δx.", tex: "S_4 = (0+0.25+1+2.25)(0.5) = 1.75" },
            { text: "Comparamos con el valor exacto de la integral.", tex: "\\int_0^2 x^2dx = \\frac{8}{3} \\approx 2.6667" },
          ]}
          result={"S_4 = 1.75 \\quad (\\text{error} \\approx 0.9167)"}
        />
        <StepExample
          title="Ejemplo 2 — Suma de punto medio de f(x) = sin(x) en [0, π] con n = 4"
          statement={"\\int_0^{\\pi} \\sin(x)\\,dx \\approx \\sum_{i=1}^{4} f\\!\\left(\\bar{x}_i\\right)\\Delta x"}
          steps={[
            { text: "Ancho de los subintervalos.", tex: "\\Delta x = \\frac{\\pi-0}{4} = \\frac{\\pi}{4} \\approx 0.7854" },
            { text: "Puntos medios de cada subintervalo.", tex: "\\bar{x}_i = \\frac{\\pi}{8},\\; \\frac{3\\pi}{8},\\; \\frac{5\\pi}{8},\\; \\frac{7\\pi}{8}" },
            { text: "Alturas correspondientes.", tex: "\\sin\\bar{x}_i \\approx 0.3827,\\; 0.9239,\\; 0.9239,\\; 0.3827" },
            { text: "Multiplicamos la suma de alturas por Δx.", tex: "S_4 \\approx (2.6131)(0.7854) \\approx 2.0524" },
            { text: "El valor exacto es 2; el punto medio ya da un error menor a 0.06.", tex: "\\left|2 - 2.0524\\right| \\approx 0.0524" },
          ]}
          result={"S_4 \\approx 2.0524 \\quad\\text{con}\\quad \\int_0^{\\pi}\\sin x\\,dx = 2"}
        />
      </Section>

      <p className="text-xs text-muted-foreground">
        Funciones disponibles en el visualizador: {SAMPLE_FUNCTIONS.map((s) => s.label).join(" · ")}
      </p>
    </div>
  );
}
