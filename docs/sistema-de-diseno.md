# Sistema de diseño

Este documento explica el porqué de cada decisión visual del portfolio. El código no
lleva comentarios: la intención se registra acá.

Todo el sistema vive en un solo archivo, [`src/app/globals.css`](../src/app/globals.css).
Ningún componente del proyecto escribe un color hexadecimal ni un tamaño de letra
arbitrario.

---

## Dirección visual: "Trazado"

La página es el recorrido de una petición a través de una aplicación. Una traza vertical
fina acompaña todo el scroll y cada sección es un nodo de esa traza.

La metáfora se cobra **solo donde es cierta**: en la sección Stack, donde la traza se
ramifica en las capas reales (Interfaz, Lógica, Datos, Herramientas). En el resto del
sitio la traza es un hilo de navegación silencioso.

La sección Proyectos contempla dos estados. Cuando no hay ninguno cargado, la traza se
vuelve punteada y el nodo queda hueco: el diseño declara el vacío en vez de disimularlo.
Cuando hay proyectos, la traza sigue entera y la sección muestra las tarjetas.

El estado vacío se diseñó primero porque el brief original planteaba un portfolio sin
proyectos. Al aparecer tres proyectos reales, el estado dejó de verse pero se conservó en
el código: es lo que permite que agregar o quitar un proyecto sea editar un archivo de
datos, sin tocar un solo componente.

### Qué se descartó y por qué

- **Etiquetar cada sección con un nombre de capa** (`cliente`, `interfaz`, `datos`).
  Decorativo: "Sobre mí" no es una capa de nada. Una estructura debe codificar algo
  verdadero sobre el contenido, no adornarlo.
- **Numeración `01 / 02 / 03`**. Solo tiene sentido cuando el contenido es realmente una
  secuencia. Las secciones de un portfolio no lo son.
- **Contadores en milisegundos y barras de actividad**. Estética de panel de rendimiento
  que no mide nada real.
- **Glows y degradados de acento.** El presupuesto de audacia se gasta en la traza.

---

## Color

Siete tokens, dos temas.

Las dos paletas se declaran completas en `:root`, con los prefijos `--light-*` y
`--dark-*`. Dentro del CSS, cada valor hexadecimal aparece **una sola vez**. Los
siete tokens que usa el sitio (`--ink`, `--fore`, …) no contienen valores: apuntan a una
de las dos paletas según el tema activo. Eso importa porque hay tres bloques que hacen
ese apuntado —`:root`, `.dark` y el respaldo por consulta de medios— y si cada uno
repitiera los valores, tarde o temprano se desincronizarían.

`@theme inline` traduce esos siete tokens a los nombres que entiende Tailwind.

| Token | Claro | Oscuro | Para qué |
|---|---|---|---|
| `ink` | `#f6f2ec` | `#14120f` | Fondo de la página |
| `surface` | `#ffffff` | `#24201c` | Tarjetas de proyecto |
| `line` | `#ddd5ca` | `#3a3630` | Hairlines, bordes, traza inactiva |
| `muted` | `#6b6157` | `#a39c92` | Texto secundario |
| `fore` | `#14120f` | `#f2efea` | Texto principal |
| `trace` | `#007c00` | `#9fc27c` | Traza activa, nodos, enlaces, foco |
| `pending` | `#836709` | `#d4a541` | Metadatos de proyecto |

El acento cambia de familia entre temas —menta clara sobre fondo oscuro, verde-azulado
profundo sobre fondo claro— porque un mismo valor no puede tener contraste suficiente
contra dos fondos opuestos.

