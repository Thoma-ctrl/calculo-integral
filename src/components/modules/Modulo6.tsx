import { useMemo, useState } from "react";
import { FunctionPlot } from "@/components/FunctionPlot";
import { Formula, NumberSlider, Section, StepExample } from "@/components/module-ui";
import { Tex } from "@/components/Tex";
import { cn } from "@/lib/utils";

type Pair = {
  id: string;
  label: string;
  fLatex: string;
  FLatex: string;
  f: (x: number) => number;
  F: (x: number) => number;
  domain: [number, number];
};

const PAIRS: Pair[] = [
  {
    id: "poly",
    label: "3x² + 2x − 5",
    fLatex: "f(x) = 3x^2 + 2x - 5",
    FLatex: "F(x) = x^3 + x^2 - 5x + C",
    f: (x) => 3 * x * x + 2 * x - 5,
    F: (x) => x ** 3 + x * x - 5 * x,
    domain: [-3, 3],
  },
  {
    id: "cos",
    label: "cos(x)",
    fLatex: "f(x) = \\cos(x)",
    FLatex: "F(x) = \\sin(x) + C",
    f: (x) => Math.cos(x),
    F: (x) => Math.sin(x),
    domain: [-2 * Math.PI, 2 * Math.PI],
  },
  {
    id: "invx",
    label: "1/x",
    fLatex: "f(x) = \\dfrac{1}{x}",
    FLatex: "F(x) = \\ln|x| + C",
    f: (x) => 1 / x,
    F: (x) => Math.log(Math.abs(x)),
    domain: [0.15, 5],
  },
];

export function Modulo6() {
  const [pairId, setPairId] = useState("poly");
  const pair = PAIRS.find((p) => p.id === pairId)!;
  const [C, setC] = useState(0);

  const Fc = useMemo(() => (x: number) => pair.F(x) + C, [pair, C]);

  return (
    <div className="space-y-6">
      <Section eyebrow="Teoría" title="Integración directa (antiderivadas inmediatas)">
        <p>
          Integrar directamente significa reconocer la función como la derivada de otra. La familia
          de antiderivadas se escribe con una constante arbitraria <Tex>C</Tex>.
        </p>
        <Formula>{"\\int f(x)\\,dx = F(x) + C \\iff F'(x) = f(x)"}</Formula>
        <p>Reglas básicas que se usan sin transformar el integrando:</p>
        <Formula>
          {
            "\\int k\\,dx = kx + C \\qquad \\int x^n dx = \\frac{x^{n+1}}{n+1} + C\\;(n\\neq -1) \\qquad \\int \\frac{1}{x}dx = \\ln|x| + C"
          }
        </Formula>
        <Formula>
          {
            "\\int e^x dx = e^x + C \\qquad \\int \\cos x\\,dx = \\sin x + C \\qquad \\int \\sin x\\,dx = -\\cos x + C \\qquad \\int \\sec^2 x\\,dx = \\tan x + C"
          }
        </Formula>
        <p>Y las propiedades de linealidad, que permiten separar la integral término a término:</p>
        <Formula>{"\\int \\left[\\alpha f(x) \\pm \\beta g(x)\\right]dx = \\alpha\\int f(x)dx \\pm \\beta\\int g(x)dx"}</Formula>
      </Section>

      <Section eyebrow="Visualizador interactivo" title="f(x) y su antiderivada F(x)">
        <div className="flex flex-wrap gap-2">
          {PAIRS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPairId(p.id)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-sm transition-colors",
                pairId === p.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-paper hover:bg-accent/60",
              )}
            >
              <Tex>{p.fLatex.replace("f(x) = ", "")}</Tex>
            </button>
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <FunctionPlot
            f={pair.f}
            g={Fc}
            xMin={pair.domain[0]}
            xMax={pair.domain[1]}
            caption="Línea continua: f(x). Línea punteada: F(x) + C. Donde f(x) = 0, F alcanza un máximo o mínimo; donde f > 0, F crece."
          />
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-secondary/60 p-3">
              <Tex>{pair.fLatex}</Tex>
              <div className="mt-2">
                <Tex>{pair.FLatex}</Tex>
              </div>
            </div>
            <NumberSlider
              label="Constante C"
              value={C}
              min={-5}
              max={5}
              step={0.25}
              onChange={setC}
              display={C.toFixed(2)}
            />
            <p className="text-xs text-muted-foreground">
              Mueve C: toda la familia de antiderivadas se desplaza verticalmente sin cambiar su
              pendiente, porque la derivada de una constante es cero.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Ejemplos resueltos" title="Paso a paso">
        <StepExample
          title="Ejemplo 1 — Integral de un polinomio"
          statement={"\\int (3x^2 + 2x - 5)\\,dx"}
          steps={[
            { text: "Separamos por linealidad.", tex: "\\int 3x^2dx + \\int 2x\\,dx - \\int 5\\,dx" },
            { text: "Aplicamos la regla de la potencia al primer término.", tex: "3\\cdot\\frac{x^{3}}{3} = x^3" },
            { text: "Segundo término.", tex: "2\\cdot\\frac{x^{2}}{2} = x^2" },
            { text: "Tercer término (constante).", tex: "\\int 5\\,dx = 5x" },
            { text: "Reunimos y agregamos la constante de integración.", tex: "x^3 + x^2 - 5x + C" },
            { text: "Verificamos derivando el resultado.", tex: "\\frac{d}{dx}\\left(x^3+x^2-5x+C\\right) = 3x^2+2x-5" },
          ]}
          result={"\\int (3x^2+2x-5)\\,dx = x^3 + x^2 - 5x + C"}
        />
        <StepExample
          title="Ejemplo 2 — Integral trigonométrica inmediata"
          statement={"\\int \\cos(x)\\,dx"}
          steps={[
            { text: "Buscamos la función cuya derivada es cos(x).", tex: "\\frac{d}{dx}\\sin x = \\cos x" },
            { text: "Por lo tanto la antiderivada es sin(x).", tex: "\\int \\cos x\\,dx = \\sin x + C" },
            { text: "Comprobamos con una integral definida en [0, π/2].", tex: "\\int_0^{\\pi/2}\\cos x\\,dx = \\left[\\sin x\\right]_0^{\\pi/2} = 1 - 0" },
          ]}
          result={"\\int \\cos x\\,dx = \\sin x + C \\qquad \\int_0^{\\pi/2}\\cos x\\,dx = 1"}
        />
        <StepExample
          title="Ejemplo 3 — Caso especial de la regla de la potencia"
          statement={"\\int \\frac{1}{x}\\,dx"}
          steps={[
            { text: "La regla de la potencia falla para n = −1 porque el denominador n + 1 se anula.", tex: "\\frac{x^{-1+1}}{-1+1} \\to \\text{indefinido}" },
            { text: "Usamos la derivada del logaritmo natural.", tex: "\\frac{d}{dx}\\ln|x| = \\frac{1}{x}" },
            { text: "Escribimos el valor absoluto para cubrir x < 0.", tex: "\\int \\frac{1}{x}dx = \\ln|x| + C" },
            { text: "Ejemplo definido en [1, 3].", tex: "\\int_1^3 \\frac{dx}{x} = \\ln 3 - \\ln 1 = \\ln 3 \\approx 1.0986" },
          ]}
          result={"\\int \\frac{1}{x}dx = \\ln|x| + C"}
        />
      </Section>
    </div>
  );
}
