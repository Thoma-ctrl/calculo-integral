import type { ReactNode } from "react";
import { Slider } from "@/components/ui/slider";
import { Tex, TexBlock } from "@/components/Tex";
import { SAMPLE_FUNCTIONS, type SampleFn } from "@/lib/calculus";
import { cn } from "@/lib/utils";

export function Section({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("paper-card p-5 sm:p-7", className)}>
      {eyebrow && (
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export function Formula({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-accent bg-accent/40 px-4 py-2">
      <TexBlock>{children}</TexBlock>
    </div>
  );
}

export function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-sm font-semibold text-primary">{value}</span>
      </div>
      {children}
    </div>
  );
}

export function NumberSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <ControlRow label={label} value={display ?? String(value)}>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0]!)}
        aria-label={label}
      />
    </ControlRow>
  );
}

export function FunctionPicker({
  value,
  onChange,
  options = SAMPLE_FUNCTIONS,
}: {
  value: string;
  onChange: (fn: SampleFn) => void;
  options?: SampleFn[];
}) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Función
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm transition-colors",
              value === o.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-paper text-foreground hover:bg-accent/60",
            )}
          >
            <Tex>{o.latex.replace("f(x) = ", "")}</Tex>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ResultGrid({ items }: { items: { label: string; value: string; hint?: string }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-lg border border-border bg-secondary/60 px-3 py-2">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {it.label}
          </dt>
          <dd className="font-mono text-base font-semibold text-foreground">{it.value}</dd>
          {it.hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{it.hint}</p>}
        </div>
      ))}
    </dl>
  );
}

export function StepExample({
  title,
  statement,
  steps,
  result,
}: {
  title: string;
  statement: string;
  steps: { text: string; tex?: string }[];
  result: string;
}) {
  return (
    <article className="rounded-xl border border-border bg-secondary/40 p-4 sm:p-5">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="mt-1">
        <TexBlock>{statement}</TexBlock>
      </div>
      <ol className="mt-3 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">{s.text}</p>
              {s.tex && <TexBlock className="text-sm">{s.tex}</TexBlock>}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-lg border border-highlight bg-highlight/20 px-4 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-highlight-foreground">
          Resultado
        </p>
        <TexBlock>{result}</TexBlock>
      </div>
    </article>
  );
}
