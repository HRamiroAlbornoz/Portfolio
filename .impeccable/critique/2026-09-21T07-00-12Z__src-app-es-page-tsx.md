---
target: la portada del portfolio
total_score: 23
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 2
target_identity: "file:E:\\Henry\\Job Preparation\\Portfolio\\src\\app\\(es)\\page.tsx"
target_fingerprint: "sha256:d7a04be2462e869cd2fbadf4a393f3aa1972f705406537ffcc4157f66ae4a7b7"
target_path: "E:\\Henry\\Job Preparation\\Portfolio\\src\\app\\(es)\\page.tsx"
timestamp: 2026-09-21T07-00-12Z
slug: src-app-es-page-tsx
---
Method: dual-agent (A: a6d11c31fca13f4f1 · B: ab560385bbb78d72c)

# Critique — línea de base

Base: build de producción en `localhost:3000` y `/en`, inspeccionado a 320, 390, 500, 1280 y
1440 px, en tema claro y oscuro, con estilos computados y contrastes calculados en la página.

## Design Health Score

| # | Heurística | Puntaje | Problema clave |
|---|---|---|---|
| 1 | Visibilidad del estado | 3/4 | Bajo 1024px el riel desaparece sin reemplazo: cero indicación de posición en 4.169px de scroll |
| 2 | Correspondencia con el mundo real | 2/4 | `/en` sirve `lang="en"` con la evidencia en español |
| 3 | Control y libertad | 3/4 | `mailto:` sin fallback de copiado; sin volver-arriba |
| 4 | Consistencia y estándares | 3/4 | El verde tiñe "Disponible para trabajar en remoto", que no es accionable |
| 5 | Prevención de errores | 3/4 | Casi no hay nada que hacer mal — más ausencia de superficie que mérito |
| 6 | Reconocer antes que recordar | 2/4 | Entre 1024 y 1279px la navegación son cinco círculos a 1.30:1 con etiquetas en `opacity: 0` |
| 7 | Flexibilidad y eficiencia | 2/4 | No es n/a: PRODUCT.md define una persona que "escanea en segundos". Un solo camino lineal |
| 8 | Estético y minimalista | 2/4 | La tarjeta de proyecto está a 1.12:1 contra la página: no se lee como tarjeta |
| 9 | Recuperación de errores | 3/4 | El 404 y el estado vacío están bien resueltos |
| 10 | Ayuda y documentación | n/a | Página única sin tarea que completar; la documentación es el repositorio, y está enlazado |
| **Total** | | **23/36** | Banda realista |

Lo que baja el puntaje no es descuido —1, 5 y 9 están sanos— sino juicio de jerarquía: 2, 6,
7 y 8. Eso explica que el detector estático no encuentre nada y que igual se vea frío.

## Veredicto de especificidad

**Genérico: otro producto podría usar esta composición sin cambiarle nada.** Sacando el nombre
y los cinco títulos de sección, no hay una sola decisión de layout que haya que revisar.

La causa: **el concepto vive en el documento, no en la pieza.** DESIGN.md declara "el sitio se
recorre como se recorre la ejecución de un programa", y nada en la pantalla dice eso. La línea
con nodos se lee como timeline o stepper —el vocabulario de un CV cronológico o un checkout—,
no como una traza. Quien no leyó el repositorio no tiene manera de llegar a la idea.

El problema no es que el sitio sea demasiado contenido: es que su contención es genérica. La
contención específica se lee como confianza; la genérica se lee como ausencia.

### Escaneo determinista

| Modo | Resultado |
|---|---|
| Escaneo de archivos (`src`, `public`) | exit 0, cero hallazgos |
| Escaneo de la URL renderizada | exit 2, 10 hallazgos por idioma, en dos viewports |

No se contradicen: las tres reglas que disparan —`all-caps-body`, `tight-leading`,
`wide-tracking`— son de estilo computado, y un escaneo estático de `.tsx` no puede resolverlas.
Los 40 hallazgos convergen en un solo token: `text-eyebrow` (12px, line-height 1.0,
letter-spacing 0.18em, casi siempre en mayúsculas).

