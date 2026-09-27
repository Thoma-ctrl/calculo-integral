import katex from "katex";

function render(expr: string, displayMode: boolean) {
  try {
    return katex.renderToString(expr, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return expr;
  }
}

export function Tex({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={className}
      // KaTeX output is generated locally from literal strings in this app.
      dangerouslySetInnerHTML={{ __html: render(children, false) }}
    />
  );
}

export function TexBlock({ children, className }: { children: string; className?: string }) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: render(children, true) }}
    />
  );
}
