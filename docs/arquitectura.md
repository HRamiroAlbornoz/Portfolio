# Arquitectura

Este documento registra las decisiones no evidentes del proyecto y la alternativa que se
descartó en cada una. El código no lleva comentarios: el porqué vive acá.

Complemento: [`sistema-de-diseno.md`](./sistema-de-diseno.md) cubre color, tipografía y
temas. [`agregar-proyecto.md`](./agregar-proyecto.md) es la guía práctica para sumar un
proyecto.

---

## Next.js en lugar de Vite

Un portfolio existe para ser **encontrado y compartido**. Su éxito depende de que Google
lo indexe y de que la previsualización se vea bien al pegar el enlace en LinkedIn o en un
chat. Los servidores de esas plataformas piden la página y leen el HTML: **no ejecutan
JavaScript**.

Con Vite, el HTML servido es un contenedor vacío y todo el contenido aparece después,
cuando el navegador ejecuta el JavaScript. La previsualización saldría en blanco.

Next.js genera el HTML completo durante el build. Se puede comprobar:

```bash
npm run build
grep -c "NEXOPAY" .next/server/app/index.html
```

**Cuándo Vite sería la mejor opción:** aplicaciones detrás de un login, paneles de
administración, herramientas internas. Ahí nadie comparte el enlace ni lo indexa nadie, y
el HTML del servidor es peso muerto.

---

## El contenido vive separado del código

`src/content/` guarda los datos; `src/components/` guarda la presentación.

El criterio no es estético: **una estructura se parte por donde el proyecto realmente
cambia**. Acá el contenido cambia seguido (textos, proyectos nuevos, un segundo idioma) y
la presentación casi nunca. Con esa separación, sumar un proyecto es editar un archivo de
datos y sumar inglés es duplicar una carpeta.

**Y así fue.** `src/content/es/` y `src/content/en/` tienen los mismos seis archivos, y los
esquemas de `src/lib/schemas.ts` validan las dos carpetas sin duplicarse.

Se descartó organizar por features (una carpeta por sección con todo adentro): la mayoría
quedaría con uno o dos archivos y el contenido disperso en seis lugares.

### La puerta única, y por qué existe

`src/content/index.ts` importa los doce archivos y expone `getContent(locale)`. Hace tres
cosas que no son evidentes:

**Cierra la trampa del `.parse()`.** Como importa todo, ya no puede quedar un archivo de
contenido sin evaluar. Antes hubo tres.

**Importa `server-only`.** El contenido llama a Zod, y Zod pesa 59 KB medidos en el
navegador. Ahora, si alguien pusiera `"use client"` en un componente que lo importa, el build
falla en vez de mandarlo. Es la misma técnica que usa `theme-script.ts`.

**Valida entre idiomas.** Zod valida cada carpeta por separado: nada le impide a `en/` tener
un proyecto de menos o las secciones en otro orden. `index.ts` es el único lugar donde los
dos idiomas se encuentran, así que ahí se comparan los `id` de sección, los `id` de capa del
stack y los `slug` de proyecto. Si no coinciden, el build para con un mensaje que dice qué
difiere.

Ese chequeo hacía falta porque la deriva era **silenciosa**: `labelFor` cae al `id` crudo si
falta una etiqueta, así que una sección sin traducir se habría renderizado como `about` en
lugar de romper nada.

**Ningún componente importa contenido.** Todos lo reciben por props, y quien resuelve el
idioma es la página o el documento. Eso mantiene la frontera servidor/cliente donde estaba y
hace que agregar un idioma no toque un solo componente.

---

## Los tipos se derivan de los esquemas

`src/lib/schemas.ts` define los esquemas de Zod y de ahí salen los tipos con `z.infer`.
Nunca se escribe una `interface` a mano para lo mismo.

Motivo: un tipo escrito aparte y una validación escrita aparte **se desincronizan al
primer cambio**, y cuando eso pasa el tipo miente y el error aparece en producción.

### Dos redes de seguridad, no una

`schema.parse(datos)` recibe `unknown`, así que **TypeScript no mira lo que le pasás**.
Toda la protección sería de ejecución. Por eso cada archivo de contenido cierra con:

```ts
] satisfies z.input<typeof projectsSchema>);
```

Eso devuelve el chequeo en tiempo de compilación. El reparto queda así:

- **TypeScript, al escribir:** campo faltante, tipo equivocado, campo inventado.
- **Zod, durante el build:** formato del slug, protocolo de las URLs, longitudes máximas,
  unicidad.

### La validación solo corre si alguien carga el módulo

Zod valida cuando el módulo se evalúa, y Next.js solo evalúa lo que es alcanzable desde
una página. Un archivo de contenido que nadie importa es **código muerto**: su `.parse()`
nunca se ejecuta y un dato inválido pasa desapercibido.

Ocurrió en este proyecto: tres de los cinco archivos de `src/content/` quedaron sin
importar y su validación no corría. Se detectó en una revisión de código. Antes de
confiar en esta red, verificá quién importa el archivo.

---

## La frontera entre servidor y cliente

Es la decisión con mayor impacto medible del proyecto.

### El problema

Un componente de cliente arrastra al navegador **todo lo que importa**, de forma
transitiva. Un archivo de contenido parece inofensivo, pero llama a `.parse()`, y eso
trae `schemas.ts` completo y con él Zod.

Medido sobre este proyecto:

| Situación | JavaScript de cliente |
|---|---|
| Sin componentes de cliente | 165.9 KB |
| Con el botón de tema, sin Zod | 169.5 KB |
| Con Zod en el navegador | 228.7 KB |

**El botón cuesta 3.6 KB. Zod cuesta 59.2 KB**, el 35 % del total, para validar un valor
entre tres posibles.

Las tres cifras se midieron en el mismo momento, con el botón de tema como único
componente de cliente, para que la comparación fuera limpia. El total actual es mayor
porque después se sumaron la traza y el pie de página; lo que no cambia es la diferencia
que aporta Zod. Para medirlo en cualquier momento:

