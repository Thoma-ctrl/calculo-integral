import { createFileRoute, Link } from "@tanstack/react-router";
import { MoveRight, Sigma } from "lucide-react";
import { MODULES } from "@/data/modules";
import { Tex, TexBlock } from "@/components/Tex";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cálculo Integral Interactivo — 21 módulos de integración" },
      {
        name: "description",
        content:
          "Plataforma educativa interactiva de Cálculo Integral: sumas de Riemann, trapecio, punto medio, Simpson, integral definida e integración directa con gráficas dinámicas y fórmulas en KaTeX.",
      },
      { property: "og:title", content: "Cálculo Integral Interactivo" },
      {
        property: "og:description",
        content:
          "Visualiza paso a paso 21 módulos de integración con gráficas interactivas y ejemplos resueltos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const active = MODULES.filter((m) => m.status === "activo");

  return (
    <div>
      <header className="grid-paper border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sigma className="size-3.5" /> Taller completo · Módulos 1 a 21
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-semibold sm:text-6xl">
            Cálculo Integral, <span className="text-primary">paso a paso</span> y en movimiento.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Plataforma interactiva para estudiantes universitarios: teoría con notación matemática
            real, visualizadores que reaccionan a tus parámetros y ejemplos resueltos completos.
          </p>
          <div className="mt-8 max-w-md rounded-xl border border-border bg-paper px-5 py-3 shadow-paper">
            <TexBlock>
              {"\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty}\\sum_{i=1}^{n} f(x_i^*)\\,\\Delta x = F(b)-F(a)"}
            </TexBlock>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold">Módulos disponibles</h2>
            <span className="font-mono text-xs text-muted-foreground">21 / 21</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((m) => (
              <Link
                key={m.id}
                to="/modulo/$id"
                params={{ id: String(m.id) }}
                className="paper-card group flex flex-col p-5 transition-shadow hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                    Módulo {m.id}
                  </span>
                  <MoveRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mt-2 text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {m.short}
                </p>
                <p className="mt-3 text-sm text-foreground/80">{m.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 paper-card p-6">
          <h2 className="text-xl font-semibold">Datos de ejemplo usados en la plataforma</h2>
          <ul className="mt-3 grid gap-2 text-sm text-foreground/85 sm:grid-cols-2">
            <li>
              Aproximaciones numéricas con <Tex>{"f(x)=x^2"}</Tex>, <Tex>{"f(x)=\\sin x"}</Tex> en{" "}
              <Tex>{"[0,\\pi]"}</Tex> y <Tex>{"f(x)=x^3-2x"}</Tex> con{" "}
              <Tex>{"n = 4, 8, 16, 32"}</Tex>.
            </li>
            <li>
              Áreas con <Tex>{"f(x)=3x^2+1"}</Tex> en <Tex>{"[1,3]"}</Tex> y región entre{" "}
              <Tex>{"x^2"}</Tex> y <Tex>{"x"}</Tex>.
            </li>
            <li>
              Integrales inmediatas <Tex>{"\\int(3x^2+2x-5)dx"}</Tex>,{" "}
              <Tex>{"\\int\\cos x\\,dx"}</Tex> y <Tex>{"\\int\\frac{1}{x}dx"}</Tex>.
            </li>
            <li>Comparación de errores entre trapecio, punto medio y Simpson.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
