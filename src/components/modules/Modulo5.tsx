import { useMemo, useState } from "react";
import { FunctionPlot } from "@/components/FunctionPlot";
import { Formula, NumberSlider, ResultGrid, Section, StepExample } from "@/components/module-ui";
import { Tex } from "@/components/Tex";
import { cn } from "@/lib/utils";
import { exactIntegral, fmt } from "@/lib/calculus";

type Mode = "area" | "between";

const f = (x: number) => 3 * x * x + 1;
const g1 = (x: number) => x * x;
const g2 = (x: number) => x;

export function Modulo5() {
  const [mode, setMode] = useState<Mode>("area");
  const [a, setA] = useState(1);
  const [b, setB] = useState(3);

  const value = useMemo(
    () =>
      mode === "area"
        ? exactIntegral(f, a, b)
        : exactIntegral((x) => g2(x) - g1(x), Math.max(a, 0), Math.min(b, 1)),
    [mode, a, b],
  );

  return (
    <div className="space-y-6">
      <Section eyebrow="Teoría" title="Integral definida y el Teorema Fundamental del Cálculo">
        <p>
          La integral definida es el límite de las sumas de Riemann y representa el{" "}
          <strong>área con signo</strong> entre la curva y el eje <Tex>x</Tex>.
        </p>
        <Formula>{"\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^n f(x_i^*)\\Delta x"}</Formula>
        <p>
          El <strong>Teorema Fundamental del Cálculo</strong> conecta derivación e integración. Si{" "}
          <Tex>F</Tex> es una antiderivada de <Tex>f</Tex> continua en <Tex>{"[a,b]"}</Tex>:
        </p>
        <Formula>{"\\int_a^b f(x)\\,dx = F(b) - F(a), \\qquad \\frac{d}{dx}\\int_a^x f(t)\\,dt = f(x)"}</Formula>
        <p>Propiedades usadas constantemente:</p>
        <Formula>
          {
            "\\int_a^a f = 0,\\quad \\int_a^b f = -\\int_b^a f,\\quad \\int_a^b (f\\pm g) = \\int_a^b f \\pm \\int_a^b g,\\quad \\int_a^b f = \\int_a^c f + \\int_c^b f"
          }
        </Formula>
        <p>
          Para el <strong>área entre curvas</strong>, con <Tex>{"f(x)\\ge g(x)"}</Tex> en{" "}
          <Tex>{"[a,b]"}</Tex>:
        </p>
        <Formula>{"A = \\int_a^b \\left[f(x) - g(x)\\right]dx"}</Formula>
      </Section>

      <Section eyebrow="Visualizador interactivo" title="Mueve los límites [a, b]">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "area" as Mode, label: "Área bajo f(x) = 3x² + 1" },
              { id: "between" as Mode, label: "Área entre x² y x" },
            ]
          ).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setMode(o.id);
                if (o.id === "between") {
                  setA(0);
                  setB(1);
                } else {
                  setA(1);
                  setB(3);
                }
              }}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                mode === o.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-paper hover:bg-accent/60",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <FunctionPlot
            f={mode === "area" ? f : g1}
            g={mode === "between" ? g2 : undefined}
            xMin={mode === "area" ? -0.5 : -0.3}
            xMax={mode === "area" ? 4 : 1.6}
            caption={
              mode === "area"
                ? `Región sombreada: área bajo f(x) = 3x² + 1 entre x = ${a.toFixed(2)} y x = ${b.toFixed(2)}.`
                : `Región entre g(x) = x (línea punteada) y f(x) = x² en [${a.toFixed(2)}, ${b.toFixed(2)}].`
            }
            overlay={(s) => {
              const steps = 120;
              const upper: string[] = [];
              const lower: string[] = [];
              for (let i = 0; i <= steps; i++) {
                const x = a + ((b - a) * i) / steps;
                const top = mode === "area" ? f(x) : Math.max(g1(x), g2(x));
                const bot = mode === "area" ? 0 : Math.min(g1(x), g2(x));
                upper.push(`${s.X(x)},${s.Y(top)}`);
                lower.unshift(`${s.X(x)},${s.Y(bot)}`);
              }
              return (
                <g>
                  <polygon
                    points={[...upper, ...lower].join(" ")}
                    fill="var(--color-fill)"
                    fillOpacity={0.32}
                    stroke="var(--color-fill)"
                    strokeWidth={1.2}
                  />
                  {[a, b].map((v, i) => (
                    <line
                      key={i}
                      x1={s.X(v)}
                      x2={s.X(v)}
                      y1={s.Y(s.yMin)}
                      y2={s.Y(s.yMax)}
                      stroke="var(--color-highlight)"
                      strokeWidth={1.4}
                      strokeDasharray="5 4"
                    />
                  ))}
                </g>
              );
            }}
          />
          <div className="space-y-5">
            <NumberSlider
              label="Límite inferior a"
              value={a}
              min={mode === "area" ? -0.5 : 0}
              max={b - 0.1}
              step={0.05}
              onChange={setA}
              display={a.toFixed(2)}
            />
            <NumberSlider
              label="Límite superior b"
              value={b}
              min={a + 0.1}
              max={mode === "area" ? 4 : 1.5}
              step={0.05}
              onChange={setB}
              display={b.toFixed(2)}
            />
            <p className="text-xs text-muted-foreground">
              {mode === "between"
                ? "Las curvas se cortan en x = 0 y x = 1; fuera de ese intervalo el orden de las funciones se invierte."
                : "Observa cómo el área crece según F(b) − F(a) con F(x) = x³ + x."}
            </p>
          </div>
        </div>

        <ResultGrid
          items={[
            { label: mode === "area" ? "∫ f(x) dx" : "Área entre curvas", value: fmt(value, 6) },
            { label: "a", value: a.toFixed(2) },
            { label: "b", value: b.toFixed(2) },
            {
              label: mode === "area" ? "F(b) − F(a)" : "Intervalo efectivo",
              value:
                mode === "area"
                  ? `${fmt(b ** 3 + b, 4)} − ${fmt(a ** 3 + a, 4)}`
                  : `[${Math.max(a, 0).toFixed(2)}, ${Math.min(b, 1).toFixed(2)}]`,
            },
          ]}
        />
      </Section>

      <Section eyebrow="Ejemplos resueltos" title="Paso a paso">
        <StepExample
          title="Ejemplo 1 — Área bajo f(x) = 3x² + 1 entre x = 1 y x = 3"
          statement={"A = \\int_1^3 (3x^2+1)\\,dx"}
          steps={[
            { text: "Buscamos una antiderivada término a término.", tex: "F(x) = \\int (3x^2+1)dx = x^3 + x" },
            { text: "Aplicamos el Teorema Fundamental del Cálculo.", tex: "A = F(3) - F(1)" },
            { text: "Evaluamos en el límite superior.", tex: "F(3) = 27 + 3 = 30" },
            { text: "Evaluamos en el límite inferior.", tex: "F(1) = 1 + 1 = 2" },
            { text: "Restamos.", tex: "A = 30 - 2 = 28" },
          ]}
          result={"A = 28 \\text{ unidades cuadradas}"}
        />
        <StepExample
          title="Ejemplo 2 — Área entre f(x) = x² y g(x) = x"
          statement={"A = \\int_a^b \\left[g(x) - f(x)\\right]dx"}
          steps={[
            { text: "Hallamos los puntos de intersección igualando las funciones.", tex: "x^2 = x \\Rightarrow x(x-1)=0 \\Rightarrow x=0,\\; x=1" },
            { text: "En (0, 1) la recta está por encima de la parábola, por ejemplo en x = 0.5: 0.5 > 0.25.", tex: "g(x) \\ge f(x) \\text{ en } [0,1]" },
            { text: "Planteamos la integral de la diferencia.", tex: "A = \\int_0^1 (x - x^2)\\,dx" },
            { text: "Integramos.", tex: "A = \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1" },
            { text: "Evaluamos.", tex: "A = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}" },
          ]}
          result={"A = \\frac{1}{6} \\approx 0.1667"}
        />
      </Section>
    </div>
  );
}