```bash
npm run build
cat .next/static/chunks/*.js | gzip -9 -c | wc -c
```

### Las tres reglas que salen de ahí

**1. Los componentes de cliente reciben datos por props.** Solo los de servidor importan
de `src/content/`. Por eso `ThemeToggle` recibe `labels` en lugar de importar
`@/content/ui`.

**2. Los módulos de servidor lo declaran.** `src/lib/theme-script.ts` empieza con
`import "server-only";`. Si un componente de cliente lo importara, el build falla con un
mensaje explícito. La frontera dejó de ser una convención que hay que recordar.

**3. En el navegador se valida sin Zod cuando el conjunto es cerrado.**
`isThemePreference` deriva del mismo `THEME_PREFERENCES` que alimenta el script de
arranque: una sola fuente de verdad, seis líneas, cero dependencias. La validación no
desaparece; cambia la herramienta. Zod se sigue usando en todo el servidor.

Esto se aparta de la regla general de validar `localStorage` con `safeParse`. La
excepción es deliberada y está respaldada por la medición de arriba.

---

## El script de tema se duplica a propósito

La lógica que resuelve el tema —"oscuro si la preferencia es `dark`, o si es `system` y el
sistema prefiere oscuro"— está escrita dos veces: en el script de arranque
([`theme-script.ts`](../src/lib/theme-script.ts)) y en el botón
([`ThemeToggle.tsx`](../src/components/ui/ThemeToggle.tsx)).

No se puede compartir. El script es un string que se ejecuta **durante el análisis del
HTML**, antes de que exista ningún módulo de JavaScript; no puede llamar a una función
importada. Serializar una función con `.toString()` sería frágil frente a la minificación.

Lo que sí se comparte son las constantes: la clave de almacenamiento, los nombres de
atributos, la consulta de medios y la lista de preferencias válidas viven una sola vez en
[`theme.ts`](../src/lib/theme.ts) y se interpolan en el script.

---

## La traza

El elemento firma del diseño: una línea vertical que se dibuja con el scroll, con un nodo
por sección, que **es** la navegación.

### El progreso no pasa por React

Actualizar estado de React en cada píxel de scroll dispararía cientos de renders por
segundo. En cambio, el componente escribe una variable CSS directamente sobre el elemento:

```ts
rail.style.setProperty("--trace-progress", readScrollProgress().toFixed(4));
```

y el CSS la usa para escalar la línea. **Cero renders durante el scroll.** La escritura se
agenda con `requestAnimationFrame` para no hacerla más de una vez por cuadro.

### La sección activa se calcula por posición, no por observador

La primera versión usaba `IntersectionObserver` y tenía un defecto: solo actualizaba
cuando una sección **entraba** en la franja central. Al salir todas —arriba del todo, o al
final de la página— nunca se limpiaba y quedaba pegada la última.

La versión actual recorre las secciones y elige la última cuyo borde superior ya pasó la
línea media de lectura. Es determinista: da el mismo resultado para la misma posición de
scroll, sin importar cómo se llegó ahí.

Caso especial: la última sección es corta y su borde superior nunca alcanza la línea media
porque la página deja de desplazarse antes. Por eso, al llegar al final, se marca
directamente la última.

### Vive en la página, no en el layout

La traza está en [`SiteHome`](../src/components/layout/SiteHome.tsx), junto a las secciones
que navega. El encabezado y el pie sí están en el documento compartido.

El criterio: **el layout es el marco de todo el sitio; la traza navega las secciones de
una página concreta.** Estuvo mal ubicada al principio y el efecto se vio en la página de
error, que heredaba los seis enlaces `href="#…"` apuntando a identificadores que ahí no
existen. Además, al vivir en el layout nunca se volvía a montar, así que la sección activa
quedaba obsoleta al navegar entre rutas.

Por el mismo motivo, el logo del encabezado enlaza a `/` con `next/link` y no a un ancla:
el encabezado aparece en todas las rutas y un ancla solo funciona donde su destino existe.

### Se muestra desde 1024 px

Necesita que el contenido esté centrado con margen a los lados. Por debajo de eso, la
columna ocupa todo el ancho y la traza se superpone al texto — comprobado a 768 px, donde
el borde de la traza caía justo sobre el inicio del párrafo.

En móvil no hay reemplazo, y es una decisión: recorrer con el dedo es lo natural ahí, y
una barra fija se comería el ancho de lectura.

---

## Los iconos de tecnologías