> **Hay una excepción, y está fuera del CSS.** La imagen de previsualización
> ([`preview-image.tsx`](../src/lib/preview-image.tsx)) repite cuatro valores de la
> paleta oscura como constantes de TypeScript, porque la dibuja Satori, que no ejecuta
> CSS y no puede leer variables. **Si cambiás un color del tema oscuro, cambialo también
> ahí.** El razonamiento completo está en
> [`arquitectura.md`](./arquitectura.md#la-imagen-de-previsualización).

### Contrastes medidos

Calculados con la fórmula de luminancia relativa de WCAG 2.1, no estimados a ojo.

**Tema oscuro**

| Combinación | Ratio | Nivel |
|---|---|---|
| `fore` sobre `ink` | 16.30 | AAA |
| `fore` sobre `surface` | 14.10 | AAA |
| `trace` sobre `ink` | 9.33 | AAA |
| `pending` sobre `ink` | 8.24 | AAA |
| `trace` sobre `surface` | 8.07 | AAA |
| `pending` sobre `surface` | 7.13 | AAA |
| `muted` sobre `ink` | 6.88 | AA |
| `muted` sobre `surface` | 5.95 | AA |
| `line` sobre `ink` | 1.56 | decorativo |

**Tema claro**

| Combinación | Ratio | Nivel |
|---|---|---|
| `fore` sobre `surface` | 18.70 | AAA |
| `fore` sobre `ink` | 16.77 | AAA |
| `muted` sobre `surface` | 6.05 | AA |
| `muted` sobre `ink` | 5.42 | AA |
| `trace` sobre `surface` | 5.41 | AA |
| `pending` sobre `surface` | 5.37 | AA |
| `trace` sobre `ink` | 4.85 | AA |
| `pending` sobre `ink` | 4.82 | AA |
| `line` sobre `ink` | 1.30 | decorativo |

`line` no alcanza ningún nivel, y desde el rediseño hace falta justificarlo mejor, porque
además de hairlines ahora dibuja **el borde de las tarjetas de proyecto**: pasó de separador
a elemento estructural.

Se sostiene igual. WCAG 1.4.11 exige 3:1 para objetos gráficos **necesarios para entender el
contenido**, y el borde de una tarjeta no lo es: el agrupamiento ya lo comunican la superficie
elevada y el espaciado, y el texto se lee completo y en orden aunque el borde no se perciba.
El borde refuerza, no informa.

Dentro de la traza, `line` dibuja el tramo inactivo del riel y **el borde de los nodos
todavía no alcanzados**, que además llevan `ink` de relleno. El nodo activo pasa a `trace`,
relleno y borde. La etiqueta de cada sección usa `muted`, y la activa `trace`.

### Por qué las etiquetas del riel no llevan opacidad

Al volverlas siempre visibles se probó atenuarlas con `opacity-60`, para que no compitieran
con el contenido. Medido, ese 60 % da **3.24** en oscuro y **2.46** en claro: por debajo del
4.5 que exige AA, y para texto de 12 px.

Se midió toda la escala. Solo la **opacidad plena** pasa en los dos temas: 0.8 pasa en
oscuro y falla en claro; 0.9 también. Es decir, no había un valor intermedio aceptable.

Las etiquetas usan entonces `muted` a opacidad completa (6.88 y 5.42), y la jerarquía la da
el color: `muted` para las secciones no alcanzadas, `trace` para la activa.

Un detalle que hacía inviable confiar en el hover: Tailwind envuelve la variante `hover:` en
`@media (hover: hover)`, así que en una pantalla táctil grande —donde las etiquetas sí se
muestran— no existe estado de hover que pudiera compensar el bajo contraste.

### El acento pasó de menta a verde, y por qué

El acento fue primero una menta fría (`#6ee7c8` en oscuro, `#0f8f73` en claro). Ese primer
valor claro se corrigió antes de existir: medido daba **3.80**, por debajo del 4.5 que WCAG
exige para texto normal. Se probó una escala más oscura —`#0e8168` daba 4.53, sobre el límite
y sin margen— y quedó `#0c6a55`.

Al girar los neutros hacia el cálido, la menta quedó como **lo único frío de una página
cálida**, y se cambió a verde. La sustitución es del token completo, así que también cambian
la línea de la traza, sus nodos, el anillo de foco y el color de selección.

**El límite de esa decisión no es estético sino de contraste**, y conviene tenerlo escrito:
cuanto más cálido el verde, más se acerca al ámbar de `pending`. Son vecinos en el espectro,
y la menta se distinguía tan bien justamente por ser fría. La distancia perceptual contra el
ámbar pasó de **72.2 a 40.2** en oscuro y de **56.5 a 53** en claro. Por debajo de 40 los dos
acentos empiezan a confundirse: un oliva intermedio (`#4f6636`) daba 33.1 y se descartó al
verlo.

### Por qué el verde claro está más saturado que el oscuro

`#007c00` tiene croma **70**; `#9fc27c`, **40**. La asimetría es deliberada y responde a una
restricción física, no a un gusto.

Sobre fondo claro, un acento tiene que ser **oscuro** para alcanzar 4.5, y oscurecer un color
le quita viveza. El tema claro nunca va a tener el brillo del oscuro. La compensación posible
es subir la saturación, y `#007c00` es el máximo: una búsqueda sobre el espacio de color
mostró que ningún verde más saturado cumple AA sobre `#f6f2ec` conservando distancia del
ámbar.

Para dimensionarlo: la menta clara anterior tenía croma **31**, y el oliva descartado, 35.

Se aceptó que un verde puro puede leerse como color de sistema —el del "operación exitosa"—
antes que dejar el tema claro apagado. Fue una decisión de quien mira el sitio, tomada
comparando los tres valores en pantalla, no en una tabla.

### El giro cálido, y de dónde salió el calor

La primera paleta era enteramente fría: tinta azulada más menta. En `#0f1216` el canal azul
era el más alto, y no había ningún valor cálido **en uso**. El resultado se describió como
"austero, frío, le falta vida".

El calor no vino de afuera. Vino de `pending`, un token que existía desde el primer día y
que **casi no se veía**: marcaba el estado "sin desplegar" de la sección Proyectos y el
código de la página 404. Ese ámbar es el color de un estado pendiente en un log, así que
pertenece al vocabulario del sitio en lugar de importarse.

**El token pasó a tener dos usos, y conviene ser explícito al respecto.** Sigue marcando
esos dos estados —el vacío de Proyectos vive en
[`ProjectsSection.tsx`](../src/components/sections/ProjectsSection.tsx) aunque hoy no se vea,
y el `404` en [`global-not-found.tsx`](../src/app/global-not-found.tsx)— y ahora además marca los metadatos
de proyectos y formación.

Lo que unifica los tres usos es que ninguno es contenido principal: son **señales de segundo
orden** que acompañan al texto sin competir con él. Si algún día uno de esos usos necesita
un color propio, el token se parte en dos; hoy la distinción no gana nada.

Se descartó agregar un cálido ajeno —terracota, arena— justamente por eso: habría sido un
color sin relación con el tema del sitio.

Los neutros giraron de azul a cálido: en `#14120f` el canal rojo pasa a ser el más alto. Es
el mismo negro profundo, con temperatura. **La menta se conservó en este paso**, con el
argumento de que un fondo cálido con acento frío contrasta mejor que un esquema todo cálido.
No sobrevivió a la página terminada: ver «El acento pasó de menta a verde», más arriba.

### Por qué `surface` tuvo que alejarse de `ink`

`surface` estaba definido desde el primer día y solo se usaba en un lugar: el fondo del
enlace de salto cuando recibe el foco ([`SkipLink.tsx`](../src/components/layout/SkipLink.tsx)).
Ahí funcionaba porque ese enlace flota sobre el contenido con su propio borde, así que no
dependía de contrastar con el fondo.

Al ir a usarlo para las tarjetas de proyecto, la medición mostró el problema: su separación
de `ink` era de **1.09** en oscuro y **1.06** en claro. Con esa diferencia, una tarjeta es
invisible.

No alcanzaba con empezar a usarlo: había que separarlo. Los valores nuevos dan **1.16** y
**1.12**. Sigue siendo una diferencia sutil —una tarjeta no debe gritar— pero perceptible.

Dentro de una tarjeta, el contenedor de imagen usa `ink`, no `surface`: sobre una superficie
elevada, el hueco de la captura tiene que hundirse, no fundirse.

### El ámbar que hubo que corregir

`#8a6d0b` funcionaba sobre el fondo claro anterior. Sobre el fondo nuevo, más cálido y algo
más oscuro, dio **4.41**: por debajo del 4.5 que exige AA para texto normal. Se oscureció a
`#836709`, que da 4.82.

Es el segundo color de este sistema que la medición corrige antes de llegar a producción. La
regla se sostiene: **ningún color entra sin medirse, y cambiar el fondo obliga a volver a
medir todo lo que se apoya en él.**

### Por qué los logos del stack son monocromos

Cada tecnología de la sección Stack lleva su logo real, dibujado como un path de Simple Icons
en [`icons.ts`](../src/lib/icons.ts) y pintado con `fill-current`, así que toma el color del
texto que acompaña.

Se evaluó pasarlos al color de marca, como hacen muchos portfolios. Se descartó por dos
razones, ninguna estética.

**Cinco de los veinte logos son negros en su color oficial**: Next.js y Vercel y Express
`#000000`, GitHub `#181717`, Railway `#0B0D0E`. Sobre `ink` desaparecen. El resultado no
sería "los logos con su color": serían quince logos con su color y cinco con un color
inventado, que es justamente lo que la opción prometía evitar.

**Y son veinte.** Veinte colores de marca en cuatro capas son veinte acentos compitiendo
contra una paleta de siete valores, y quedarían como lo más fuerte de la página — por encima
del nombre en la portada.

Lo que sí se corrigió fue el tamaño: pasaron de **13 px a 16 px**. A 13 px, junto a un cuerpo
de 17 px, el logo se leía como viñeta y no se llegaba a reconocer. A 16 px se reconoce sin
tocar la paleta ni la disposición.

Las cuatro entradas sin logo —APIs REST, SQL, Supertest, Git Flow— llevan un círculo hueco
del mismo tamaño. Al crecer se nota más, y conviene: el círculo hueco ya significa "todavía
no" en los nodos del riel de la traza.

---

## Temas: tres estados

El botón de tema ofrece **Automático**, **Claro** y **Oscuro**. La preferencia se guarda
en `localStorage` bajo la clave `theme-preference`.

Hay que distinguir dos conceptos que se confunden con facilidad:

- **La preferencia** es lo que eligió la persona: `system`, `light` o `dark`. Vive en
  `localStorage` y se refleja en el atributo `data-theme-preference` del `<html>`.
- **El tema resuelto** es lo que se pinta: claro u oscuro. Se expresa con la clase
  `.dark` en el `<html>` y con el atributo `data-theme-resolved`. Con la preferencia en
  `system`, el tema resuelto surge de consultar `prefers-color-scheme`.

El atributo `data-theme-resolved` cumple una segunda función además de informar: es la
señal de que el script ya corrió. De eso depende el respaldo en CSS que se describe más
abajo.

### Por qué una variante personalizada

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Por defecto, el prefijo `dark:` de Tailwind depende directamente de
`prefers-color-scheme`. Eso vuelve imposible ofrecer un botón: una consulta de medios no
se puede sobrescribir desde JavaScript. Esta línea redirige `dark:` a depender de una
clase, que sí es controlable.

El `:where()` mantiene la especificidad del selector en cero para que la variante no
gane peleas de precedencia que no le corresponden.

Consecuencia: la preferencia del sistema deja de aplicarse sola. Traducirla a la clase
pasa a ser responsabilidad del script de arranque.

### El respaldo en CSS puro

Delegar el tema al script deja un agujero: si JavaScript está deshabilitado o el script
es bloqueado, alguien con el sistema en oscuro recibe la paleta clara. La primera
versión de este sistema tenía ese defecto y lo detectó una revisión de código.

El respaldo:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme-resolved]) {
    color-scheme: dark;
    --ink: var(--dark-ink);
    /* … el resto de la paleta oscura */
  }
}
```

La condición `:not([data-theme-resolved])` es la clave: el bloque aplica **solo mientras
el script no haya corrido**. Apenas el script escribe el atributo, la regla deja de
coincidir y el control vuelve a la clase `.dark`. Como el script vive en el `<head>` y se
ejecuta antes del primer pintado, el traspaso no produce ningún parpadeo.

Alcance del respaldo: cubre las variables de color, que es de donde sale la mayor parte
del estilo del sitio. Las utilidades con prefijo `dark:` de Tailwind siguen dependiendo
de la clase y no se aplican sin JavaScript. Por eso el proyecto estiliza con tokens
(`bg-ink`, `text-fore`) y reserva `dark:` para casos excepcionales.

### Por qué un script bloqueante y no `useEffect`

El script vive en [`src/lib/theme.ts`](../src/lib/theme.ts) y se inyecta en el `<head>`
desde [`ThemeScript.tsx`](../src/components/layout/ThemeScript.tsx), que los dos layouts raíz
y el 404 renderizan dentro de su `<head>`. Corre **durante el análisis del HTML**, antes del
primer pintado.

`useEffect` corre después de la hidratación y del pintado: la persona vería la página en
tema claro por un instante antes de que cambie a oscuro. `useLayoutEffect` corre antes
del pintado pero también después de la hidratación, así que tampoco alcanza. Es la
recomendación explícita de la documentación de Next.js.

Por eso el `<html>` lleva `suppressHydrationWarning`: el script modifica su `class` y su
`data-theme-preference` antes de que React tome el control, y sin ese atributo React
reportaría una discrepancia entre el HTML del servidor y el del navegador.

El script está escrito en JavaScript antiguo (`var`, sin sintaxis moderna) porque se
ejecuta tal cual, sin pasar por ningún compilador.

El `try` envuelve **únicamente** la lectura de `localStorage`, que es lo único capaz de
fallar: el navegador lanza un error si la persona bloqueó los datos del sitio o si la
página corre dentro de un iframe restringido. Una versión anterior envolvía todo el
script, con lo cual un `localStorage` inaccesible abortaba la ejecución antes de llegar a
`matchMedia` y el tema nunca se aplicaba. Un bloque `try` demasiado ancho convierte un
fallo menor en un fallo total.

La lista de valores válidos no está escrita a mano dentro del script: se interpola desde
`themePreferenceSchema.options`, el mismo esquema de Zod que valida la preferencia en el
resto de la aplicación. Un solo lugar define los estados posibles.

### Por qué interpolar en ese script es seguro por construcción

Dentro de una etiqueta `<script>`, el analizador de HTML deja de interpretar HTML con una
sola excepción: sigue buscando la secuencia literal `</script`. Apenas la encuentra cierra
la etiqueta, aunque esté en medio de un texto entre comillas. Un valor que contuviera
`</script><script>…</script>` cerraría el script y ejecutaría lo que viniera después. Las
comillas alrededor de la interpolación no protegen, porque el analizador de HTML actúa
antes que el de JavaScript.

Hoy todas las interpolaciones del script son constantes del propio código, así que no hay
vector de ataque. Pero depender de que nadie interpole nunca un valor dinámico es
depender de la memoria de las personas. El proyecto lo resuelve con cuatro mecanismos:

**Las comillas las genera el serializador, no la plantilla.** `JSON.stringify` produce un
literal de JavaScript completo: agrega las comillas y escapa las que haya adentro, las
barras invertidas y los saltos de línea.

**El carácter `<` se escapa como `\u003c`.** Para JavaScript, `\u003c` *es* `<`: el valor
no cambia en absoluto. Pero el analizador de HTML nunca ve el carácter, así que la
secuencia `</script` no puede formarse.

**El compilador rechaza las interpolaciones crudas.** `toScriptLiteral` devuelve un tipo
marcado, `ScriptLiteral`, y la plantilla `inlineScript` solo acepta valores de ese tipo.
Un `string` común no es asignable, así que interpolar sin serializar **no compila**:

```
error TS2345: Argument of type 'string' is not assignable
              to parameter of type 'ScriptLiteral'
