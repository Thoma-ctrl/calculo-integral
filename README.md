# Cálculo Integral Interactivo

Plataforma educativa para estudiar Cálculo Integral mediante teoría breve, notación matemática profesional, ejemplos resueltos paso a paso y visualizadores que reaccionan a los parámetros elegidos por el estudiante.

El taller está organizado en **21 módulos completos y activos**. Los módulos 1–6 mantienen su implementación original; los módulos 7–21 incorporan cuatro secciones: explicación teórica, fórmulas clave, visualizador interactivo y exactamente dos ejemplos resueltos paso a paso.

## Contenido del taller

| Fase | Estado | Módulos |
| --- | --- | --- |
| Fase 1 | Implementada | 1. Sumas de Riemann; 2. Regla del Trapecio; 3. Regla del Punto Medio; 4. Regla de Simpson; 5. Integral Definida y Área bajo la Curva; 6. Integración Directa |
| Fase 2 | Implementada | 7. Integración por Sustitución; 8. Integrales Exponenciales; 9. Integrales Logarítmicas; 10. Integrales Trigonométricas (Básicas y Potencias) |
| Fase 3 | Implementada | 11. Trigonométricas Inversas; 12. Hiperbólicas Inversas; 13. Trinomio `ax² + bx + c`; 14. Integración por Partes |
| Avanzado | Implementado | 15. Integrales Racionales; 16. Integrales Irracionales; 17. Integrales Trigonométricas Avanzadas (Productos y Secantes); 18. Sustituciones Trigonométricas; 19. Sustitución Universal; 20. Aplicaciones de la Integral; 21. Sólidos de Revolución |

Todos los módulos incluyen explicaciones conceptuales, fórmulas con KaTeX, controles interactivos, gráficas y ejercicios desarrollados. Las aplicaciones definidas muestran resultados sin constante; sus primitivas sí incluyen + C.

## Tecnologías principales

- **TanStack Start y TanStack Router:** renderizado de la aplicación y rutas tipadas.
- **React 19 y TypeScript:** interfaz y lógica de los módulos.
- **Tailwind CSS 4:** sistema visual y diseño adaptable.
- **KaTeX:** composición de fórmulas matemáticas.
- **SVG y Recharts:** gráficas y visualizaciones interactivas.
- **Vite:** entorno de desarrollo y compilación.

## Arquitectura del proyecto

La organización separa el catálogo académico, la presentación reutilizable y el contenido específico de cada módulo:

```text
.
├── index.html                   # Alternativa HTML original, conservada con sus 14 enlaces
├── public/                      # Recursos públicos, icono y configuración para buscadores
├── src/
│   ├── components/
│   │   ├── modules/             # Módulos 1–6 y presentación compartida de 7–21
│   │   │   ├── AdvancedModule.tsx     # Cuatro secciones pedagógicas
│   │   │   ├── AdvancedVisualizer.tsx # Controles y geometría específica
│   │   │   └── AdvancedPlot.tsx       # Gráficas con separación de singularidades
│   │   ├── FunctionPlot.tsx     # Base gráfica reutilizable
│   │   ├── module-ui.tsx        # Secciones, fórmulas, controles y resultados comunes
│   │   └── Tex.tsx              # Adaptador de renderizado KaTeX
│   ├── data/modules.ts          # Catálogo y fases de los 21 módulos activos
│   ├── data/advanced-lessons.ts # Teoría, fórmulas y 30 ejemplos de módulos 7–21
│   ├── lib/advanced-calculus.ts # Familias, antiderivadas y aplicaciones
│   ├── lib/advanced-calculus.test.ts # Pruebas matemáticas
│   ├── lib/calculus.ts          # Funciones y cálculos compartidos
│   ├── routes/
│   │   ├── __root.tsx           # Documento, estilos globales y salida de rutas
│   │   ├── index.tsx            # Portada y catálogo completo
│   │   └── modulo.$id.tsx       # Ruta dinámica para /modulo/1 … /modulo/21
│   ├── router.tsx               # Configuración del enrutador
│   └── styles.css               # Tokens visuales y estilos globales
├── package.json                 # Dependencias y comandos
└── vite.config.ts               # Configuración de desarrollo y compilación
```

### Flujo modular

