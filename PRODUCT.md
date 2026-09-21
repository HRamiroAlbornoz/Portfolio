# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos audiencias distintas que entran por la misma primera pantalla.

**Reclutador sin perfil técnico, filtrando candidatos.** Escanea en segundos. Necesita
confirmar quién es la persona, qué hace, si está disponible y dónde está el CV. No abre
repositorios ni lee código. Si no obtiene esas cuatro respuestas de inmediato, se va.

**Desarrollador o líder técnico evaluando competencia.** Abre los repositorios, inspecciona
cómo está construido el propio sitio y nota si el HTML es semántico y si los estados de foco
existen. Para esta audiencia, el sitio es parte de la evaluación técnica.

Ninguna de las dos tiene prioridad sobre la otra: las dos llegan al mismo primer viewport.

## Product Purpose

Portfolio personal de Hernán Ramiro Albornoz, desarrollador Full Stack egresado del bootcamp
Henry, en busca de su primer empleo.

Cumple dos funciones a la vez: **respalda postulaciones ya iniciadas** —alguien vio el CV y
entra a verificar— y **es la evidencia de trabajo de frontend**, porque ninguno de los
proyectos cargados hoy lo es.

Hay éxito cuando un evaluador pasa de mirar el sitio a iniciar una conversación.

## Positioning

Dos cosas que otro portfolio de egresado de bootcamp no podría afirmar honestamente:

1. **Un servidor MCP propio.** AutomateHub expone la API de GitHub como herramientas para
   asistentes de IA: trece herramientas, wrappers componibles y cien tests que no dependen de
   la API real. Es un terreno donde la mayoría de sus pares no puede acompañarlo.
2. **El sitio resiste que lo abran por dentro.** Contrastes medidos contra WCAG, cero
   librerías de animación, dos idiomas con layouts raíz separados, integración continua que
   bloquea el merge, y contenido validado con Zod durante el build.

Las dos son **comprobables**, no declarativas: alguien puede abrir el repositorio y verificar.

**Descartado explícitamente como posicionamiento:** "una forma de trabajar" —entender el
problema antes de escribir código, mantenerlo simple, dejarlo probado—. Es cierto y es
valioso, pero cualquiera puede afirmarlo y nadie puede verificarlo, así que no distingue.

## Operating Context

**Tres mercados en simultáneo:** remoto internacional en inglés, remoto en LatAm o Argentina
en español, y Tucumán presencial o híbrido.

El sitio sirve español en `/` e inglés en `/en`. Se llega desde LinkedIn, desde los dos CV en
PDF, o por un enlace compartido directamente.

**Hecho de producto sin resolver:** la línea de disponibilidad dice "Disponible para trabajar
en remoto", lo que excluye el tercer mercado. La contradicción está identificada y todavía no
corregida.

## Capabilities and Constraints

- Sitio estático de una sola página. Sin backend, sin sesión, sin formularios, sin datos de
  usuario.
- El contenido está separado del código y se valida con Zod durante el build, que falla si un
  dato no cumple su esquema. No hay suite de tests: ese es su reemplazo.
- Solo dos componentes de cliente. Sin librerías de animación.
- **La lista de proyectos es abierta**: va de cero a N, los proyectos se reemplazan por otros
  y además se suman. Nada puede depender de cuáles son ni de cuántos hay.
- **Sin decidir:** cómo ordenar o destacar proyectos cuando haya muchos. Hoy el orden es el
  del archivo de datos.

## Brand Commitments

- Nombre: Hernán Ramiro Albornoz.
- Dirección visual **"Trazado"**, conservada: una traza vertical con nodos que acompaña el
  scroll y hace de navegación, sobre una paleta de siete tokens en tema claro y oscuro.
- Documentación del repositorio y contenido del sitio en español; mensajes de commit en inglés.

## Evidence on Hand

**Material real:**

- Tres proyectos cargados hoy, en `src/content/{es,en}/projects.ts`: NEXOPAY (billetera
  multimoneda, rol de backend, equipo de tres), AutomateHub (servidor MCP, individual) y
  MateCode (tablero kanban, individual).
- Dos CV en PDF, en `public/cv/`, en español e inglés.
- Repositorios públicos en GitHub y perfil de LinkedIn.
- Inglés B1 acreditado por EFSET.
- El código fuente del propio sitio, enlazado desde el pie de página. Es el mecanismo por el
  cual el segundo posicionamiento se vuelve verificable.

**Ausencias que el trabajo futuro no debe inventar:**

- Sin experiencia profesional previa. El bootcamp y los proyectos son toda la trayectoria.
- Sin testimonios, clientes, métricas de uso, casos de estudio ni menciones de prensa.
- Sin ninguna imagen en el sitio: no hay un solo archivo gráfico en el repositorio.
- El deploy de MateCode responde 404, y su repositorio todavía lo anuncia como homepage.

## Product Principles

1. **Todo lo que el sitio afirme tiene que poder comprobarse.** El posicionamiento es técnico
   y verificable; lo declarativo no distingue a nadie.
2. **Las dos audiencias entran por la misma pantalla.** Nada que sirva a una puede costarle a
   la otra, y la que escanea en segundos es la más fácil de perder de vista.
3. **El sitio es una pieza del portafolio, no su envase.** Se lo juzga como se juzga un
   proyecto.
4. **Sumar un proyecto es editar un archivo de datos**, nunca tocar un componente. La lista
   rota y crece.
5. **Nada se afirma sin medir.** Los defectos de este proyecto se vieron siempre bien en el
   código fuente y mal en el resultado.

## Accessibility & Inclusion

- WCAG AA **medido**, no estimado: 4.5:1 en texto, 3:1 en elementos no textuales y estados.
- Área táctil mínima de 44 × 44 en todo elemento interactivo.
- `prefers-reduced-motion: reduce` apaga todo el movimiento, y el contenido queda completo.
- `lang` correcto en cada idioma, que es lo que hace que un lector de pantalla pronuncie el
  inglés como inglés.
- El sitio funciona sin JavaScript; lo único que se pierde es el selector de tema, que cae a
  `prefers-color-scheme`.
