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

Se descartó organizar por features (una carpeta por sección con todo adentro): la mayoría
quedaría con uno o dos archivos y el contenido disperso en seis lugares.

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

La traza está en [`page.tsx`](../src/app/page.tsx), junto a las secciones que navega. El
encabezado y el pie sí están en el layout.

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

## Dependencias

El proyecto agrega dos paquetes al andamiaje de `create-next-app`:

| Paquete | Para qué | Peso en el navegador |
|---|---|---|
| `zod` | Validar contenido y variables de entorno durante el build | 0 KB — solo servidor |
| `server-only` | Hacer que importar un módulo de servidor desde el cliente falle en el build | 0 KB |

**Descartadas a propósito:** ninguna librería de animación (la traza se resuelve con CSS y
`requestAnimationFrame`; `framer-motion` pesaría más que todo el resto del sitio),
ninguna librería de iconos (los que se sumen van como SVG en línea y monocromos,
heredando el color del texto, para no meter veinticinco colores de marca ajenos en una
paleta de siete medidos), y `shadcn/ui` (para un portfolio, la homogeneidad de una
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