### Overlays

No hay. La inyección la bloqueó la CSP del propio sitio: `script-src 'self'` rechazó el script
y `connect-src 'self'` rechazó el fetch. Se descartó deliberadamente copiar un bundle de 2,2 MB
a `public/` para saltarla. La CSP hace lo que tiene que hacer.

## Impresión general

El sistema puede producir una pantalla bien compuesta, y la prueba es que **la 404 está mejor
compuesta que la portada**: mismos siete tokens, misma tipografía, pero un solo trabajo y toda
la pantalla subordinada a él.

La oportunidad más grande no es agregar vida. Es hacer visible sin DESIGN.md la metáfora que
DESIGN.md declara.

## Lo que funciona

1. **El selector de tema.** Tres señales simultáneas para el estado activo —filete, superficie
   y color—, no solo color. Degrada a íconos a 320px con la etiqueta accesible intacta. Sin un
   solo caso roto en ningún ancho, porque la decisión se tomó una vez en el componente base.
2. **El riel a 1280px.** Posición, relleno y progreso cuentan la misma historia sin repetirse.
   El problema no es el riel: es que solo existe así en una fracción de los anchos reales.
3. **La 404.** Un solo trabajo, toda la pantalla subordinada. Prueba de que el limitante no
   son los tokens.

Confirmado por medición: cero desbordamiento horizontal a 320px; todas las áreas táctiles
≥ 44×44 (opciones de tema exactamente 44,0×44,0); `prefers-reduced-motion` neutraliza las
quince transiciones y el scroll suave.

## Problemas prioritarios

### [P0] La estructura del sitio está por debajo del umbral de visibilidad

| Elemento | Claro | Oscuro | Lo que exige DESIGN.md |
|---|---|---|---|
| Tarjeta vs. página | 1.12:1 | 1.16:1 | 3:1 |
| Filete de tarjeta vs. página | 1.30:1 | 1.56:1 | 3:1 |
| Nodo y track del riel | 1.30:1 | 1.56:1 | 3:1 |

Es la causa mecánica y medible de "austero, frío". El sistema tiene un solo escalón de
profundidad y un solo recurso de estructura, y los dos son invisibles. En tema claro la tarjeta
no se lee como contenedor: es texto flotando sobre papel. La única estructura que el ojo
encuentra en 4.169px es la línea de Stack, al 100% de saturación. Ese salto entre estructura
gritona y estructura ausente es lo que se percibe como falta de vida.

Rompe la regla de la medición que el propio DESIGN.md declara. Se midió el texto (5.42, 4.85,
5.37, todos correctos). No se midió la estructura.

**Fix:** en claro, `surface` blanco sobre `ink` no puede dar 3:1 sin romper la paleta. La
salida es invertir el escalón: la tarjeta levemente más oscura que la página, no más clara.
Dos tokens, ningún recurso nuevo, no viola la regla del plano único.
**Suggested command:** `/impeccable colorize`

### [P0] `/en` sirve `lang="en"` con la evidencia en español

Con `lang="en"` correcto, un lector de pantalla pronuncia el español con fonemas ingleses: el
compromiso de accesibilidad declarado produce el resultado opuesto exactamente ahí. Y es lo
primero que nota un evaluador anglófono que "abre el sitio por dentro", contra el
posicionamiento #2.

**Fix inmediato, de una línea:** envolver los bloques en español en `<p lang="es">`. Saca el
defecto del terreno de accesibilidad sin esperar la traducción.
**Suggested command:** `/impeccable harden`

### [P1] El final del recorrido no tiene arquitectura

Contacto es un `h2`, un `mailto:` y dos etiquetas de 12px, seguidos de ~350px de vacío hasta el
pie. Es el momento peak-end y el único que define el éxito según PRODUCT.md. No hay frase, ni
reafirmación, ni repetición del CV, ni zona horaria para los tres mercados declarados, ni forma
de copiar el mail. "GITHUB" y "LINKEDIN" a 12px son visualmente idénticos a los tags de
tecnología: se leen como metadata, no como acciones.
**Suggested command:** `/impeccable layout`

