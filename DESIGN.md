---
name: Portfolio de Hernán Ramiro Albornoz
description: Un sitio que se recorre como se recorre la ejecución de un programa.
colors:
  ink: "#f6f2ec"
  surface: "#ffffff"
  line: "#ddd5ca"
  muted: "#6b6157"
  fore: "#14120f"
  trace: "#007c00"
  pending: "#836709"
  ink-dark: "#14120f"
  surface-dark: "#24201c"
  line-dark: "#3a3630"
  muted-dark: "#a39c92"
  fore-dark: "#f2efea"
  trace-dark: "#9fc27c"
  pending-dark: "#d4a541"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3rem, 12vw, 6.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.7
  eyebrow:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  default: "0.25rem"
  lg: "0.5rem"
  full: "3.40282e38px"
spacing:
  gutter: "1.5rem"
  card: "1.5rem"
  stack: "2rem"
  section: "5rem"
  page-y: "6rem"
  header: "4rem"
components:
  link-inline:
    textColor: "{colors.trace}"
    typography: "{typography.body}"
    height: "2.75rem"
  link-label:
    textColor: "{colors.trace}"
    typography: "{typography.eyebrow}"
    height: "2.75rem"
  card-project:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  theme-option:
    textColor: "{colors.muted}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.default}"
    height: "2.75rem"
    width: "2.75rem"
  theme-option-checked:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.trace}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.default}"
    height: "2.75rem"
  language-link:
    textColor: "{colors.trace}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.default}"
    height: "2.75rem"
    width: "2.75rem"
  trace-node:
    rounded: "{rounded.full}"
    size: "11px"
  trace-node-current:
    backgroundColor: "{colors.trace}"
    rounded: "{rounded.full}"
    size: "11px"
---

# Design System: Portfolio de Hernán Ramiro Albornoz

> Los ocho encabezados de sección están en inglés y en orden fijo porque el formato
> `DESIGN.md` se parsea por nombre exacto. La prosa va en español, como el resto de la
> documentación del repositorio.

## Overview

**Creative North Star: "El trazo de ejecución"**

El sitio se recorre como se recorre la ejecución de un programa. Una traza vertical fina,
marcada con nodos, acompaña el scroll y hace de navegación: cada nodo es un paso, el nodo
relleno es dónde estás, y la parte de la línea que ya se pintó es lo que quedó atrás. La
misma figura reaparece dentro de la página, dibujando las capas del stack. No es un adorno
que se repite: es el mismo concepto aplicado dos veces.

De ahí sale todo lo demás. La paleta es tinta cálida —un solo plano, sin sombras— porque la
traza necesita una superficie limpia sobre la cual leerse. La monoespaciada aparece solo en
las etiquetas, en mayúsculas y con mucho interletrado, como la anotación al margen de un
diagrama. El verde marca la traza y el estado, nunca decora. Y el texto es lo único que
pesa: todo lo que lo rodea es andamiaje de un píxel.

El sistema se define contra dos cosas concretas. Contra **el portfolio de egresado de
bootcamp**: tarjetas flotando con sombra, gradientes de relleno, íconos de colores, barras de
progreso que afirman "React 85%". Y contra **el portfolio de diseñador**: imágenes a sangre,
tipografía decorativa gigante, efectos de scroll, mucho aire y nada verificable. El primero
se ve amateur; el segundo promete algo que el trabajo no respalda.

**Key Characteristics:**

- Una traza con nodos que es navegación, no ilustración.
- Un solo plano: sin una sola sombra en todo el proyecto.
- Contenido y andamiaje: el texto pesa, la estructura es de un píxel.
- Dos temas completos, ninguno derivado mecánicamente del otro.
- Cinco pasos de tipografía y siete tokens de color. No hay un sexto ni un octavo.

## Colors

Siete roles, cada uno declarado dos veces —una por tema— y ninguno derivado invirtiendo al
otro. Los nombres sin sufijo son los del tema claro, que es el que vive en `:root`; los
`-dark` son la redefinición del tema oscuro.

### Primary

- **Verde de traza** (`#007c00` claro / `#9fc27c` oscuro): la línea, los nodos, el nodo de la
  sección actual, y todo enlace del sitio. Es el único color con carga semántica: donde
  aparece, algo se puede recorrer o accionar. El verde claro está deliberadamente más saturado
  que el oscuro, porque sobre fondo claro necesita más peso para alcanzar el mismo contraste.