```

Como `npm run typecheck` corre en el CI, ese error bloquea el Pull Request.

**ESLint impide que el patrón se propague.** La regla `react/no-danger` está en `error`
para todo el proyecto, con una excepción declarada en `eslint.config.mjs` acotada
únicamente a `src/components/layout/ThemeScript.tsx`, un archivo de cinco líneas que existe
solo para contenerla. La excepción vive en la configuración y no como un comentario en el
código, para que sea visible y revisable en un solo lugar.

#### Sobre la aserción de tipo

`toScriptLiteral` contiene un `as ScriptLiteral`, y las reglas del proyecto exigen evitar
las aserciones de tipo y justificar las inevitables.

Es inevitable acá: la marca de `ScriptLiteral` es una ficción del sistema de tipos que no
existe en tiempo de ejecución, y la única forma de colocarla es afirmándola. Es **una sola
aserción, dentro de la única función autorizada a crear el tipo marcado**, que es
exactamente el patrón conocido como *branded type*. Fuera de esa función el tipo no se
puede fabricar por accidente.

Límite honesto de la protección: garantiza que el valor **entre** intacto al script, no
que el script haga cosas seguras con él. Si alguna vez se agregara un `eval` o una
asignación a `innerHTML` dentro del script, el problema volvería por otro camino. Eso lo
cubre la revisión de código, no el tipado.

### `color-scheme`

`:root` y `.dark` declaran `color-scheme`. Le indica al navegador con qué tema pintar
**sus propios controles**: barras de desplazamiento, campos de formulario, relleno
automático. Sin esa declaración aparece una barra de scroll blanca sobre una página
oscura.

---

## Tipografía

Tres roles, tres familias. Ninguna es la que trae el andamiaje de Next.js.

| Rol | Familia | Variable CSS | Uso |
|---|---|---|---|
| Display | Archivo | `--stack-display` | El nombre y los titulares grandes |
| Cuerpo | Instrument Sans | `--stack-body` | Todo el texto corrido |
| Utilitaria | JetBrains Mono | `--stack-mono` | Etiquetas de capa, ítems de stack, metadatos |

Instrument Sans es una grotesca humanista, más cálida que Inter. JetBrains Mono es la
voz técnica del sitio y por eso se usa con cuentagotas: si aparece en todos lados deja
de significar nada.

Se descartó el eje de ancho de Archivo. Aumenta el peso del archivo y su efecto a
tamaños grandes es sutil; el peso alto con tracking cerrado ya da el carácter buscado.

Las tres se cargan con `next/font/google`, que las descarga durante el build y las sirve
desde el propio dominio. Cero pedidos a servidores de Google y cero salto visual al
cargar. Costo medido: **102.9 KB precargados**, un archivo por familia. Los demás
archivos generados (itálicas y caracteres extendidos) no se descargan salvo que
aparezcan en el contenido.

### Escala

Cinco tamaños con nombre. Cada uno arrastra su propio interlineado, espaciado y peso,
así que es imposible usar un tamaño y equivocarse en el resto.

| Clase | Tamaño | Interlineado | Espaciado | Peso |
|---|---|---|---|---|
| `text-display` | `clamp(3rem, 12vw, 6.5rem)` | 0.92 | -0.035em | 700 |
| `text-title` | `clamp(1.75rem, 4vw, 2.75rem)` | 1.15 | -0.02em | 600 |
| `text-subtitle` | `clamp(1.375rem, 2.5vw, 1.75rem)` | 1.2 | -0.015em | 600 |
| `text-body` | `1.0625rem` | 1.7 | — | — |
| `text-eyebrow` | `0.75rem` | 1 | 0.18em | 500 |

`text-subtitle` se agregó con el rediseño cálido. Antes, el título de una sección y el
nombre de un proyecto usaban los dos `text-title`: la jerarquía era plana y todo pesaba
igual. El escalón intermedio es lo que separa "Proyectos" de "NexoPay".

`clamp(mínimo, preferido, máximo)` produce tipografía fluida sin una sola consulta de
medios: el tamaño crece con el ancho de la ventana pero nunca sale de sus límites.

### Por qué el máximo de `text-display` es 6.5rem y no 8.5rem

El máximo era `8.5rem` y empujaba la frase de presentación **por debajo del pliegue**. En un
portátil de 1366 × 768, la ventana real deja unos 625 px de alto una vez descontadas las
pestañas y la barra de direcciones; la frase terminaba en el pixel 729. Quien entraba veía un
nombre enorme y tenía que desplazarse para enterarse de qué hace.

Medido en el navegador, cambiando la variable y observando el resultado:

| Máximo | Tamaño | Líneas del nombre | Fin de la frase | ¿Entra en 625 px? |
|---|---|---|---|---|
| `8.5rem` | 136 px | 3 | 729 | no |
| `7rem` | 112 px | 3 | 662 | no |
| **`6.5rem`** | **104 px** | **2** | **545** | **sí** |
| `5.5rem` | 88 px | 2 | 515 | sí |

**Lo que manda no es el tamaño sino el número de líneas.** Bajar de 136 a 112 px ahorra 67 px
y no alcanza, porque el nombre se sigue partiendo en tres. El salto ocurre cuando "Hernán
Ramiro" entra en un renglón, entre 104 y 112 px. Por eso `6.5rem`: es el valor más grande que
consigue dos líneas.

El cambio **no afecta al teléfono**. A 320 px el `12vw` da 38 px y manda el mínimo de `3rem`;
el máximo recién empieza a aplicarse por encima de los 867 px de ancho.

---

## Cabecera

La cabecera mostraba las iniciales **"HRA"**, que no significan nada para quien entra por
primera vez. En un portfolio el nombre es lo que hay que recordar al cerrar la pestaña, así
que pasó a mostrarlo.

### El presupuesto de 272 px

A 320 px la cabecera tiene 272 px útiles, y antes del cambio se repartían así:

| Elemento | Ancho | Porción |
|---|---|---|
| Logo "HRA" | 28 px | 10 % |
| Control de tema | 220 px | **81 %** |

Un control secundario ocupaba cuatro veces más que la identidad. **Por eso poner el nombre y
condensar el control son el mismo cambio y no dos.** Anchos medidos en el navegador con las
fuentes ya cargadas, en JetBrains Mono 12 px con tracking 0.18em:

| Texto | Ancho | Holgura con 3 controles de 44 px |
|---|---|---|
| Hernán Ramiro Albornoz | 224 px | −92 px |
| Hernán Albornoz | 153 px | −21 px |
| **Hernán** | **61 px** | **+71 px** |

De ahí sale la regla: **"Hernán Albornoz" desde 640 px, "Hernán" por debajo**. El nombre
completo ya aparece en la portada y en la imagen de previsualización, así que la cabecera no
necesita repetirlo entero.

Los íconos del control siguen la misma lógica invertida: **solo existen por debajo de 640 px**,
porque resuelven un problema de espacio que en escritorio no ocurre. Arriba de ese ancho hay
lugar para las palabras, y "Claro" es más claro que un sol. Son de trazo y no macizos, a
diferencia de los logos del stack: la traza, el riel y los bordes son líneas finas, y un
ícono de línea pertenece a ese idioma.

El texto de cada opción **nunca sale del DOM**: `sr-only` lo esconde a la vista pero lo deja
en el árbol de accesibilidad, así que el nombre de cada control es el mismo en los dos
anchos aunque en móvil solo se vea un dibujo.

### El espacio que desaparecía

El apellido se agrega con `&nbsp;` y no con un espacio común. La primera versión mostraba
"HernánAlbornoz", todo junto, con el espacio presente en el código fuente.

La causa es que el enlace es un `inline-flex`: en un contenedor flex **cada hijo es un ítem
independiente, y el espacio en blanco al comienzo de un ítem se descarta**. El espacio caía
justo en esa frontera. Un espacio de no separación no es colapsable, así que sobrevive — y
de paso impide que el nombre se parta en dos renglones dentro de una altura fija.

### La opción activa no puede distinguirse solo por color

El control marcaba la opción elegida cambiándole el color a `trace`. Medida la separación de
luminancia contra `muted`, el color resultó ser una pista insuficiente:

| Tema | Activa vs inactiva | Relación de luminancia |
|---|---|---|
| Claro | `#007c00` vs `#6b6157` | **1.12** |
| Oscuro | `#9fc27c` vs `#a39c92` | **1.36** |

