# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

Portfolio personal de una sola página, estático, en español. Documentación y contenido en
español; commits en inglés e imperativo.

## Comandos

| Comando | Notas |
|---|---|
| `npm run dev` | Requiere `.env.local` con `NEXT_PUBLIC_SITE_URL=http://localhost:3000` |
| `npm run build` | Acá corren las validaciones de Zod y se genera la imagen de previsualización |
| `npm start` | Requiere un `build` previo |
| `npm run lint` | |
| `npm run typecheck` | `next typegen && tsc --noEmit` |

**No hay suite de tests.** Lo que cumple ese rol son las validaciones de Zod, que corren
durante el build y lo detienen si un dato de `src/content/` no cumple su esquema.

`typecheck` genera los tipos antes de chequear porque Next.js crea definiciones a partir de
las rutas —como `LayoutProps`— que no existen en un repositorio recién clonado. Sin
`next typegen`, `tsc` falla con `TS2304: Cannot find name 'LayoutProps'`.

**No verificar contra el servidor de desarrollo.** Sirve CSS y HTML de compilaciones
anteriores y ha producido falsos negativos repetidos en este proyecto. Verificar siempre con
`npm run build` seguido de `npm start`.

## Reglas del proyecto

- **Cero comentarios en el código.** Ni en `src/`, ni en configs. Los nombres hacen el
  trabajo; todo porqué no evidente va a `docs/`. Es la regla que más fácil se rompe.
- **Nunca `any`.** Todo dato externo se valida con Zod, y los tipos se derivan con
  `z.infer`, nunca se declaran aparte.
- **Una sola aserción de tipo** en todo el proyecto, en `src/lib/theme-script.ts`. No agregar
  otras.
- `main` está protegida: todo entra por Pull Request con el check `verify` en verde.

## Arquitectura

### El contenido está separado del código

`src/content/` no tiene una sola línea de JSX. Cada archivo llama a `.parse()` de su esquema
al cargarse, más `satisfies z.input<typeof esquema>` para que TypeScript también valide
mientras se escribe.

**Trampa:** `.parse()` solo corre si alguien importa el módulo. Tres archivos de contenido
estuvieron sin importar y su validación nunca se ejecutó. Todo contenido nuevo tiene que
quedar alcanzable desde `src/app/page.tsx`.

`src/content/sections.ts` es la única fuente de verdad de qué secciones existen y en qué
orden: la traza, la navegación y `page.tsx` leen de ahí.

### Los tokens de diseño viven una sola vez

`src/app/globals.css` es la fuente de verdad. Las dos paletas se declaran completas con los
prefijos `--light-*` y `--dark-*`, y tres bloques —`:root`, `.dark` y el respaldo por
`prefers-color-scheme`— apuntan a una de ellas sin repetir valores.

**Excepción, y hay que mantenerla sincronizada a mano:** `src/app/opengraph-image.tsx`
repite cinco valores de la paleta oscura como constantes de TypeScript, porque lo dibuja
Satori, que no ejecuta CSS. Si cambia un color del tema oscuro, hay que cambiarlo ahí
también.

### La frontera servidor/cliente es un error de compilación

- `src/lib/theme.ts` — constantes compartidas, lo único que puede cruzar al cliente.
- `src/lib/theme-script.ts` — importa `server-only`; incluye `themeInitScript` y el tipo
  marcado `ScriptLiteral`, que hace que interpolar algo sin serializar no compile.

`react/no-danger` está en `error` con una única excepción, `src/app/layout.tsx`. Ampliar esa
excepción elimina la protección contra XSS del proyecto: la CSP permite `'unsafe-inline'` y
no cubriría el hueco.

**Solo dos componentes son de cliente:** `TraceRail` y `ThemeToggle`. Mantenerlo así.

### Metadatos

Next.js fusiona los metadatos de forma **superficial**: un objeto anidado definido en una
página —`openGraph`, `twitter`, `robots`— reemplaza entero al del layout.

Por eso `alternates.canonical` vive en `page.tsx` y no en el layout: en el layout, la 404
heredaba una canónica apuntando a la portada mientras se servía con `noindex`.

`src/app/opengraph-image.tsx` solo admite flexbox y necesita `display` explícito en todo
elemento con hijos. Las fuentes se leen de `assets/fonts/` en `.woff` (`woff2` no funciona).

### Entorno

`NEXT_PUBLIC_SITE_URL` es la única variable. En desarrollo cae a `localhost:3000`; **en
producción, si falta o está mal escrita, el build falla**. El CI usa un valor deliberadamente
falso porque la URL no afecta a la compilación.

`next.config.ts` envía cuatro cabeceras de seguridad. Los orígenes de la barra de Vercel se
agregan **solo** cuando `VERCEL_ENV` vale `preview`. La comparación es positiva a propósito:
cualquier otro valor cae en la política estricta.

## Antes de dar algo por terminado

Los porqués de todo lo anterior están en `docs/arquitectura.md` y `docs/sistema-de-diseno.md`.
Cualquier decisión no evidente que se tome se documenta ahí, en la fase en que se toma.