### Secondary

- **Ámbar de anotación** (`#836709` claro / `#d4a541` oscuro): los datos al margen —rol y año
  de un proyecto, institución y período de una formación— y el estado vacío. Anota el
  contenido sin ser contenido. Nunca es accionable: si algo es ámbar, no se puede hacer clic.

### Neutral

- **Tinta de página** (`ink`, `#f6f2ec` claro / `#14120f` oscuro): el fondo sobre el que se
  dibuja la traza. El nombre viene del tema oscuro, donde la página *es* tinta; en claro es el
  papel.
- **Superficie elevada** (`surface`, `#ffffff` claro / `#24201c` oscuro): el único escalón de
  profundidad que existe. Tarjetas de proyecto, opción de tema activa, enlace de salto.
- **Filete** (`line`, `#ddd5ca` claro / `#3a3630` oscuro): bordes y divisores de un píxel.
  Nunca rellena.
- **Texto principal** (`fore`, `#14120f` claro / `#f2efea` oscuro): títulos de sección y de
  proyecto, y la frase de apertura de la primera pantalla.
- **Texto secundario** (`muted`, `#6b6157` claro / `#a39c92` oscuro): párrafos, listas,
  tecnologías, el rol de la primera pantalla, y el estado de reposo de los controles.

**La primera pantalla invierte la jerarquía a propósito.** En el resto del sitio los títulos
van en `fore` y el texto corrido en `muted`. Ahí no: el rol —que es un título por tamaño—
va en `muted`, y la frase de apertura —que es texto corrido— va en `fore`. El peso lo lleva lo
que se quiere que se lea, no lo que es más grande.

### Named Rules

**La regla del relleno único.** El verde rellena **una sola cosa** en toda la página: el nodo
de la sección actual. En cualquier otro lugar es línea, borde o texto. Un botón verde relleno
rompe el sistema, porque le saca al acento lo único que lo hace significar algo: que es raro.

**La regla del ámbar inerte.** El ámbar nunca es accionable. Si un elemento ámbar se vuelve
un enlace, cambia de color; no se le agrega un subrayado.

**La regla de la medición.** Todo par de colores nuevo se mide antes de usarse: 4.5:1 en texto
y 3:1 en elementos no textuales y estados. Una pista de forma —un borde, un ícono— también se
mide. Estimarlo ya produjo, una vez, una corrección tan débil como el defecto que arreglaba.

## Typography

**Display Font:** Archivo (con `ui-sans-serif`, `system-ui`, `sans-serif`)
**Body Font:** Instrument Sans (con `ui-sans-serif`, `system-ui`, `sans-serif`)
**Label/Mono Font:** JetBrains Mono (con `ui-monospace`, `monospace`)

**Character:** una grotesca de peso alto y contraformas cerradas para los títulos, una sans
neutra y ancha para la lectura, y una monoespaciada reservada a las etiquetas. La
monoespaciada no está para decir "esto es de programación": está para que las etiquetas se
lean como anotaciones de un diagrama, en un registro distinto del contenido.

### Hierarchy

- **Display** (700, `clamp(3rem, 12vw, 6.5rem)`, lh 0.92, ls -0.035em): el nombre en la
  primera pantalla. Aparece **una sola vez por página**.
- **Title** (600, `clamp(1.75rem, 4vw, 2.75rem)`, lh 1.15): los títulos de las cinco
  secciones, y el rol en la primera pantalla.
- **Subtitle** (600, `clamp(1.375rem, 2.5vw, 1.75rem)`, lh 1.2): nombre de proyecto y título
  de formación.
- **Body** (`1.0625rem`, lh 1.7): párrafos y listas, limitados a `max-w-prose` donde el texto
  es corrido.
- **Eyebrow** (500, `0.75rem`, lh 1, ls 0.18em, mayúsculas): etiquetas, metadatos, enlaces
  cortos y las etiquetas del riel. Siempre en monoespaciada y siempre en mayúsculas.

### Named Rules

**La regla de los cinco pasos.** Ningún componente escribe un tamaño de letra arbitrario. Hay
cinco nombres en la escala y se usa uno de los cinco. Un `text-[17px]` es un error, no un
ajuste.

