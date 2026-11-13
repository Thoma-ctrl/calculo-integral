export type ModuleMeta = {
  id: number;
  title: string;
  short: string;
  description: string;
  status: "activo" | "bloqueado";
  phase: "Fase 1" | "Fase 2" | "Fase 3" | "Avanzado";
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
    status: "activo",
    phase: "Fase 2",
  },
  {
    id: 8,
    title: "Integrales Exponenciales",
    short: "Funciones exponenciales",
    description: "Integrales de e^x y a^x con sus casos compuestos.",
    status: "activo",
    phase: "Fase 2",
  },
  {
    id: 9,
    title: "Integrales Logarítmicas",
    short: "Funciones logarítmicas",
    description: "Integrales que producen logaritmos naturales.",
    status: "activo",
    phase: "Fase 2",
  },
  {
    id: 10,
    title: "Integrales Trigonométricas (Básicas y Potencias)",
    short: "Seno, cosecante y compañía",
    description: "Identidades y potencias de funciones trigonométricas.",
    status: "activo",
    phase: "Fase 2",
  },
  {
    id: 11,
    title: "Trigonométricas Inversas",
    short: "arcsin, arctan, arcsec",
    description: "Formas que conducen a funciones trigonométricas inversas.",
    status: "activo",
    phase: "Fase 3",
  },
  {
    id: 12,
    title: "Hiperbólicas Inversas",
    short: "arcsinh, arccosh",
    description: "Integrales asociadas a funciones hiperbólicas inversas.",
    status: "activo",
    phase: "Fase 3",
  },
  {
    id: 13,
    title: "Trinomio ax² + bx + c",
    short: "Completar el cuadrado",
    description: "Integrales con trinomios cuadráticos en el denominador o el radical.",
    status: "activo",
    phase: "Fase 3",
  },
  {
    id: 14,
    title: "Integración por Partes",
    short: "Producto de funciones",
    description: "Fórmula de integración por partes y criterios de selección.",
    status: "activo",
    phase: "Fase 3",
  },
  {"id": 15, "title": "Integrales Racionales", "short": "Fracciones parciales", "description": "Factores lineales distintos, repetidos y cuadráticos irreducibles.", "status": "activo", "phase": "Avanzado"},
  {"id": 16, "title": "Integrales Irracionales", "short": "Cambios algebraicos", "description": "Eliminación de radicales con sustituciones de potencias.", "status": "activo", "phase": "Avanzado"},
  {"id": 17, "title": "Integrales Trigonométricas Avanzadas (Productos y Secantes)", "short": "Potencias y frecuencias", "description": "Productos de tangentes, secantes, cotangentes, cosecantes y ondas.", "status": "activo", "phase": "Avanzado"},
  {"id": 18, "title": "Sustituciones Trigonométricas", "short": "Triángulos y radicales", "description": "Cambios con seno, tangente y secante y triángulo de referencia.", "status": "activo", "phase": "Avanzado"},
  {"id": 19, "title": "Sustitución Universal", "short": "Cambio de Weierstrass", "description": "Transformación racional con t = tan(x/2).", "status": "activo", "phase": "Avanzado"},
  {"id": 20, "title": "Aplicaciones de la Integral", "short": "Longitud y valor promedio", "description": "Longitud de arco y valor promedio con límites variables.", "status": "activo", "phase": "Avanzado"},
  {"id": 21, "title": "Sólidos de Revolución", "short": "Discos, arandelas y cascarones", "description": "Región plana, cortes y volumen alrededor de los ejes X e Y.", "status": "activo", "phase": "Avanzado"},
];

export function getModule(id: number) {
  return MODULES.find((m) => m.id === id);
}