### [P1] La composición contradice el posicionamiento, en cuatro lugares

1. Stack va antes que Proyectos: 578px de lista de 24 herramientas delante de la evidencia.
2. AutomateHub, el diferenciador #1, es la tarjeta del medio, la más corta, sin demo,
   etiquetada "DESARROLLO INDIVIDUAL · PROYECTO PERSONAL".
3. El posicionamiento #2 es un link de pie de 12px, igual al copyright.
4. La bio cierra con la frase que PRODUCT.md descarta explícitamente ("una forma de trabajar"),
   en la posición de prosa más prominente de la página.
**Suggested command:** `/impeccable layout`

### [P2] Un solo token genera los 40 hallazgos del detector

`text-eyebrow` con line-height 1.0 a 12px: a 320px, seis bloques envuelven en dos y tres líneas
con interlineado 1.0. La línea de ubicación ocupa 3 líneas de 36px de alto. El interlineado
está calibrado para una etiqueta de una línea y se usa para frases de 69 caracteres.
**Suggested command:** `/impeccable typeset`

### [P2] El verde miente, y el header deja pasar el texto

"Disponible para trabajar en remoto" está en `text-trace` y no es accionable. Después de ver
verde en algo que no se puede clickear, el visitante deja de leer el verde como señal. Y el
header a `bg-ink/85` deja ver el texto del cuerpo detrás del wordmark al scrollear.
**Suggested command:** `/impeccable polish`

## Banderas rojas por persona

**Reclutadora, 8 segundos, en el teléfono.** Ve nombre, rol, tagline, ubicación y los CV al
borde del fold. Ninguna señal de que exista algo más abajo: sin riel, sin cue de scroll. La
respuesta a "¿está disponible?" es una línea de 12px en mayúsculas que envuelve en dos
renglones, en verde, que parece link y no lo es. El cluster interactivo más grande de su
pantalla es el selector de tema (~45% del ancho del header). Si vuelve en tres días a buscar el
CV, hace scroll desde cero.

**Tech lead con devtools abierto.** El servidor MCP está en la tarjeta del medio como "proyecto
personal". Si mide contrastes —y esta persona los mide— encuentra la tarjeta a 1.12:1 en un
sitio cuyo repositorio declara que los midió todos.

**Visitante con baja visión.** No ve las tarjetas (1.12:1). No ve el riel (1.30:1). Entre 1024
y 1279px la navegación son cinco círculos invisibles con etiquetas en `opacity: 0`.

## Observaciones menores

- Los cinco `h2` son 44px idénticos. El sistema tiene cinco pasos tipográficos y usa dos en
  todo el cuerpo: la escala existe pero no se ejerce.
- El círculo hueco junto a "SQL" y "APIs REST" se lee como checkbox sin tildar.
- Tres significados sobre dos círculos: la regla de los dos círculos se cumple en cantidad pero
  no en semántica.
- Los íconos de 16px monocromos son manchas; suman ruido sin sumar reconocimiento.
- La 404 usa "acá", regional, contra la regla de español neutro del repositorio.

**Falso positivo corregido:** la evaluación B marcó el uso de `xl:` como violación de
CLAUDE.md. No lo es: esa recomendación está en el flujo global, no en el proyecto, y DESIGN.md
documenta que los tres cortes (sm, lg, xl) son deliberados.

## Preguntas para pensar

1. Si la traza es una traza de ejecución, ¿por qué no se ve una sola línea de código? La
   metáfora está subutilizada, no sobreutilizada.
2. ¿Qué se pierde si se elimina la sección Stack? Las tecnologías ya están en cada tarjeta,
   donde además están demostradas.
3. El sitio pide que lo abran por dentro. ¿Por qué no se abre solo? Mostrar sus propios
   números sería el único portfolio de la pila que se audita en público, sin una sola imagen.
4. "Cero imágenes" no es lo mismo que "sin figura/fondo". Un bloque de código, un diagrama de
   AutomateHub, la salida de una corrida de tests: todo es tipografía y entra en siete tokens.
5. ¿Por qué la 404 está mejor compuesta que la portada?
