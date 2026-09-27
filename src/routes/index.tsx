import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, MoveRight, Sigma } from "lucide-react";
import { MODULES } from "@/data/modules";
import { Tex, TexBlock } from "@/components/Tex";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cálculo Integral Interactivo — 14 módulos de integración" },
      {
        name: "description",
        content:
          "Plataforma educativa interactiva de Cálculo Integral: sumas de Riemann, trapecio, punto medio, Simpson, integral definida e integración directa con gráficas dinámicas y fórmulas en KaTeX.",
      },
      { property: "og:title", content: "Cálculo Integral Interactivo" },
      {
        property: "og:description",
        content:
          "Visualiza paso a paso 14 módulos de integración con gráficas interactivas y ejemplos resueltos.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const active = MODULES.filter((m) => m.status === "activo");
  const locked = MODULES.filter((m) => m.status === "bloqueado");

  return (
    <div>
      <header className="grid-paper border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sigma className="size-3.5" /> Fase 1 activa · Módulos 1 a 6
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
            <span className="font-mono text-xs text-muted-foreground">6 / 14</span>
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

        <section className="mt-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold">Próximamente</h2>
            <span className="font-mono text-xs text-muted-foreground">Fase 2 / 3</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locked.map((m) => (
              <Link
                key={m.id}
                to="/modulo/$id"
                params={{ id: String(m.id) }}
                aria-disabled="true"
                className="flex flex-col rounded-xl border border-dashed border-border bg-secondary/50 p-4 opacity-80 transition-opacity hover:opacity-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Módulo {m.id}
                  </span>
                  <Lock className="size-3.5 text-muted-foreground" />
                </div>
                <h3 className="mt-2 text-sm font-semibold">{m.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{m.phase}</p>
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