**La regla del techo del display.** El máximo de `display` es `6.5rem` por decisión tomada y
documentada, no por accidente. Subirlo es revertir esa decisión, no afinarla.

## Layout

Una sola columna centrada de `48rem` (`max-w-3xl`) con `1.5rem` de margen lateral, sobre la
que se apilan las secciones separadas por `5rem`. La cabecera es pegajosa, mide `4rem`
(`--header-height`) y comparte exactamente el mismo contenedor que el contenido: por eso los
controles de la cabecera caen alineados con los del cuerpo.

`scroll-padding-top` toma el alto de la cabecera y cada sección aporta `scroll-mt-8`. Los dos
sumados definen la **línea de llegada**: la altura a la que queda el borde superior de una
sección cuando se llega por un enlace del riel. El riel la mide en tiempo de ejecución en vez
de asumirla.

**Comportamiento responsivo.** Mobile-first: la base es 320px y los puntos de corte suman,
nunca restan. El proyecto usa **tres**, y cada uno tiene un motivo: `sm` (640px) despliega el
apellido en la cabecera y saca a la luz las etiquetas del selector de tema, que en la base son
solo íconos; `lg` (1024px) hace aparecer el riel lateral, que por debajo de ese ancho no
existe; `xl` (1280px) deja visibles de forma permanente las etiquetas del riel, que a anchos
menores solo aparecen al enfocar o pasar por encima.

**`md` (768px) no se usa en ningún lado.** Es una ausencia real, no un olvido a corregir: los
tres cortes que existen están donde el contenido los pidió. Agregar uno nuevo exige el mismo
tipo de justificación.

La última sección reserva `50vh` de alto mínimo a partir de `64rem`. No es estética: sin esa
reserva, las dos últimas secciones terminan en el mismo desplazamiento y el riel no puede
distinguirlas.

## Elevation & Depth

**Este sistema no tiene sombras.** Ni una, en todo el proyecto. La profundidad se construye
con dos recursos: un único escalón tonal —`surface` sobre `ink`— y filetes de un píxel en
`line`. No hay segundo escalón, ni desenfoques, ni superposiciones translúcidas fuera del
respaldo de la cabecera.

Esa decisión es lo que permite que la traza se lea: una línea de un píxel con nodos de once
necesita una superficie sin ruido. Cualquier sombra compite con ella.

### Named Rules

**La regla del plano único.** Si algo necesita destacarse, cambia de superficie o gana un
filete. Nunca se levanta. `box-shadow` no pertenece a este sistema.

## Shapes

El vocabulario de formas tiene cuatro entradas y ninguna más.

**El nodo**, un círculo de 11px que es la unidad de la traza, en tres variantes: relleno
verde en la sección de stack, con filete en el riel —que se rellena al llegar—, y **punteado
en ámbar** para el estado vacío de proyectos, donde marca algo que todavía no existe.

**El marcador de tecnología**, un círculo de 16px con filete `muted`, que aparece cuando una
tecnología no tiene ícono propio. Es el segundo y último círculo del sistema.

**El radio corto** de `0.25rem`, para todo lo compacto: las opciones de tema, el selector de
idioma, el enlace de salto, el área de foco de cada enlace del riel, y el marco de la captura
de un proyecto.

**El radio largo** de `0.5rem`, usado en un solo lugar del sitio: las tarjetas de proyecto.

Los filetes son siempre de un píxel, y el único punteado del sistema es el del nodo vacío. Las
líneas de la traza son siempre de un píxel. Los tramos horizontales que conectan un nodo con
su contenido en la sección de stack miden `1rem`.

El radio "completamente redondo" del frontmatter figura como `3.40282e38px`, que no es un
error de tipeo: es el valor que Tailwind v4 emite de verdad para `rounded-full`, leído del CSS
construido. Cualquier valor grande se ve igual; el que está escrito es el que el sistema usa.

### Named Rules

**La regla de los dos círculos.** El sistema tiene exactamente dos elementos redondos: el nodo
de la traza (11px) y el marcador de tecnología sin ícono (16px). Un tercer círculo —un avatar,
una viñeta, un indicador— tiene que justificarse como decisión de sistema.

**La regla del punteado.** El filete punteado significa una sola cosa: *acá todavía no hay
nada*. No se usa para separar, para decorar ni para marcar un estado deshabilitado.

