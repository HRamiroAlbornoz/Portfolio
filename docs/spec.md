# Spec: rediseño de la interfaz

Alcance de este release. Los porqués de cada decisión están en
[`docs/sistema-de-diseno.md`](./sistema-de-diseno.md); el sistema visual vigente, en
[`DESIGN.md`](../DESIGN.md); el producto, en [`PRODUCT.md`](../PRODUCT.md).

## El problema

El portfolio está terminado y en producción, pero se lee austero y frío. El detector mecánico
de Impeccable no encuentra nada sobre los archivos: no sobra código, falta una decisión.

La revisión de diseño del 21/09/2026 nombró la causa con precisión:

> El concepto vive en el documento, no en la pieza.

`DESIGN.md` declara que el sitio se recorre como se recorre la ejecución de un programa, y
nada en la pantalla dice eso: la línea con nodos se lee como una línea de tiempo. Quien no
abrió el repositorio no tiene manera de llegar a la idea.

Y encontró una segunda causa, esta medible: **la estructura del sitio es invisible**. Las
tarjetas, los filetes y el riel están entre 1.12:1 y 1.56:1 contra la página, cuando el propio
sistema exige 3:1 para elementos no textuales.

## Línea de base

Medida sobre el build de producción, guardada en
`.impeccable/critique/2026-09-21T07-00-12Z__src-app-es-page-tsx.md`.

| | Base | Objetivo |
|---|---|---|
| Veredicto de especificidad de diseño | genérico | específico |
| Puntaje de heurísticas | 23 / 36 | ≥ 29 / 36 |
| Hallazgos P0 abiertos | 2 | 0 |
| Hallazgos P1 abiertos | 2 | 0 |

## Alcance

Cinco entregas, en este orden.

1. **Los dos P0.** Contraste de estructura, y el idioma declarado en `/en`.
2. **La composición.** Que el orden de la página coincida con lo que el sitio afirma sobre sí
   mismo: Proyectos antes que Stack, un cierre que cierre, y una biografía que no lidere con lo
   que `PRODUCT.md` descarta.
3. **La apuesta.** La primera pantalla deja de ser una tarjeta de presentación.
4. **Los proyectos, en voz baja.** Material visual propio, la primera captura, y que el
   diferenciador declarado deje de estar enterrado.
5. **El cierre.** Verificación contra esta spec y sincronización de la documentación.

**Por qué la composición va antes que la apuesta.** Son los arreglos más baratos y de mayor
efecto, así que si la apuesta se demora el sitio ya mejoró. Y `shape` diseña sobre una página
cuya jerarquía ya coincide con el posicionamiento, en vez de sobre una que lo contradice.

**Por qué cada una es un PR separado.** La apuesta es la única parte riesgosa. Si llega a
producción y no convence, se revierte su commit de merge sin arrastrar nada más.

---

## Criterios de aceptación

Cada uno se verifica sobre `npm run build` + `npm start`, **nunca contra el servidor de
desarrollo**, en los dos idiomas y en los tres temas (claro, oscuro y sistema).

### 1 · Los dos P0

**Por qué este criterio y no el cumplimiento de WCAG.** El documento de diseño ya argumenta que
el filete de la tarjeta está exento de 1.4.11 porque no es necesario para entender el
contenido. Ese argumento **se sostiene**, pero descansa en una premisa: que *"el agrupamiento ya
lo comunican la superficie elevada y el espaciado"*. La superficie elevada está medida en
**1.12:1**, así que no comunica nada. Y el mismo documento, veinte secciones más abajo,
dictamina que **1.12 y 1.16 son insuficientes** como señal de estado del selector de tema: los
mismos dos números, juzgados de maneras opuestas. Lo que hay que reparar es la premisa, no la
conformidad.

1.1 **La agrupación la comunica el borde, no la superficie.** La primera versión de este
criterio pedía 3:1 entre la tarjeta y la página, y **es inalcanzable**: para lograrlo `surface`
tendría que ser un gris medio, y sobre él `muted`, `trace` y `pending` caerían entre 1.6:1 y
3.1:1, por debajo del 4.5:1 que exige el texto. El escalón de superficie se queda en 1.12:1 y
1.16:1 y deja de ser la premisa: la premisa pasa a ser el borde.

1.2 **El borde de la tarjeta y el del nodo no alcanzado se perciben.** Alcanzan 3:1 o más
contra la página, y el de la tarjeta también contra su propio fondo. No aplica al *relleno* del
nodo inactivo, que es `ink` a propósito: el nodo hueco es lo que significa "todavía no".

**Quedan fuera, a propósito, dos elementos:**