1. `src/data/modules.ts` define el nombre, resumen, fase y estado de cada unidad.
2. La ruta `src/routes/modulo.$id.tsx` obtiene el módulo solicitado a partir de su número.
3. Los módulos 1 a 6 cargan su componente correspondiente desde `src/components/modules/`.
4. Los módulos 7–21 usan `AdvancedModule`, contenido en `advanced-lessons.ts` y modelos en `advanced-calculus.ts`. Todos disponen de navegación anterior/siguiente.
5. Los componentes compartidos garantizan consistencia entre fórmulas, controles, resultados y ejemplos.

`index.html` funciona como entrada y alternativa accesible con enlaces directos. La experiencia principal se renderiza con TanStack Start; las fórmulas de los componentes React usan el paquete local de KaTeX y la entrada HTML incluye además KaTeX por CDN.

## Instalación local

### Requisitos

- Node.js 20 o superior.
- npm 10 o superior, o Bun 1.2 o superior.
- Git.

### Pasos con npm

1. Clona el repositorio y entra en su carpeta:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <CARPETA_DEL_PROYECTO>
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el entorno de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre la dirección local indicada en la terminal (normalmente `http://localhost:3000`; el puerto puede variar).

### Alternativa con Bun

```bash
bun install
bun run dev
```

## Compilación y revisión

```bash
npm run build
npm run preview
npm run lint
```

- `build` genera la versión optimizada.
- `preview` permite revisarla localmente.
- `lint` comprueba la calidad y consistencia del código.

## Cómo contribuir

1. Crea una rama descriptiva desde la rama principal.
2. Mantén cada cambio enfocado en un módulo o mejora concreta.
3. Reutiliza `Section`, `Formula`, `NumberSlider`, `FunctionPicker`, `ResultGrid` y `StepExample` cuando corresponda.
4. Escribe las expresiones matemáticas en LaTeX y represéntalas con `Tex` o `TexBlock`; no insertes fórmulas como imágenes.
5. Comprueba la navegación, los controles, las gráficas y el diseño en pantallas pequeñas y grandes.
6. Ejecuta la compilación y el análisis de código antes de abrir la propuesta de cambio.
7. Explica qué concepto matemático se añadió, qué casos se verificaron y adjunta capturas si cambia la interfaz.

### Extensión de módulos y comprobaciones

1. Mantén intactos los componentes de los módulos 1–6 y el `index.html` alternativo.
2. Añade la teoría, las fórmulas y dos ejemplos algebraicos a `src/data/advanced-lessons.ts`.
3. Define familias de funciones y sus primitivas en `src/lib/advanced-calculus.ts`, con dominios seguros.
4. Añade los controles y la geometría específica en `AdvancedVisualizer.tsx`.
5. Registra la unidad activa en `src/data/modules.ts`; la ruta dinámica comparte la presentación.
6. Comprueba derivadas, transformaciones de áreas y resultados definidos con `bun test src/lib/advanced-calculus.test.ts`.

Los visualizadores de sustitución y Weierstrass comparan las variables originales y transformadas. Las curvas con polos separan sus ramas y marcan las asíntotas. El trinomio permite variar sus tres coeficientes (a positivo en la familia visualizada) y seleccionar denominador simple o radical. Por partes incluye el rectángulo de áreas complementarias; la sustitución trigonométrica añade un triángulo dinámico. Aplicaciones ofrece límites variables, arco resaltado y recta de promedio. Revolución muestra región plana, perfil de cortes y volumen para discos, arandelas y cascarones. Al seleccionar otro eje en revolución se intercambian las coordenadas de la familia de regiones; no se mantiene una región fija. No se simula una escena 3D.

### Criterios mínimos para un módulo nuevo

- Notación correcta y legible mediante KaTeX.
- Cálculos numéricos coherentes con la explicación.
- Controles con límites seguros y etiquetas claras.
- Gráfica estable, adaptable y comprensible.
- Dos ejemplos resueltos con desarrollo algebraico verificable.
- Navegación funcional desde la portada y entre módulos consecutivos.
- Metadatos y textos en español consistentes con el resto del taller.

## Licencia

Este repositorio no declara todavía una licencia. Antes de redistribuir o reutilizar el código fuera del proyecto, añade una licencia explícita o solicita autorización a sus responsables.
