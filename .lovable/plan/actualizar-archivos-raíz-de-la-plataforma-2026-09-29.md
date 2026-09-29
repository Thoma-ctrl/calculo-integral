# Actualizar archivos raíz de la plataforma

## Objetivo
Incluir una entrada HTML clara para la plataforma y reemplazar el README genérico por documentación profesional en español.

## Cambios
1. Crear `index.html` en la raíz con:
   - Metadatos y título de la plataforma.
   - Carga de KaTeX desde CDN, incluida la extensión de renderizado automático.
   - Contenedor principal de entrada y una alternativa accesible con enlaces directos a los 14 módulos.
   - Configuración para reconocer fórmulas delimitadas con `\(...\)` y `\[...\]`.
2. Actualizar `README.md` con:
   - Descripción, alcance y estado de las Fases 1, 2 y 3.
   - Arquitectura modular real del proyecto y responsabilidades de sus carpetas principales.
   - Requisitos e instrucciones paso a paso para instalar, ejecutar, compilar y previsualizar localmente.
   - Guía de contribución para desarrollar los módulos de las Fases 2 y 3 siguiendo los patrones existentes.
3. Registrar la decisión arquitectónica de mantener `index.html` como entrada/fallback compatible, mientras TanStack Start conserva el renderizado principal.
4. Verificar que la aplicación compile y que la página principal y la navegación de módulos sigan funcionando.

## Detalles técnicos
- Se conservará TanStack Start y su enrutamiento actual; no se sustituirá por una aplicación HTML independiente.
- La integración CDN solicitada convivirá con el renderizado KaTeX ya incluido en React.
- Los enlaces usarán las rutas existentes `/modulo/1` a `/modulo/14`.
