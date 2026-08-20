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

En la sección Proyectos la traza se vuelve punteada y el nodo queda hueco. El portfolio
arranca sin proyectos publicados y el diseño lo declara en vez de disimularlo.

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
`--dark-*`. Cada valor hexadecimal aparece **una sola vez en todo el proyecto**. Los
siete tokens que usa el sitio (`--ink`, `--fore`, …) no contienen valores: apuntan a una
de las dos paletas según el tema activo. Eso importa porque hay tres bloques que hacen
ese apuntado —`:root`, `.dark` y el respaldo por consulta de medios— y si cada uno
repitiera los valores, tarde o temprano se desincronizarían.

`@theme inline` traduce esos siete tokens a los nombres que entiende Tailwind.

| Token | Claro | Oscuro | Para qué |
|---|---|---|---|
| `ink` | `#f7f8f9` | `#0f1216` | Fondo de la página |
| `surface` | `#ffffff` | `#171b21` | Superficies elevadas |
| `line` | `#d3d9e0` | `#2b3138` | Hairlines, bordes, traza inactiva |
| `muted` | `#5a6673` | `#98a2ae` | Texto secundario |
| `fore` | `#0f1216` | `#e9edf2` | Texto principal |
| `trace` | `#0c6a55` | `#6ee7c8` | Traza activa, nodos, enlaces, foco |
| `pending` | `#8a6d0b` | `#c9a227` | **Solo** el estado "sin desplegar" |

El acento cambia de familia entre temas —menta clara sobre fondo oscuro, verde-azulado
profundo sobre fondo claro— porque un mismo valor no puede tener contraste suficiente
contra dos fondos opuestos.

### Contrastes medidos

Calculados con la fórmula de luminancia relativa de WCAG 2.1, no estimados a ojo.

**Tema oscuro**

| Combinación | Ratio | Nivel |
|---|---|---|
| `fore` sobre `ink` | 15.97 | AAA |
| `trace` sobre `ink` | 12.45 | AAA |
| `pending` sobre `ink` | 7.76 | AAA |
| `muted` sobre `ink` | 7.26 | AAA |
| `fore` sobre `surface` | 14.70 | AAA |
| `muted` sobre `surface` | 6.68 | AA |
| `line` sobre `ink` | 1.43 | decorativo |

**Tema claro**

| Combinación | Ratio | Nivel |
|---|---|---|
| `fore` sobre `surface` | 18.78 | AAA |
| `fore` sobre `ink` | 17.66 | AAA |
| `trace` sobre `ink` | 6.16 | AA |
| `muted` sobre `surface` | 5.86 | AA |
| `muted` sobre `ink` | 5.51 | AA |
| `pending` sobre `ink` | 4.62 | AA |
| `line` sobre `ink` | 1.34 | decorativo |

`line` no alcanza ningún nivel a propósito: son separadores decorativos que no
transmiten información, y WCAG no exige contraste para ese caso. La traza usa `line`
solo en su tramo inactivo; los nodos, que sí son interactivos, usan `trace` o `muted`.

### El acento que hubo que corregir

El valor original del acento claro era `#0f8f73`. Medido dio **3.80**, por debajo del
4.5 que WCAG exige para texto normal. Se probó una escala de versiones más oscuras:
`#0e8168` daba 4.53, apenas por encima del límite y sin margen. Se eligió `#0c6a55`
(6.16) por tener holgura real sin perder la identidad verde-azulada.

El error no lo detectó la revisión visual sino la medición. Cualquier color nuevo se
mide antes de entrar.

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
desde [`src/app/layout.tsx`](../src/app/layout.tsx). Corre **durante el análisis del
HTML**, antes del primer pintado.

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
únicamente a `src/app/layout.tsx`. La excepción vive en la configuración y no como un
comentario en el código, para que sea visible y revisable en un solo lugar.

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

Cuatro tamaños con nombre. Cada uno arrastra su propio interlineado, espaciado y peso,
así que es imposible usar un tamaño y equivocarse en el resto.

| Clase | Tamaño | Interlineado | Espaciado | Peso |
|---|---|---|---|---|
| `text-display` | `clamp(3rem, 12vw, 8.5rem)` | 0.92 | -0.035em | 700 |
| `text-title` | `clamp(1.75rem, 4vw, 2.75rem)` | 1.15 | -0.02em | 600 |
| `text-body` | `1.0625rem` | 1.7 | — | — |
| `text-eyebrow` | `0.75rem` | 1 | 0.18em | 500 |

`clamp(mínimo, preferido, máximo)` produce tipografía fluida sin una sola consulta de
medios: el tamaño crece con el ancho de la ventana pero nunca sale de sus límites.

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
- Ningún componente escribe un tamaño de letra arbitrario. Se usan los cuatro nombres de
  la escala.
- `pending` es exclusivo del estado "sin desplegar". Si aparece en otro lado, pierde su
  significado.
- Todo color nuevo se mide antes de entrar al sistema.
- El foco de teclado nunca se desactiva. `:focus-visible` está definido globalmente en
  `globals.css` y solo aparece para quien navega con teclado.