Una relación de 1.0 es "misma claridad". Con 1.12, quien no distingue el rojo del verde ve
los tres textos idénticos y no puede saber qué tema está puesto. El problema existía desde
antes, pero al quitar el texto en móvil el color quedaba como **única** pista.

La opción activa lleva ahora **borde `trace` y relleno `surface`**, además del color del
texto. El primer intento fue solo el relleno, y fue insuficiente por la misma razón que el
color: medido contra el fondo de la cabecera da **1.16** en oscuro y **1.12** en claro, el
mismo orden de magnitud que el problema que buscaba resolver.

**WCAG 1.4.11 exige 3:1 para lo que identifica el estado de un control**, y ninguna de las
dos cifras se acerca. El borde sí:

| | Contra el fondo de la cabecera | Contra el relleno del chip |
|---|---|---|
| Oscuro `#9fc27c` | **9.33** | 8.07 |
| Claro `#007c00` | **4.85** | 5.41 |

La lección quedó registrada porque es fácil de repetir: **una pista de forma también hay que
medirla**. Agregar un fondo apenas perceptible da la sensación de haber resuelto el problema
sin haberlo resuelto.

El par borde + relleno además coincide con los otros dos usos de `surface` en el proyecto:
las tarjetas de proyecto lo acompañan con `border-line` y el enlace de salto con
`border-trace`. Ninguna superficie de este sistema flota sin borde.

