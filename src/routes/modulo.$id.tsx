import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getModule, MODULES } from "@/data/modules";
import { Modulo1 } from "@/components/modules/Modulo1";
import { Modulo2 } from "@/components/modules/Modulo2";
import { Modulo3 } from "@/components/modules/Modulo3";
import { Modulo4 } from "@/components/modules/Modulo4";
import { Modulo5 } from "@/components/modules/Modulo5";
import { Modulo6 } from "@/components/modules/Modulo6";
import { AdvancedModule } from "@/components/modules/AdvancedModule";

export const Route = createFileRoute("/modulo/$id")({
  head: ({ params }) => {
    const mod = getModule(Number(params.id));
    const title = mod
      ? `Módulo ${mod.id}: ${mod.title} — Cálculo Integral Interactivo`
      : "Módulo no encontrado — Cálculo Integral Interactivo";
    const description = mod
      ? `${mod.description} Incluye visualizador interactivo y ejemplos resueltos paso a paso.`
      : "El módulo solicitado no existe en esta plataforma de Cálculo Integral.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ModuloPage,
});

function ModuloPage() {
  const { id } = Route.useParams();
  const num = Number(id);
  const mod = getModule(num);

  if (!mod) {
    return (
      <Shell title="Módulo no encontrado" subtitle="Revisa el número del módulo (1 a 21)." id={0}>
        <div className="paper-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No existe un módulo con el identificador «{id}».
          </p>
          <Link to="/" className="mt-4 inline-flex text-sm font-semibold text-primary underline">
            Volver al inicio
          </Link>
        </div>
      </Shell>
    );
  }

  const content =
    num === 1 ? (
      <Modulo1 />
    ) : num === 2 ? (
      <Modulo2 />
    ) : num === 3 ? (
      <Modulo3 />
    ) : num === 4 ? (
      <Modulo4 />
    ) : num === 5 ? (
      <Modulo5 />
    ) : num === 6 ? (
      <Modulo6 />
    ) : (
      <AdvancedModule key={num} id={num} />
    );

  return (
    <Shell title={mod.title} subtitle={mod.short} id={mod.id}>
      {content}
    </Shell>
  );
}

function Shell({
  title,
  subtitle,
  id,
  children,
}: {
  title: string;
  subtitle: string;
  id: number;
  children: React.ReactNode;
}) {
  const prev = MODULES.find((m) => m.id === id - 1);
  const next = MODULES.find((m) => m.id === id + 1);

  return (
    <div>
      <header className="grid-paper border-b border-border">
        <div className="mx-auto max-w-5xl px-5 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> Todos los módulos
          </Link>
          {id > 0 && (
            <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Módulo {id}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>

      {id > 0 && (
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 pb-16">
          {prev ? (
            <Link
              to="/modulo/$id"
              params={{ id: String(prev.id) }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-paper px-4 py-2 text-sm hover:bg-accent/60"
            >
              <ChevronLeft className="size-4" /> {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/modulo/$id"
              params={{ id: String(next.id) }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-paper px-4 py-2 text-sm hover:bg-accent/60"
            >
              {next.title} <ChevronRight className="size-4" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
