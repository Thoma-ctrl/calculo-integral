# Cálculo Integral Interactivo

Plataforma educativa para estudiar Cálculo Integral mediante teoría breve, notación matemática profesional, ejemplos resueltos paso a paso y visualizadores que reaccionan a los parámetros elegidos por el estudiante.

El taller está organizado en **14 módulos progresivos**. La Fase 1 contiene seis módulos interactivos; las Fases 2 y 3 están preparadas para incorporar métodos de integración más avanzados sin alterar la estructura general de la aplicación.

## Contenido del taller

| Fase | Estado | Módulos |
| --- | --- | --- |
| Fase 1 | Implementada | 1. Sumas de Riemann; 2. Regla del Trapecio; 3. Regla del Punto Medio; 4. Regla de Simpson; 5. Integral Definida y Área bajo la Curva; 6. Integración Directa |
| Fase 2 | Planificada | 7. Integración por Sustitución; 8. Integrales Exponenciales; 9. Integrales Logarítmicas; 10. Integrales Trigonométricas |
| Fase 3 | Planificada | 11. Trigonométricas Inversas; 12. Hiperbólicas Inversas; 13. Trinomio `ax² + bx + c`; 14. Integración por Partes |

Los módulos de la Fase 1 ofrecen explicaciones conceptuales, fórmulas con KaTeX, controles interactivos, gráficas y ejercicios desarrollados. Las páginas de las fases posteriores mantienen disponibles sus rutas y muestran el estado de planificación.

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
├── index.html                   # Entrada HTML y navegación alternativa a los 14 módulos
├── public/                      # Recursos públicos, icono y configuración para buscadores
├── src/
│   ├── components/
│   │   ├── modules/             # Implementación independiente de cada módulo activo
│   │   ├── FunctionPlot.tsx     # Base gráfica reutilizable
│   │   ├── module-ui.tsx        # Secciones, fórmulas, controles y resultados comunes
│   │   └── Tex.tsx              # Adaptador de renderizado KaTeX
│   ├── data/modules.ts          # Catálogo, fases y estado de los 14 módulos
│   ├── lib/calculus.ts          # Funciones y cálculos compartidos
│   ├── routes/
│   │   ├── __root.tsx           # Documento, estilos globales y salida de rutas
│   │   ├── index.tsx            # Portada y catálogo completo
│   │   └── modulo.$id.tsx       # Ruta dinámica para /modulo/1 … /modulo/14
│   ├── router.tsx               # Configuración del enrutador
│   └── styles.css               # Tokens visuales y estilos globales
├── package.json                 # Dependencias y comandos
└── vite.config.ts               # Configuración de desarrollo y compilación
```

### Flujo modular

1. `src/data/modules.ts` define el nombre, resumen, fase y estado de cada unidad.
2. La ruta `src/routes/modulo.$id.tsx` obtiene el módulo solicitado a partir de su número.
3. Los módulos 1 a 6 cargan su componente correspondiente desde `src/components/modules/`.
4. Los módulos aún no implementados conservan una página informativa y navegación anterior/siguiente.
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

### Implementación de las Fases 2 y 3

Para desarrollar uno de los módulos pendientes:

1. Crea `src/components/modules/ModuloN.tsx`, sustituyendo `N` por el número del módulo.
2. Sigue la estructura pedagógica de los módulos activos: teoría, fórmula principal, visualizador, interpretación y al menos un ejemplo paso a paso.
3. Añade los cálculos reutilizables y las funciones de muestra a `src/lib/calculus.ts`, evitando duplicarlos dentro de la vista.
4. Importa el componente en `src/routes/modulo.$id.tsx` y asígnalo al número correspondiente.
5. Cambia el campo `status` del módulo en `src/data/modules.ts` de `bloqueado` a `activo`.
6. Verifica los casos límite del método. Por ejemplo, Simpson requiere un número par de subintervalos y las expresiones logarítmicas deben respetar su dominio.
7. Actualiza la tabla de estado de este documento cuando una fase o módulo quede disponible.

### Criterios mínimos para un módulo nuevo

- Notación correcta y legible mediante KaTeX.
- Cálculos numéricos coherentes con la explicación.
- Controles con límites seguros y etiquetas claras.
- Gráfica estable, adaptable y comprensible.
- Ejemplo resuelto con pasos verificables.
- Navegación funcional desde la portada y entre módulos consecutivos.
- Metadatos y textos en español consistentes con el resto del taller.

## Licencia

Este repositorio no declara todavía una licencia. Antes de redistribuir o reutilizar el código fuera del proyecto, añade una licencia explícita o solicita autorización a sus responsables.