## Components

El carácter de todo el conjunto se resume en una frase: **contenido y andamiaje**. El texto es
lo único que pesa; el resto es estructura de un píxel que lo sostiene sin competirle.

### Buttons

**No existen.** El sistema no tiene un solo botón relleno, y es doctrina, no casualidad. Toda
acción es texto subrayado en verde de traza, o un control acotado por un filete. El día que
aparezca una acción principal que pida un botón, la decisión es de sistema y se discute; no se
resuelve rellenando un rectángulo.

### Links

- **Enlace de contenido:** verde de traza, subrayado con `underline-offset-4`, en cuerpo.
- **Enlace-etiqueta:** el mismo tratamiento en monoespaciada, mayúsculas y eyebrow. Es el
  formato de los repositorios, las redes, los CV y el pie.
- **Área táctil:** `min-h-11` (2.75rem) en todos, incluso cuando el texto es más chico.
- **Foco:** contorno de 2px en verde de traza. **El ancho y el color no se sobrescriben
  nunca**; la separación sí se adapta al elemento: 3px por defecto en la base, 2px en los
  controles que ya tienen filete propio —selector de idioma, opciones de tema, enlace de
  salto— y 4px en los enlaces del riel, donde el objetivo es un nodo de 11px y necesita más
  aire para leerse.

### Cards / Containers

- **Corner Style:** radio largo (`0.5rem`). Es el único lugar donde se usa.
- **Background:** superficie elevada sobre tinta de página.
- **Shadow Strategy:** ninguna. Ver *Elevation & Depth*.
- **Border:** filete de un píxel en `line`.
- **Internal Padding:** `1.5rem`, que sube a `2rem` desde 640px.

### Navigation

El riel lateral es la navegación principal a partir de 1024px: una línea de fondo en `line`,
una línea de progreso en verde que se escala verticalmente según el scroll, y un nodo por
sección. El nodo de la sección actual es **el único relleno verde de la página**. Las
etiquetas están ocultas por opacidad y aparecen al enfocar, al pasar por encima, o de forma
permanente desde 1280px.

Por debajo de 1024px el riel no existe y la navegación es el scroll.

### Theme Toggle

Tres opciones excluyentes —claro, oscuro, sistema— construidas como un `fieldset` con radios
visualmente ocultos y etiquetas estilizadas. La opción activa gana filete verde, superficie
elevada y texto verde: **tres señales a la vez**, no solo color, porque distinguirla solo por
color falla para quien no lo percibe. En la base cada opción es un cuadrado de 2.75rem con un
ícono de 16px y la etiqueta accesible oculta; desde 640px la etiqueta sale a la luz, el ícono
se retira y el control crece a lo ancho.

### Stack Trace (signature)

La sección de stack dibuja la misma figura que el riel, pero en el flujo del documento: una
línea vertical verde, un nodo por capa, y un tramo horizontal de `1rem` que conecta cada nodo
con su contenido. Cierra con un nodo suelto que marca el final de la traza. Es lo que
convierte a "el trazo de ejecución" en un sistema y no en un elemento suelto.

## Do's and Don'ts

### Do:

- **Do** usar los cinco nombres de la escala tipográfica y los siete tokens de color. Nunca un
  hexadecimal ni un tamaño arbitrario dentro de un componente.
- **Do** medir todo par de colores nuevo antes de usarlo: 4.5:1 en texto, 3:1 en elementos no
  textuales, y también las pistas de forma.
- **Do** dar `min-h-11` a todo elemento interactivo, aunque su texto sea de 12px.
- **Do** distinguir un estado activo con **más de una señal**, como hace el selector de tema
  con filete, superficie y color a la vez.
- **Do** construir la profundidad con un escalón de superficie o un filete de un píxel.

### Don't:

- **Don't** agregar `box-shadow`. El sistema es de un solo plano.
- **Don't** rellenar nada de verde salvo el nodo de la sección actual.
- **Don't** volver accionable un elemento ámbar sin cambiarle el color.
- **Don't** introducir un tercer radio ni un tercer círculo.
- **Don't** usar un gradiente. No hay ninguno en el proyecto y no es una omisión.
- **Don't** resolver la falta de densidad visual con adornos: este sistema agrega información,
  no ornamento.