Los trazados vienen de [Simple Icons](https://simpleicons.org), que se publica bajo CC0
(dominio público). Están copiados en [`src/lib/icons.ts`](../src/lib/icons.ts), no
instalados como dependencia.

**Por qué copiarlos y no instalar el paquete:** la colección tiene más de tres mil iconos
y el proyecto usa veinte. Aunque los empaquetadores eliminan lo no usado, un import mal
hecho basta para arrastrar el resto — ya pasó con Zod, y costó 59 KB. Copiar los veinte
elimina la posibilidad.

**Por qué monocromos:** cada logo trae su color de marca. Veinte colores ajenos
dentro de una paleta de siete medidos rompen la coherencia visual. Los iconos usan
`fill-current`, así que heredan el color del texto y se integran en lugar de competir.

**Por qué algunos no tienen logo:** cuatro de los veinticuatro elementos del stack son
conceptos, no productos — `APIs REST`, `SQL`, `Supertest` y `Git Flow`. Simple Icons solo
cataloga marcas, así que no existen y no deberían existir. Llevan un círculo hueco en
gris, que mantiene el ritmo visual **y dice algo verdadero**: distingue una herramienta de
un concepto.

El campo `icon` del esquema es opcional y se valida contra las claves reales de
`icons.ts`: un nombre inexistente rompe el build.

Costo medido: el HTML de la página pesa **29.4 KB comprimido** con los veinte trazados
incluidos, y el JavaScript de cliente no cambió, porque todo se renderiza en el servidor.
Los trazados aparecen dos veces en el HTML —una en el marcado y otra en los datos que
Next.js serializa para hidratar— lo cual es normal del App Router. Si en una auditoría de
rendimiento hiciera falta recortar, ahí hay margen con un sprite SVG.

---

## La imagen de previsualización

[`preview-image.tsx`](../src/lib/preview-image.tsx) genera el PNG de 1200x630 que
LinkedIn, WhatsApp o Slack muestran cuando alguien comparte el enlace. Next.js lo
prerenderiza durante el build: en producción es un archivo estático, no se dibuja en
cada visita.

Se dibuja con `ImageResponse`, que por dentro usa Satori. Satori **no es un navegador**:
no ejecuta CSS, no lee `globals.css` y no conoce las fuentes del sitio. Recibe un árbol
de JSX con estilos en línea y devuelve una imagen. De ahí salen las tres restricciones
que explican por qué este archivo se ve distinto al resto del proyecto.

### Solo flexbox, y `display: flex` en todo

Satori soporta flexbox y posicionamiento absoluto. **No soporta grid.** Además, todo
elemento con hijos necesita su `display` declarado de forma explícita: si falta, el
build falla con un error poco descriptivo.

La traza usa la misma técnica estructural que la sección Stack: el riel es una columna
flex con un nodo arriba, un nodo abajo y una línea con `flexGrow: 1` en el medio. La
línea mide lo que sobra, así que los nodos quedan alineados con el borde superior e
inferior del contenido sin que haya un solo margen calculado a mano. Si el texto cambia
de largo, la traza se reajusta sola.

### La paleta está duplicada, y es a propósito

Los cuatro colores viven como constantes al principio del archivo, repitiendo valores que
ya están en [`globals.css`](../src/app/globals.css). No es un descuido: Satori no puede
leer variables CSS, así que no hay forma de tener una sola fuente de verdad.

**Es el único lugar del proyecto donde la paleta oscura está duplicada.** Si se cambia un
color del tema oscuro, hay que cambiarlo también acá. La alternativa —declarar la paleta
en TypeScript y generar el CSS desde ahí— resolvería la duplicación a cambio de meter un
paso de build entre el diseño y el navegador, que es un precio alto por cuatro valores que
casi nunca cambian.

Eran cinco hasta que la línea divisoria del pie desapareció, y con ella el único uso de
`line`.

La imagen usa siempre el tema oscuro. Una previsualización no tiene forma de conocer la
preferencia de quien la mira, y el oscuro es la identidad del sitio.

### Las fuentes viven en el repositorio

`assets/fonts/` guarda las tres fuentes en `.woff`, con su licencia. Hay tres decisiones
encadenadas ahí:

**Se incrustan** porque Satori no hereda nada del sitio: hay que pasarle el binario. Sin
esto la imagen saldría con la tipografía por defecto y no se parecería al portfolio.

**Se guardan en el repositorio** en lugar de descargarse durante el build. Descargarlas
ahorraría 67 KB de repositorio a cambio de que el build falle si Google Fonts no responde
en ese momento. Es el mismo criterio que con los iconos: nada externo en el camino
crítico del build.

**Formato `.woff`** porque es el más liviano de los tres que Satori acepta: `ttf`, `otf`
y `woff`. `woff2` **no** está soportado, y es el formato que sirven casi todos los CDN
por defecto — es el error fácil de cometer acá.

Las fuentes se leen una sola vez al cargar el módulo, no dentro de la función. Es lo que
recomienda la documentación de Next.js: el archivo no depende de la petición, así que
leerlo en cada invocación sería trabajo repetido.

Como la ruta se prerenderiza, `assets/` solo hace falta **durante el build**. No es una
dependencia de tiempo de ejecución y no necesita entrar en el paquete del servidor.

### La URL de la imagen se invalida con el archivo, no con el contenido

Esto ya no es una restricción de Satori sino del cargador de metadatos de Next.js, y
conviene conocerlo porque no se manifiesta como un error.

Next.js agrega a la URL de la previsualización un hash **calculado sobre el contenido del
archivo** `opengraph-image.tsx`. Es la manera de que las cachés externas se enteren de que
la imagen cambió.

El problema es que ese archivo **lee** el `site.ts` de su idioma y el hash no mira las
importaciones. Al cambiar el rol y la frase de presentación, la imagen cambió y la URL siguió
siendo `?882e14b702883b65`. LinkedIn releyó el HTML —el título se actualizó— y siguió
mostrando la imagen vieja, porque para su caché la dirección era la misma.

**Con dos idiomas la trampa es peor**: el dibujo vive en `src/lib/preview-image.tsx` y los
archivos de ruta son dos, uno por grupo. Un cambio en el módulo compartido no invalida
**ninguna** de las dos URL.

**Regla práctica: al cambiar el dibujo o el contenido que aparece en la previsualización, hay
que tocar también los dos archivos de ruta**, `(es)/opengraph-image.tsx` y
`(en)/en/opengraph-image.tsx`. Cualquier cambio real sirve; la primera vez fueron los tamaños
de letra del pie.

### Los tamaños son para el tamaño en que se ve, no para el lienzo

Tampoco es una restricción técnica: es una regla de diseño que solo se descubre mirando la
pieza donde se consume.

La imagen se dibuja sobre 1200 × 630 px, pero LinkedIn la muestra a unos 540 px de ancho:
menos de la mitad. Todo texto se reduce al 45 %, y lo que en el lienzo parece cómodo puede
ser ilegible en la tarjeta.

El pie estaba en 20 px, o sea **9 px** en la tarjeta: una mancha gris. Y era la línea que
dice "disponible para trabajar en remoto", probablemente el dato más accionable de toda la
pieza. Pasó a 26 px —12 px en la tarjeta— y el rol de 25 a 30.

Para que el pie más grande entrara, sus dos partes se apilaron en lugar de compartir una
línea con una rayita en el medio: a 20 px ya ocupaba 964 px de los 970 disponibles, así que
no había un solo pixel para crecer. La rayita no se extraña, porque medía 1 px de alto y a
la escala de LinkedIn desaparecía de todos modos.

**Cualquier cambio de tipografía en esta imagen se verifica a 540 px de ancho, no a 1200.**

### Presupuesto

`ImageResponse` limita a **500 KB** la suma de JSX, CSS, fuentes e imágenes. Acá se usan
67 KB, todo en fuentes. El PNG resultante pesa 59 KB.

### Las etiquetas las cablea Next.js

No hace falta un `twitter-image.tsx` aparte ni declarar `openGraph.images` en el
`layout.tsx`. Por la sola presencia del archivo, Next.js emite `og:image` y
`twitter:image` con su tipo, ancho, alto y texto alternativo. El `alt` sale del `export
const alt` del propio archivo de ruta, y el contenido de la imagen sale del `site.ts` del
idioma que corresponda: el nombre, el rol, la frase y la disponibilidad no están escritos
dos veces.

---

## Dos idiomas, dos layouts raíz

El español vive en `/` y el inglés en `/en`. El idioma nuevo se sumó; el existente no se
movió, porque esa URL ya estaba impresa en dos CV, compartida en LinkedIn e indexada.

### Por qué grupos de rutas y no `app/[lang]`

`<html lang>` se declara en el layout raíz, y **un layout anidado no puede cambiarlo**. Para
que `/` sea `lang="es"` y `/en` sea `lang="en"` hacen falta dos layouts raíz, y esta versión
de Next.js los soporta con grupos de rutas: `src/app/(es)/` y `src/app/(en)/`.

El manual de i18n de Next.js propone `app/[lang]/`, que es el camino más transitado. Se
descartó porque llevaría el español a `/es` y obligaría a redirigir la raíz.

### El precio: el 404 dejó de componerse solo

Con dos layouts raíz **no hay ninguno desde el cual armar el 404 global**: una URL que no cae
en ningún grupo no tiene layout que Next pueda elegir. La primera prueba lo confirmó — una
dirección inventada devolvía la pantalla genérica de Next, en inglés y sin diseño.

Se midieron dos salidas antes de decidir:

| | Ruta comodín | `global-not-found` |
|---|---|---|
| Código HTTP | 404 | 404 |
| `lang` en el HTML del servidor | ausente | **`lang="es"`** |
| Tema y fuentes en el servidor | ausentes | **presentes** |
| Se arma con JavaScript | sí | **no** |
| Ruta | dinámica | **estática** |

La ruta comodín funcionaba pero devolvía `<html id="__next_error__">` vacío y convertía el
404 en una función de servidor, contradiciendo la decisión fundacional de que todo se
prerenderiza. Ganó `global-not-found`, con `experimental.globalNotFound` en
`next.config.ts`.

**Es una API experimental y eso se asume a conciencia.** Si una versión futura la cambia, el
síntoma es un build que falla con un mensaje claro, no un error silencioso, y la salida es
volver al comodín, que ya se probó y funciona.

Consecuencia estructural asumida: **hay un solo 404 y se sirve en español**, incluso para una
URL rota bajo `/en`. Una dirección que no existe no tiene idioma, y el español es el idioma
por defecto del sitio.

### El documento vive una sola vez

`src/app/_site-document.tsx` contiene `<html>`, `<head>`, `<body>`, la cabecera y el pie, y lo
usan los dos layouts y el 404. Está **dentro** de `src/app/` a propósito: la regla
`@next/next/no-head-element` marca `<head>` fuera de ese directorio, donde el patrón correcto
es `next/head` del Pages Router.

Se intentó sacar el `<head>` para poder alojarlo en `src/components/`. **El script de tema
quedaba fuera del head**, al inicio del `body` —medido por posición de bytes—, lo que
reintroduce el parpadeo de tema que el script existe para evitar. Se volvió atrás.

### El selector de idioma

Está en la primera fila de la portada, alineado al pixel bajo el control de tema, y repetido
en el pie para quien ya bajó. Se descartó ponerlo en la cabecera: a 320 px quedaban 76 px
libres y un cuarto control los habría consumido, justo después de haber ajustado esa
cabecera para que respirara.

Muestra `EN` o `ES`, pero **su nombre accesible es una frase completa** —"Ver este sitio en
inglés"— porque un enlace que se anuncia como "EN" no le dice nada a quien usa un lector de
pantalla. El texto visible va con `aria-hidden` y la frase en `sr-only`.

Lleva `hrefLang` y **no** `lang`: `hrefLang` describe el idioma del destino, que es correcto;
`lang` habría declarado que el contenido del enlace está en el otro idioma, y habría hecho
que un lector de pantalla leyera la descripción en español con pronunciación inglesa.

---

## Indexación

Cuatro decisiones que parecen detalles y no lo son. Las tres primeras salieron de la
revisión del PR #5; la cuarta apareció al verificar la corrección.

### La URL canónica vive en la página, no en el layout

Una canónica declara *"esta es la dirección buena de esta página"*. Es una propiedad de
cada página, no del marco que las envuelve.

Estaba en `layout.tsx`, y el layout envuelve **todas** las rutas. La consecuencia: cada
URL inexistente se servía con `noindex` y, al mismo tiempo, declarando que su versión
canónica era la portada. Son dos señales que se contradicen, y Google puede resolver la
contradicción juntando el par y sacando del índice la portada, que es la única página
indexable del sitio.

Ahora `alternates` se declara en las páginas, con `homeMetadata(locale)` de
[`metadata.ts`](../src/lib/metadata.ts). La 404 no declara ninguna, que es lo correcto para
una página que no se indexa.

**Cuidado al mover metadatos entre segmentos:** Next.js los fusiona de forma
**superficial**. Un objeto anidado definido en la página —`openGraph`, `twitter`,
`robots`— **reemplaza entero** al del layout, no se combina campo por campo. Por eso
`openGraph` se dejó completo en el layout: moverle solo el campo `url` a la página habría
borrado el tipo, el idioma y el nombre del sitio.

`openGraph.url` sigue apuntando a la portada en todas las rutas. Es deliberado: no influye
en la indexación —Google usa la canónica, no esta etiqueta— y hace que compartir un enlace
roto muestre la tarjeta de la portada en lugar de una tarjeta rota.

**Con `global-not-found` eso hay que sostenerlo a mano.** Al ser su propia raíz, la 404 no
hereda de ningún layout: compone su `metadata` con `...rootMetadata(DEFAULT_LOCALE)` y solo
reemplaza el título. Sin ese esparcido queda sin `description`, sin `openGraph` y sin
`twitter`, y un enlace roto compartido en LinkedIn muestra una tarjeta vacía. **Pasó**: se
introdujo al montar los dos idiomas y lo detectó la revisión del PR #17.

Lo único que no se recupera es `og:image`: la imagen se asocia por convención de archivo al
segmento de ruta, y la 404 no tiene ninguna hermana. La tarjeta sale con título, descripción
y dominio, sin imagen. Es un caso raro —hay que compartir un enlace roto— y la alternativa
sería cablear a mano una URL que lleva un hash de contenido y se desactualizaría sola.

### No hay etiqueta `robots` en la portada

`index, follow` es el comportamiento por defecto de cualquier página. Declararlo no agrega
información.

Peor: declararlo en el layout provocaba que la 404 emitiera **dos** etiquetas `robots`,
porque Next.js ya emite `noindex` por su cuenta en las rutas no encontradas. Al sacar la
declaración del layout y también la de `not-found.tsx`, la portada no lleva ninguna
—y es indexable por defecto— y la 404 lleva exactamente una, la del framework.

**Este defecto volvió una vez.** Al escribir `global-not-found.tsx` se le puso
`robots: { index: false, follow: false }`, por las dudas, y reapareció el par de etiquetas en
conflicto —más un `nofollow` que le pedía al buscador no seguir el único enlace de la
página—. La regla, entonces, escrita como regla: **la 404 no declara `robots`; el framework
ya lo hace.**

### El mapa del sitio no declara fechas

`lastModified` guardaba `new Date()`, que es **el momento del build**, no la fecha en que
cambió el contenido. Un despliegue que solo toca documentación habría declarado que la
portada cambió. Google descarta los `lastmod` que detecta poco confiables, así que una
fecha inventada no solo no ayuda: resta credibilidad al resto del archivo.

`changeFrequency` y `priority` se quitaron por la misma razón. Google los ignora, y
`priority` es una escala **relativa entre las URLs del propio sitio**: con una sola URL no
puede expresar nada.

El mapa quedó con lo único verificable: la dirección.

### El destino del enlace de salto recibe el foco

Un enlace a `#main-content` mueve la vista, pero **no necesariamente el foco del teclado**.
En navegadores basados en WebKit, saltar a un elemento que no puede recibir foco deja el
foco donde estaba: la página baja, y el siguiente `Tab` vuelve a la cabecera. El enlace no
saltea nada, justo para la persona a la que sirve.

Por eso los dos `<main>` llevan `tabIndex={-1}`: los vuelve enfocables por programa sin
meterlos en el orden de tabulación.

Eso trajo un efecto secundario. Al poder recibir foco, la regla global `:focus-visible`
les dibujaba un contorno alrededor de **todo** el contenido. Como `<main>` es más alto que
la pantalla, no se veía un recuadro sino dos líneas verticales sueltas a los costados: no
comunicaba nada y parecía un error de maquetado.

Los dos `<main>` llevan entonces `focus-visible:outline-none`. **No debilita la
accesibilidad:** el criterio de foco visible de WCAG aplica a los componentes operables
por teclado, y un contenedor con `tabIndex={-1}` no está en el orden de tabulación. La
retroalimentación real la dan el desplazamiento, el anuncio del punto de referencia
principal en el lector de pantalla, y el anillo de foco del primer enlace al pulsar `Tab`.

Verificado en navegador: el foco queda en `main#main-content`, el `Tab` siguiente cae en
el primer enlace **dentro** del contenido, y el anillo de foco del resto de los elementos
sigue intacto.

---

## Datos personales

### Qué se publica a propósito

Nombre, rol, ciudad, email, enlaces a GitHub y LinkedIn, y los dos CV en PDF. Son datos
que el portfolio existe para difundir.

El email queda expuesto a recolección automatizada. Es una decisión consciente: ya está en
el CV que circula por bolsas de trabajo, y ocultarlo solo agregaría fricción a quien sí
querés que te escriba.

### Qué no se publica

El teléfono. Está fuera del sitio **y fuera de los PDF publicados**.

Ese es el punto que conviene recordar: **los PDF son el vector riesgoso**. Llevan adentro
datos que el sitio no muestra, y nadie los inspecciona antes de commitearlos. Antes de
agregar un documento al repositorio, revisá qué contiene.

### Si algo se publicó por error

1. Corregir el archivo original, no el generado.
2. Reescribir el commit que lo introdujo. **Un commit nuevo no alcanza**: el archivo
   viejo sigue siendo recuperable desde el commit anterior.
3. `git push --force-with-lease` sobre la rama, **antes de mergearla**. Con `main`
   protegida, después es mucho más incómodo.
4. Abrir un ticket en el soporte de GitHub pidiendo la recolección de objetos
   inalcanzables. Reescribir el historial local **no borra nada del servidor**: los
   commits huérfanos siguen siendo accesibles por su identificador y quedan referenciados
   desde la cronología del Pull Request, que es de solo lectura.

**Si lo expuesto fue una credencial, el orden se invierte:** primero se revoca en el
proveedor, después se limpia el repositorio. Un secreto que estuvo visible sigue
comprometido aunque lo borres.

---

## Integración continua

[`ci.yml`](../.github/workflows/ci.yml) corre `lint`, `typecheck` y `build` en cada push a
`main` y en cada Pull Request dirigido a `main`. Los pushes a una rama de trabajo no lo
disparan por sí solos: llegan al CI a través del PR, que es lo que evita gastar minutos en
cada commit intermedio.

### El token del workflow es de solo lectura

`permissions: contents: read`. Por defecto, GitHub le presta al workflow un token con
permisos de escritura sobre el repositorio. Este solo necesita leer código. Si algún día
un paquete comprometido lograra ejecutar algo durante `npm ci`, no podría escribir.

### `npm ci`, no `npm install`

`install` puede actualizar `package-lock.json` si encuentra versiones más nuevas. `ci`
instala exactamente lo que dice el lock y falla si no coincide con `package.json`. En CI
se busca reproducibilidad, no novedades.

### La versión de Node iguala la de producción

`node-version: 24`, que es lo que corre Vercel. Si el CI probara con otra versión, podría
aprobar código que después falla al desplegar.

### La URL del sitio en CI es falsa a propósito

El build necesita `NEXT_PUBLIC_SITE_URL`: sin ella, el esquema de
[`env.ts`](../src/lib/env.ts) lanza el error y el build se corta. Verificado corriendo el
build con la variable vacía.

El workflow define `https://ci.invalid`. `.invalid` es un dominio reservado que nunca puede
existir de verdad. La alternativa —poner la URL real— la duplicaría en dos lugares, el
workflow y el panel de Vercel, que tarde o temprano se desincronizan. Un valor
evidentemente falso avisa que eso no es producción.

No se pierde nada: la URL no influye en si el código compila, y la URL real la valida el
build de Vercel con este mismo esquema. Si se carga mal ahí, el despliegue falla y no
llega a publicarse. Tampoco es un secreto: `NEXT_PUBLIC_*` viaja al navegador por
definición.

### Por qué `typecheck` genera tipos antes de chequear

La primera corrida del CI falló así:

```
src/app/layout.tsx(60,50): error TS2304: Cannot find name 'LayoutProps'.
```

`LayoutProps` no está escrito en el proyecto: **lo genera Next.js** dentro de `.next/types/`
a partir de las rutas que encuentra, para que el tipo de las props conozca las rutas que
existen de verdad.

En una máquina de trabajo el tipo siempre está, porque `.next/` quedó de builds
anteriores. En CI, `typecheck` corre sobre un repositorio recién clonado donde `.next/` no
existe. El error estuvo latente durante cinco fases y ninguna revisión local podía
revelarlo.

La corrección va en el script, no en el workflow:

```json
"typecheck": "next typegen && tsc --noEmit"
```

Arreglarlo solo en el workflow dejaría `npm run typecheck` roto para cualquiera que clone
el repositorio limpio. Es además el patrón que recomienda la documentación de Next.js para
CI, porque `next typegen` genera las definiciones de rutas sin hacer un build completo.

`next-env.d.ts`, que ese comando también genera, está en `.gitignore`: el chequeo de tipos
no deja el árbol sucio.

### El orden para exigir el check en `main`

GitHub solo permite marcar como obligatorio un check que **ya reportó al menos una vez**.
Por eso el workflow se mergea primero y la protección de rama se configura después. Al
revés, el check no aparece en la lista.

---

## Cabeceras de seguridad

[`next.config.ts`](../next.config.ts) envía cuatro cabeceras en todas las rutas.

Ninguna de ellas es la protección del sitio contra XSS. **Esa vive en el código**, y es más
fuerte: no hay ningún punto donde entren datos de la petición, React escapa todo el texto,
Zod valida el contenido, el tipo marcado `ScriptLiteral` convierte en error de compilación
cualquier interpolación sin serializar, y `react/no-danger` prohíbe
`dangerouslySetInnerHTML` fuera de un único archivo autorizado. Una cabecera **mitiga**: el
error existe y el navegador lo frena. Esas capas **previenen**: el código con el error no
llega a compilar.

Con una salvedad que conviene no perder de vista. Las dos garantías no son equivalentes:
`react/no-danger` es una regla de lint que un `eslint-disable` desactiva en silencio, y la
marca `ScriptLiteral` protege **solo** esa plantilla. Un segundo `dangerouslySetInnerHTML`
agregado bajo una excepción no llevaría ninguna guarda, y en ese escenario la CSP sería la
única capa en pie —y con `'unsafe-inline'` no lo estaría—. La conclusión no es cambiar la
política, sino que la regla de lint y su excepción de un solo archivo se revisan con
cuidado cada vez que alguien las toque.

Las cabeceras cubren lo que esas capas no alcanzan.

### Por qué la CSP permite scripts en línea

`script-src` incluye `'unsafe-inline'`, que es exactamente la directiva que una CSP estricta
evita. No es una concesión por comodidad: las dos alternativas se evaluaron y ninguna sirve
acá.

**Nonce (un token distinto por visita).** Es lo que recomienda Next.js, y su propia
documentación advierte el costo: *"todas las páginas deben renderizarse dinámicamente; la
optimización estática y la ISR quedan deshabilitadas; las páginas no pueden ser cacheadas
por CDN"*. El motivo es estructural: el token se genera al recibir la petición, y una página
estática se construyó mucho antes de que esa petición existiera. Adoptarlo significaría
perder el prerenderizado, medido en producción en 49 ms de TTFB.

**Huella criptográfica del script.** Autoriza un script exacto y ningún otro, y es
compatible con el prerenderizado. Se descartó al contar los scripts en línea que la página
emite realmente. Este es el build del commit que introdujo estas cabeceras:

```
 1.    633 bytes | (function () { var allowed = ["system","light","dark"]  <- el del tema
 2.     43 bytes | (self.__next_f=self.__next_f||[]).push([0])             <- de Next.js
 3.  18809 bytes | self.__next_f.push([1,"1:\"$Sreact.fragment\"...        <- de Next.js
 4.  17904 bytes | self.__next_f.push([1,"M23.5594 14.7228a.5269...        <- de Next.js
 5.  15099 bytes | self.__next_f.push([1,"2f:T49c,M1.125 0C.502 0...       <- de Next.js
 6.   2661 bytes | self.__next_f.push([1,"32:I[27201,...                   <- de Next.js
```

Son seis, no uno. Cinco los genera Next.js y contienen el contenido serializado de la
página —incluidos los trazados de los iconos, visibles en los ítems 4 y 5—, así que su
huella cambia **cada vez que se edita un texto o se agrega un proyecto**.

**Esa lista de arriba es una foto, y no se reproduce.** Una medición anterior sobre el
mismo código había dado **cuatro** scripts, con otros tamaños: Next.js reparte ese
contenido en más o menos trozos según el build. O sea que las huellas no solo cambiarían de
valor, sino que ni siquiera se puede saber de antemano **cuántas** hacen falta.

Mantenerlas a mano es inviable, y Next.js no ofrece nada que las calcule y las inyecte en la
cabecera. El fallo además sería silencioso: el script del tema dejaría de ejecutarse y el
síntoma sería el parpadeo al cargar, sin ningún error en consola.

`'unsafe-inline'` no mira el contenido de los scripts, así que editar contenido nunca rompe
nada.

### Qué protege entonces

| Directiva | Qué bloquea |
|---|---|
| `frame-ancestors 'none'` | Que el sitio se cargue dentro de un iframe ajeno (*clickjacking*) |
| `script-src 'self'` | Scripts servidos desde cualquier dominio que no sea el propio |
| `object-src 'none'` | Plugins embebidos |
| `base-uri 'self'` | Que se reescriba la base de todas las URLs relativas |
| `form-action 'self'` | Que un formulario inyectado envíe datos afuera |
| `upgrade-insecure-requests` | Peticiones sin cifrar |

Lo que no frena es el XSS en línea, que es justo el ataque para el que este sitio no tiene
puerta de entrada.

Las otras tres cabeceras no tienen contrapartida: `X-Content-Type-Options: nosniff` impide
que el navegador adivine el tipo de un archivo y lo trate como código;
`Referrer-Policy: strict-origin-when-cross-origin` evita filtrar la ruta completa al salir
del sitio; `Permissions-Policy` desactiva cámara, micrófono, geolocalización y la API de
temas de navegación, que el sitio no usa.

No se agregó `X-Frame-Options` porque `frame-ancestors` cumple la misma función y la
reemplaza en todos los navegadores actuales.

### La barra de Vercel, solo en las vistas previas

Vercel inyecta su barra de herramientas en los despliegues de vista previa. Necesita cargar
recursos de `vercel.live`, `vercel.com` y `assets.vercel.com`, y abrir un websocket contra
`ws-us3.pusher.com`. Con la política inicial esos orígenes quedaban bloqueados y la barra no
cargaba.

Esos orígenes se agregan **solo cuando `VERCEL_ENV` vale `preview`**, no en producción. La
barra no corre en producción, así que autorizar ahí cinco orígenes externos sería aflojar la
política a cambio de nada.

De paso, la corrección dejó producción **más estricta** que antes: `connect-src 'self'` y
`frame-src 'none'` ahora son explícitos, cuando antes heredaban de `default-src`.

Las directivas exactas salen de la documentación de Vercel, no de prueba y error. Verificado
construyendo con `VERCEL_ENV=preview` y leyendo la cabecera resultante en
`.next/routes-manifest.json`.

### `unsafe-eval` solo en desarrollo

`script-src` suma `'unsafe-eval'` cuando `NODE_ENV` es `development`, porque React lo
necesita para reconstruir los stacks de error en el navegador. En producción no aparece,
verificado en las cabeceras servidas por un build de producción.

### Cuándo va a hacer falta tocar esto

El día que se agregue algo externo —analíticas, un video embebido, una fuente de un CDN, un
iframe—, la CSP lo va a bloquear hasta que ese origen se sume a la directiva
correspondiente. Es un fallo **visible**: el elemento no aparece y la consola dice qué
origen se bloqueó y por qué. Eso es la CSP funcionando, no fallando.

### Verificación

Contra un build de producción local: las cuatro cabeceras presentes en todas las rutas,
cero violaciones en consola, el script del tema ejecutado (el atributo `data-theme-resolved`
presente), las tres tipografías cargadas, y el tema oscuro persistiendo tras recargar sin
parpadeo. En desarrollo, cero errores y cero advertencias.

---

## El logo de la cabecera

El logo usa un `<a>` común con `href="/#main-content"`. Las tres partes de esa decisión
salieron de errores concretos, no de preferencias.

### Por qué no apunta a `/`

Apuntaba ahí, y **no hacía nada**. Next.js lo documenta: `<Link>` *mantiene la posición de
scroll* mientras la página destino siga visible en la ventana. En un sitio de una sola
página siempre lo está, así que la URL cambiaba a `/` y el lector se quedaba donde estaba.

### Por qué la barra inicial no se puede quitar

La página 404 **también** tiene un `<main id="main-content">`. Con `#main-content` a secas,
el logo haría scroll dentro de la propia 404 en vez de sacar de ahí, justo en la página que
más necesita una salida.

Con la barra, el navegador compara la URL completa: desde la portada solo difiere el
fragmento, así que es un salto instantáneo dentro del documento; desde la 404 difiere la
ruta, así que navega a la portada y después se desplaza.

### Por qué es un `<a>` y no un `<Link>`

Se probó con `<Link>` y falla en el caso más común de todos: **tocarlo dos veces**.

Una vez que la URL es `/#main-content`, `<Link>` compara destino y actual, las ve iguales y
decide que no hay navegación que hacer. Medido: desde scroll 2000, `<Link>` deja la página
en 2000; un `<a>` común la lleva a 1. El navegador, ante un fragmento, vuelve a desplazarse
coincida o no la URL.

Esto obligó a desactivar `@next/next/no-html-link-for-pages` en
[`eslint.config.mjs`](../eslint.config.mjs). Es la segunda excepción de lint del proyecto,
después de `react/no-danger` en `layout.tsx`.

### Por qué el ancla vive en su propio archivo

`HomeLink` existe **solo** para que la excepción de lint tenga el alcance más chico posible.
Podría ser cuatro líneas dentro de `SiteHeader`, pero entonces la excepción cubriría toda la
cabecera: cualquier enlace interno que se agregara ahí en el futuro quedaría sin vigilancia.

Con el ancla aislada, la excepción cubre un archivo cuyo único contenido **es** esa ancla, y
`SiteHeader` conserva la regla activa. Verificado: un `<a href="/">` agregado dentro de
`SiteHeader.tsx` hace fallar el lint con código de salida 1.

Se descartó la otra forma de acotarlo, un `eslint-disable-next-line` sobre la línea: es un
comentario en el código, y este proyecto no lleva comentarios.

### El alcance real de la regla

La regla **solo se dispara con `href` que resuelven a una ruta que existe**. Una prueba con
`<a href="/about">` no fue marcada, porque esa ruta no existe en el sitio. Así que el riesgo
que se acepta es más angosto de lo que parece: alcanza a enlaces hacia `/`, no a cualquier
enlace interno.

**La regla es un falso positivo para el caso de la portada.** Existe para evitar recargas
completas al navegar entre páginas: detecta que el `href` empieza con `/` y no mira más
allá, sin ver que hay un fragmento ni que el destino es la misma página. Desde la portada no
hay ninguna recarga.

### Desde el resto de las rutas sí hay navegación completa

Conviene decirlo, porque el argumento anterior no cubre este caso. Desde la 404, el logo
descarta el documento, vuelve a ejecutar el script del tema y reaplica las tipografías,
mientras que un `<Link>` haría una transición del lado del cliente.

Medido sobre un build de producción, ese salto desde la 404 cuesta **34 ms en total, con 0
bytes de red**: los trece recursos salen de la caché del navegador. Contra un CDN habría que
sumar el tiempo hasta el primer byte, medido en producción en 49 ms. Sigue siendo del orden
de la décima de segundo, en una página que se visita rara vez y de la que el usuario quiere
salir. El cuerpo de la 404 conserva además su propio `<Link href="/">`, que sí hace la
transición rápida.

Se aceptó ese costo en lugar de la alternativa: un componente de cliente con `scrollTo`
sería el tercer componente de cliente, agregaría JavaScript para algo que el navegador hace
nativo, y —lo decisivo— **dejaría de funcionar antes de la hidratación y con JavaScript
deshabilitado**.

---

## Nunca promover una vista previa a producción

Esta es una consecuencia permanente de que la CSP dependa del entorno, y conviene tenerla
presente antes de tocar el panel de Vercel.

Los orígenes de la barra de Vercel se agregan a la cabecera cuando `VERCEL_ENV` vale
`preview`. Eso se decide **durante el build**, y queda horneado en el resultado.

La documentación de Vercel es explícita sobre la promoción: *"esta acción **no reconstruye**
el despliegue"*. Promover una vista previa publica los archivos ya compilados —los de
`preview`—, así que producción quedaría autorizando `vercel.live`, `vercel.com`,
`assets.vercel.com` y `wss://ws-us3.pusher.com`.

**El fallo sería invisible:** el sitio se vería y funcionaría igual, con la política de
seguridad floja y sin ningún error en ningún lado.

Si un merge a `main` no dispara el despliegue —pasó una vez, con el commit ausente por
completo del panel de Vercel—, la salida correcta **no** es promover la vista previa del PR,
aunque tenga exactamente el mismo código. Hay que forzar una construcción nueva de `main`
con variables de producción: en **Settings → Git → Deploy Hooks**, crear un hook apuntando a
`main` y ejecutarlo.

Después de cualquier despliegue fuera de lo habitual, verificar que la CSP de producción
**no** contenga esos cuatro orígenes.

---

## Dependencias

El proyecto agrega dos paquetes al andamiaje de `create-next-app`:

| Paquete | Para qué | Peso en el navegador |
|---|---|---|
| `zod` | Validar contenido y variables de entorno durante el build | 0 KB — solo servidor |
| `server-only` | Hacer que importar un módulo de servidor desde el cliente falle en el build | 0 KB |

**Descartadas a propósito:** ninguna librería de animación (la traza se resuelve con CSS y
`requestAnimationFrame`; `framer-motion` pesaría más que todo el resto del sitio),
ninguna librería de iconos (los veinte logos del stack son trazos SVG en línea y
monocromos, heredando el color del texto, para no meter veinte colores de marca ajenos en
una paleta de siete medidos), y `shadcn/ui` (para un portfolio, la homogeneidad de una
librería de componentes juega en contra de tener identidad propia).

`public/` no contiene ningún archivo decorativo. Los cinco SVG que trae
`create-next-app` se eliminaron: nada del código los referenciaba.

---

## Aserciones de tipo

Hay **una sola** en todo el proyecto, en
[`theme-script.ts`](../src/lib/theme-script.ts):

```ts
return JSON.stringify(value).replace(/</g, "\\u003c") as ScriptLiteral;
```

Es el patrón conocido como *branded type*: `ScriptLiteral` lleva una marca que solo existe
en el sistema de tipos, y la única forma de colocarla es afirmándola. Está contenida en la
única función autorizada a crear ese tipo, y su efecto es que el compilador rechace
cualquier interpolación sin serializar dentro del script de arranque. El razonamiento
completo está en [`sistema-de-diseno.md`](./sistema-de-diseno.md#sobre-la-aserción-de-tipo).