- **La pista inactiva del riel.** En tema claro no existe un gris que quede a 3:1 de la página
  y a 3:1 del verde a la vez: `trace` contra `ink` da 4.85, y harían falta 9. Se eligió que el
  progreso se distinga de la pista, que es la información; el recorrido lo marcan los nodos,
  que sí llegan a 3:1.
- **El filete de la cabecera.** La cabecera es translúcida, así que su contraste depende de lo
  que pasa por debajo al desplazarse. Es un separador decorativo.

1.3 **El progreso del riel se distingue de la pista por luminancia, no solo por tono**:
3:1 o más en los dos temas. Es la misma lección del selector de tema, donde el verde y el gris
de `muted` daban 1.12.

1.4 **La medición queda registrada** en `docs/sistema-de-diseno.md`, con la misma forma que las
tablas de contraste que ya están ahí, **y se corrige el párrafo cuya premisa era falsa**.

1.5 **La paleta sigue teniendo siete tokens.** No se agrega un octavo para resolver esto.

1.6 **En `/en`, ningún bloque de texto en español queda dentro de `lang="en"`.** Se verifica
leyendo el HTML servido, no el código fuente.

1.7 **La imagen de previsualización no se toca.** Los cuatro valores que duplica a mano
—`ink`, `muted`, `fore` y `trace` del tema oscuro— no incluyen `line`, que es el único token
que cambia este arreglo. Si eso dejara de ser cierto, hay que actualizarla **y tocar los dos
archivos de ruta**, o las cachés externas siguen sirviendo la vieja.

### 2 · La composición

2.1 **Proyectos aparece antes que Stack**, y el orden se cambia **solo** en
`src/content/{es,en}/sections.ts`. La primera versión de este criterio afirmaba que eso ya era
así, y era falso: la página tenía el orden escrito a mano en `SiteHome`, y solo el riel leía
el archivo. Por eso esta entrega incluye que `SiteHome` dibuje las secciones recorriendo
`sections`, verificado como refactor puro —el cuerpo de las dos páginas salió idéntico
carácter por carácter— **antes** de cambiar el orden.

2.2 **El riel sigue encendiendo la sección correcta** después del reordenamiento, en los dos
idiomas, incluidos el tope de la página y el final del scroll. Es la verificación que más
importa acá: cambiar el orden mueve todos los desplazamientos.

2.3 **La sección Contacto tiene arquitectura.** El mail deja de ser un enlace en cuerpo de
texto y pasa a ser el elemento tipográficamente más grande de la sección después del título; hay
una frase que dice qué pasa cuando alguien escribe; los dos CV están repetidos ahí. El espacio
reservado por el riel se ocupa con contenido en vez de quedar vacío.

Medido a 1440 × 900: el mail pasó de 17 px a **28 px** (`subtitle`), la frase es *"Respondo en
menos de 24 horas hábiles"* —un compromiso que eligió Hernán—, y de los 450 px de la sección
el contenido ocupa **316**. A 320 px el mail entra con margen y no hay scroll horizontal.

2.4 **La reserva de `50vh` de la última sección sigue cumpliendo su función técnica**: las dos
últimas secciones no terminan en el mismo desplazamiento.

2.5 **La biografía deja de cerrar con "una forma de trabajar"**, que es el posicionamiento
que `PRODUCT.md` descarta. El texto lo decide Hernán.

**Decisión de Hernán, registrada tal cual:** el segundo párrafo pasa a ser *"Full Stack
Developer construyendo aplicaciones web modernas con un enfoque de desarrollo guiado por
especificaciones (SDD) potenciado por IA. Enfocado en código limpio, escalable y mantenible."*
Se le propusieron tres versiones que presentaban el SDD como algo comprobable —la spec y los
criterios de este sitio están en el repositorio— y eligió la suya. **El criterio original
pedía un cierre verificable, y este no lo es**: "limpio, escalable y mantenible" es el tipo de
afirmación que `docs/agregar-proyecto.md` desaconseja. Queda como decisión del autor, no como
criterio cumplido, y la `critique` final puede señalarlo.

La contradicción de disponibilidad —la bio y la portada decían "en remoto" y excluían Tucumán—
se resolvió en esta misma entrega: la bio ya no nombra la modalidad, y la portada dice
*"Disponible en remoto o en Tucumán"*. La imagen de previsualización muestra esa línea, así
que se tocaron los dos archivos de ruta, y las dos URL de `og:image` cambiaron de hash.

2.6 **El cambio entra en los dos idiomas.**

### 3 · La apuesta

3.1 **El veredicto de especificidad de diseño pasa de genérico a específico.** Es el criterio
que manda: mide exactamente lo que se quiere corregir.

3.2 **La metáfora es legible sin leer `DESIGN.md`.** Alguien que entra sin contexto puede
describir qué representa la traza.

3.3 **El hero se sostiene quieto.** Con la animación desactivada, la composición está completa
y es correcta. La secuencia es aditiva, nunca la portadora del valor.