### Qué se descartó

Un logotipo con corchetes angulares, del estilo `< Nombre / >`. Es el logo más repetido de
los portfolios de desarrollo, pero la objeción de fondo es otra: los corchetes son
vocabulario de **HTML** y la dirección visual del sitio es una **traza** con nodos y estados.
Meter una segunda metáfora en el lugar más visible de la página debilita la primera.

---

## Movimiento

Un solo momento orquestado al cargar la página: la traza baja y el hero aparece en
secuencia. Después, solo el avance de la traza con el scroll y un micro-hover en los
nodos. Sin librería de animación.

Todo se apaga con `prefers-reduced-motion: reduce`.

Las duraciones se anulan a `0.01ms` y no a `0`. Con cero, algunos navegadores nunca
disparan el evento de fin de animación, y cualquier código que espere ese aviso queda
colgado para siempre. Con 0.01 ms el evento se dispara de inmediato.

Se anulan las duraciones **y también los retrasos** (`animation-delay`,
`transition-delay`). Anular solo las duraciones es un error frecuente: la animación pasa
a durar un instante, pero sigue esperando su retraso antes de empezar. En una secuencia
escalonada como la del hero, eso dejaría a quien pidió menos movimiento mirando una
pantalla vacía durante toda la espera — exactamente el problema que la preferencia
buscaba evitar.

---

## Reglas de uso

- Ningún componente escribe un color hexadecimal. Se usan las clases de token
  (`bg-ink`, `text-fore`, `border-line`).
- Ningún componente escribe un tamaño de letra arbitrario. Se usan los cinco nombres de
  la escala.
- `pending` marca señales de segundo orden y nunca contenido principal: los estados "sin
  desplegar" y `404`, y los metadatos de proyectos y formación.
- Todo color nuevo se mide antes de entrar al sistema.
- **Ningún estado se comunica solo con color.** Todo cambio de estado lleva además una
  diferencia de forma —fondo, borde, subrayado— que sobreviva al daltonismo.
- El foco de teclado nunca se desactiva. `:focus-visible` está definido globalmente en
  `globals.css` y solo aparece para quien navega con teclado.
