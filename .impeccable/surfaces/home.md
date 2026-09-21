---
version: 1
primary_target: src/app/(es)/page.tsx
related_targets: ["src/app/(en)/en/page.tsx", "src/components/layout/SiteHome.tsx", "src/components/sections/HeroSection.tsx", "src/components/sections/ProjectsSection.tsx", "src/components/sections/ContactSection.tsx", "src/app/globals.css"]
---

# Superficie: la página del portfolio

Superficie única, pública, sin sesión. Español en `/`, inglés en `/en`. Una sola página con
cinco secciones.

> **Aviso para quien escriba acá después, incluido `shape`:** la sección **7 · Restricciones**
> es un contrato, no una sugerencia. Impeccable **no lee el `CLAUDE.md` del proyecto**: carga
> su contexto de sus propios archivos, y su salvaguarda de "el brief gana" solo protege lo que
> está escrito en este archivo. Pisar esa sección no la deja obsoleta: **deja al proyecto sin
> protección**. Agregá secciones, no las reemplaces.

## 1 · Trabajo y audiencia

Dos audiencias llegan al mismo primer viewport, y ninguna tiene prioridad sobre la otra.

- **Reclutador sin perfil técnico**, escaneando en segundos. Necesita cuatro respuestas: quién
  es, qué hace, si está disponible, dónde está el CV. No abre repositorios. Si no las obtiene
  de inmediato, se va.
- **Desarrollador o líder técnico** evaluando competencia. Abre los repositorios, inspecciona
  cómo está construido este sitio, nota si el HTML es semántico. Para él, el sitio es parte de
  la evaluación técnica.

**Modo de la superficie: Experience.** Es un portfolio; el visitante viene a ver la obra. Pero
con una torsión que lo aparta del caso típico: **el sitio mismo es una de las piezas de la
obra**, porque ninguno de los proyectos cargados es de frontend.

## 2 · Resultado y evidencia

**Éxito:** un evaluador pasa de mirar el sitio a iniciar una conversación.

**Evidencia real disponible:** tres proyectos —una billetera multimoneda hecha desde backend en
equipo, un servidor MCP individual, un tablero kanban individual—, dos CV en PDF, repositorios
públicos, inglés B1 acreditado, y el código fuente de este sitio, enlazado desde el pie.

**Verdad específica del producto, y no se puede inventar otra:** lo que separa este portfolio
de cualquier otro de egresado de bootcamp son dos cosas **comprobables**, no declarativas — un
servidor MCP propio, y que el sitio resista que lo abran por dentro. Se descartó
explícitamente posicionarse sobre "una forma de trabajar": es cierto, pero cualquiera puede
afirmarlo y nadie puede verificarlo.

**Ausencias que no se rellenan con invención:** sin experiencia profesional previa, sin
testimonios, sin clientes, sin métricas de uso, sin casos de estudio, y sin una sola imagen en
todo el repositorio.

## 3 · Dirección seleccionada

**Autoridad visual: la dirección "Trazado" se conserva.** Es refinamiento, no reemplazo. El
sistema vigente está en `DESIGN.md` y sus porqués en `docs/sistema-de-diseno.md`.

**Tesis estructural:** el sitio se recorre como se recorre la ejecución de un programa. Una
traza vertical con nodos acompaña el scroll y hace de navegación; la misma figura reaparece
dibujando las capas del stack.

**El problema a resolver, nombrado con precisión por la revisión del 21/09/2026:**

> El concepto vive en el documento, no en la pieza.

Nada en la pantalla comunica "traza de ejecución". La línea con nodos se lee como una línea de
tiempo, que es el vocabulario de un CV cronológico. Quien no abrió el repositorio no tiene
manera de llegar a la idea. **La metáfora está subutilizada, no sobreutilizada.**

**Momento focal: la primera pantalla.** Una sola apuesta fuerte, y va ahí. Todo lo demás se
arregla en voz baja. Repartir el atrevimiento entre varios lugares produce sitios parejos y
olvidables.

**Consecuencia de implementación:** el hero sale de la columna de 48 rem y gana composición
propia; la columna baja de `main` a `PageSection`. El hero **no puede salir de `<main>`**,
porque el enlace de salto apunta ahí.

## 4 · Alcance y límites

**Dentro:** la primera pantalla, el orden de las secciones, la sección de contacto, el
tratamiento de las tarjetas de proyecto, y el contraste de estructura.

**Intocado:** la cabecera, el pie, el selector de tema, el 404, el sistema de temas, y la
arquitectura de contenido.

**Anti-objetivos explícitos.** Este sitio se define contra dos cosas:

- **El portfolio de egresado de bootcamp:** tarjetas flotando con sombra, gradientes de
  relleno, íconos de colores, barras de progreso que afirman "React 85%".
- **El portfolio de diseñador:** imágenes a sangre, tipografía decorativa gigante, efectos de
  scroll, mucho aire y nada verificable.

