export type ModuleMeta = {
  id: number;
  title: string;
  short: string;
  description: string;
  status: "activo" | "bloqueado";
  phase: "Fase 1" | "Fase 2" | "Fase 3";
};

export const MODULES: ModuleMeta[] = [
  {
    id: 1,
    title: "Sumas de Riemann",
    short: "Aproximación por rectángulos",
    description:
      "Sumas izquierda, derecha y punto medio; convergencia al variar el número de subintervalos.",
    status: "activo",
    phase: "Fase 1",
  },
  {
    id: 2,
    title: "Regla del Trapecio",
    short: "Aproximación lineal por tramos",
    description: "Fórmula compuesta, justificación geométrica y error de aproximación.",
    status: "activo",
    phase: "Fase 1",
  },
  {
    id: 3,
    title: "Regla del Punto Medio",
    short: "Rectángulos centrados",
    description: "Rectángulos evaluados en el centro de cada subintervalo y su precisión.",
    status: "activo",
    phase: "Fase 1",
  },
  {
    id: 4,
    title: "Regla de Simpson",
    short: "Aproximación por parábolas",
    description: "Fórmula de Simpson 1/3, condición de n par y comparación de errores.",
    status: "activo",
    phase: "Fase 1",
  },
  {
    id: 5,
    title: "Integral Definida y Área bajo la Curva",
    short: "Teorema Fundamental del Cálculo",
    description: "Límites variables, áreas con signo y área entre dos curvas.",
    status: "activo",
    phase: "Fase 1",
  },
  {
    id: 6,
    title: "Integración Directa",
    short: "Antiderivadas inmediatas",
    description: "Reglas básicas de integración y relación gráfica entre f(x) y F(x).",
    status: "activo",
    phase: "Fase 1",
  },
  {
    id: 7,
    title: "Integración por Sustitución",
    short: "Cambio de variable",
    description: "Método de sustitución u y ajuste de diferenciales.",
    status: "bloqueado",
    phase: "Fase 2",
  },
  {
    id: 8,
    title: "Integrales Exponenciales",
    short: "Funciones exponenciales",
    description: "Integrales de e^x y a^x con sus casos compuestos.",
    status: "bloqueado",
    phase: "Fase 2",
  },
  {
    id: 9,
    title: "Integrales Logarítmicas",
    short: "Funciones logarítmicas",
    description: "Integrales que producen logaritmos naturales.",
    status: "bloqueado",
    phase: "Fase 2",
  },
  {
    id: 10,
    title: "Integrales Trigonométricas",
    short: "Seno, cosecante y compañía",
    description: "Identidades y potencias de funciones trigonométricas.",
    status: "bloqueado",
    phase: "Fase 2",
  },
  {
    id: 11,
    title: "Trigonométricas Inversas",
    short: "arcsin, arctan, arcsec",
    description: "Formas que conducen a funciones trigonométricas inversas.",
    status: "bloqueado",
    phase: "Fase 3",
  },
  {
    id: 12,
    title: "Hiperbólicas Inversas",
    short: "arcsinh, arccosh",
    description: "Integrales asociadas a funciones hiperbólicas inversas.",
    status: "bloqueado",
    phase: "Fase 3",
  },
  {
    id: 13,
    title: "Trinomio ax² + bx + c",
    short: "Completar el cuadrado",
    description: "Integrales con trinomios cuadráticos en el denominador o el radical.",
    status: "bloqueado",
    phase: "Fase 3",
  },
  {
    id: 14,
    title: "Integración por Partes",
    short: "Producto de funciones",
    description: "Fórmula de integración por partes y criterios de selección.",
    status: "bloqueado",
    phase: "Fase 3",
  },
];

export function getModule(id: number) {
  return MODULES.find((m) => m.id === id);
}