3.4 **Con `prefers-reduced-motion: reduce` no queda ningún estado intermedio.** El último
fotograma de cada animación es igual al estado de reposo.

3.5 **Solo se animan `opacity` y `transform`,** y solo con `@keyframes` y `transition`. Nada
ligado al scroll, nada con `position: sticky` más `transform`, `filter` ni `mix-blend-mode`.

3.6 **CLS se mantiene en 0.1 o menos**, que es el umbral "bueno" de Core Web Vitals, y la
meta real es **no pasar de 0.00**, que es lo medido el 22/09/2026 en las dos páginas: en
escritorio a 1440 × 900 sin limitaciones, y en móvil a 360 × 640 con la CPU limitada 4× y red
Slow 4G. La traza cubre **la carga**, que es donde actúa una secuencia de entrada; el
desplazamiento posterior no quedó medido.

3.7 **La demostración se percibe también a 320 px.** Una apuesta que solo existe en escritorio
no cumple.

3.8 **Sigue habiendo exactamente un `<h1>`** y es el nombre.

3.9 **Las cuatro respuestas del visitante que escanea** —quién es, qué hace, si está disponible
y dónde está el CV— se obtienen en el primer viewport **sin scrollear**, a 320 px y a 1440 px.
Se prueba con alguien ajeno al proyecto.

### 4 · Los proyectos

4.1 **La sección aguanta el crecimiento y la rotación**: se ve bien con cero, uno, tres y ocho
proyectos, con una tecnología y con doce, y con `highlights` vacío.

4.2 **Sumar un proyecto sigue siendo editar un archivo de datos.** Ningún componente conoce un
`slug`.

4.3 **El proyecto diferenciador recibe un tratamiento destacado, y el destaque es un dato.**
Se marca desde el archivo de contenido, no desde el componente, de modo que siga funcionando
cuando los proyectos roten. Ningún componente nombra a `automatehub`.

4.4 **El destaque no rompe los extremos del 4.1**: sigue funcionando con un solo proyecto, con
ocho, y con ninguno marcado.

4.5 **El guard cruzado de `src/content/index.ts` verifica los campos nuevos y también `image`**,
de modo que un dato presente en un idioma y ausente en el otro detiene el build.

4.6 **`docs/agregar-proyecto.md` documenta todos los campos del esquema**, incluido `image`,
que hoy falta.

### 5 · Transversales

5.1 `npm run lint`, `npm run typecheck` y `npm run build` terminan en **0**, leído sin tuberías.

5.2 **Cero comentarios en `src/`**, ningún `any`, **dos** componentes de cliente y **dos**
excepciones de lint. No se agrega una tercera de ninguna de las dos cosas.

5.3 **Sin scroll horizontal** a 320, 640, 768, 1280 y 1440 px, en los dos idiomas.

5.4 **Toda área táctil mide 44 × 44 o más**, medida sobre la caja renderizada.

5.5 **Todo color nuevo o modificado se mide** contra AA: 4.5:1 en texto, 3:1 en elementos no
textuales. Las pistas de forma también se miden.

5.6 **Lighthouse sigue en 100** en accesibilidad, SEO y buenas prácticas, en las dos páginas, en
móvil y escritorio. Medido el 22/09/2026 sobre el build de producción: **100 en las doce
combinaciones**, sin una sola auditoría fallida.

**Ese 100 no prueba accesibilidad.** Se obtuvo con los dos P0 abiertos: Lighthouse no mide el
contraste de bordes y superficies —solo el de texto— ni detecta un bloque en español dentro de
`lang="en"`. Es una baranda que no se puede romper, no evidencia de que el sitio esté bien.

5.7 **El riel enciende la sección correcta** en los dos idiomas, incluidos el tope de la página
y el final del scroll.

5.8 **El 404 sigue entero**, con su metadata y sin heredar una canónica ajena.

5.9 **El sitio funciona con JavaScript desactivado**, salvo el selector de tema, que cae a
`prefers-color-scheme`.

5.10 `impeccable detect` sobre los archivos tocados sigue dando **cero**.

---

## Fuera de alcance

- Rehacer, reemplazar o sumar proyectos.
- Un sistema general de ordenamiento o curaduría de proyectos. El criterio 4.3 destaca **uno**;
  decidir el orden completo cuando haya muchos es otra tarea.
- Revivir el deploy de MateCode, que responde 404 y sigue anunciado como homepage de su
  repositorio. Queda como deuda registrada.
- Traducir los textos de los proyectos. La corrección 1.6 resuelve el defecto de accesibilidad
  sin esperar la traducción.
- Cambiar la dirección visual, mover el selector de idioma a la cabecera, o sumar un tercer
  componente de cliente.