Y un tercero, específico de la apuesta: **un escalonado de textos que suben y aparecen.** Es la
animación de entrada por defecto, la que trae cualquier plantilla. Si el resultado se puede
describir como "fade-up escalonado", falló, por impecable que esté el CSS.

## 5 · Estados y rangos

**La lista de proyectos es abierta en las dos direcciones**: va de cero a N, los proyectos se
reemplazan por otros y además se suman. Nada puede depender de cuáles son ni de cuántos hay.

| Dato | Mínimo | Típico | Máximo |
|---|---|---|---|
| Proyectos | 0 | 3 | sin tope en el esquema |
| Tecnologías por proyecto | 1 | 5 | 12 |
| Logros por proyecto | 0 | 3 | 3 |
| Capturas disponibles | 0 | 0 | 1 |

**Estados materiales que ya existen y hay que preservar:** la lista vacía de proyectos —con su
nodo punteado en ámbar, que significa "acá todavía no hay nada"—, los tres estados del tema, y
el 404.

## 6 · Interacción y disposición

Intención, no CSS.

- **Jerarquía:** la evidencia va antes que el inventario de herramientas. Hoy está al revés.
- **Topología:** una sola página, cinco secciones, navegación por la traza a partir de
  1024 px y por scroll debajo de eso.
- **Respuesta al ancho:** mobile-first desde 320 px, con tres cortes —640, 1024 y 1280— cada
  uno con un motivo escrito en `DESIGN.md`. `md` (768 px) no se usa, y es deliberado.
- **Afordancias:** el verde significa "esto se puede recorrer o accionar", y nada más. El
  ámbar anota y nunca es accionable.
- **Retroalimentación:** todo estado se comunica con más de una señal, nunca solo con color.
- **Transiciones:** aditivas. La composición quieta tiene que sostenerse sola, porque quien
  vuelve al sitio ve el estado final.

## 7 · Restricciones

**Contrato. No reemplazar.**

- **Cero comentarios** en `src/` y en los archivos de configuración.
- **Nunca `any`.** Todo dato externo se valida con Zod y los tipos se derivan con `z.infer`.
  **Dos** aserciones de tipo en todo el proyecto, y no se agrega una tercera.
- **Exactamente dos componentes de cliente**, `TraceRail` y `ThemeToggle`. **Un tercero no se
  negocia:** si la mejor idea necesita JavaScript, se pide otra idea. La versión sin JS de una
  idea que lo necesitaba siempre sale peor que una idea pensada sin JS desde el principio.
- **Dos excepciones de lint**, y tampoco se agrega una tercera.
- **Sin librerías de animación.** Es una decisión documentada, no una omisión.
- **Movimiento: solo `@keyframes` y `transition`**, y solo sobre `opacity` y `transform`. Es lo
  único que el bloque de `prefers-reduced-motion` apaga de verdad. Quedan prohibidos
  `position: sticky` con `transform`, `filter`, `mix-blend-mode` y cualquier cosa ligada al
  scroll: **sobreviven intactos a la preferencia**, y `animation-timeline` además no es
  Baseline. El último fotograma de cada animación tiene que ser igual al estado de reposo.
- **Ningún recurso externo.** La CSP es `default-src 'self'` con `font-src 'self'`: una fuente,
  una imagen o un `@import` de afuera pasan en desarrollo y se bloquean en producción.
- **Siete tokens de color y cinco pasos tipográficos.** No se agrega un octavo ni un sexto.
  Ningún componente escribe un hexadecimal ni un tamaño arbitrario.
- **Contrastes medidos, nunca estimados**, sobre los colores computados en la página: 4.5:1 en
  texto, 3:1 en elementos no textuales y en pistas de forma.
- **Área táctil de 44 × 44** en todo elemento interactivo, medida sobre la caja renderizada.
- **Un solo `<h1>`**, y es el nombre.
- **La paleta oscura está duplicada a mano** en `src/lib/preview-image.tsx`, que dibuja con
  Satori: sin CSS, sin grid, sin variables, sin animación, y solo con fuentes `.woff` que estén
  en `assets/fonts/`. Si cambia un color del tema oscuro, hay que cambiarlo ahí **y tocar los
  dos archivos de ruta de previsualización**, o las cachés externas siguen sirviendo la vieja.
- **Verificación siempre contra `npm run build` + `npm start`**, nunca contra el servidor de
  desarrollo: sirve CSS y HTML de compilaciones anteriores y ya produjo falsos negativos
  repetidos en este proyecto.

## Decisiones que un constructor no debe inventar

- Qué dice la primera pantalla sobre la persona: sale de `PRODUCT.md`, no se redacta de nuevo.
- Si un proyecto se destaca: se marca desde el archivo de contenido, nunca desde un componente
  que nombre un `slug`.
- El criterio de aceptación del objetivo: está en `docs/spec.md`, con la línea de base medida.
