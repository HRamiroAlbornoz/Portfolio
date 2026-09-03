# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

Portfolio personal de una sola página, estático, en dos idiomas: español en `/` e inglés en
`/en`. La documentación del repositorio está en español; los commits, en inglés e imperativo.

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
- **Dos aserciones de tipo** en todo el proyecto: la marca `ScriptLiteral` en
  `src/lib/theme-script.ts` y el ensanchamiento de `THEME_PREFERENCES` a `readonly string[]`
  en `src/lib/theme.ts`, que es lo que permite comparar un `unknown` contra la lista. No agregar
  otras.
- `main` está protegida: todo entra por Pull Request con el check `verify` en verde.

## Arquitectura

### El contenido está separado del código, y hay uno por idioma

`src/content/es/` y `src/content/en/` tienen los mismos seis archivos, y ni uno tiene una
línea de JSX. Cada archivo llama a `.parse()` de su esquema al cargarse, más
`satisfies z.input<typeof esquema>` para que TypeScript también valide mientras se escribe.
**Los esquemas no se duplican:** los mismos de `src/lib/schemas.ts` validan las dos carpetas.

`src/content/index.ts` es la única puerta: importa los doce archivos —lo que garantiza que
todo `.parse()` corra— y expone `getContent(locale)`. Importa `server-only`, así que si un
componente de cliente lo importara, el build falla en vez de mandar Zod al navegador.

Ahí mismo hay una validación cruzada entre idiomas: los `id` de sección, los `id` de capa del
stack y los `slug` de proyecto tienen que coincidir. Zod valida cada idioma por separado y no
vería la divergencia; esto sí. **Ningún componente importa contenido**: lo reciben por props.

`sections.ts` sigue siendo la única fuente de verdad de qué secciones existen y en qué orden.

### Los tokens de diseño viven una sola vez

`src/app/globals.css` es la fuente de verdad. Las dos paletas se declaran completas con los
prefijos `--light-*` y `--dark-*`, y tres bloques —`:root`, `.dark` y el respaldo por
`prefers-color-scheme`— apuntan a una de ellas sin repetir valores.

**Excepción, y hay que mantenerla sincronizada a mano:** `src/lib/preview-image.tsx`
repite cuatro valores de la paleta oscura como constantes de TypeScript, porque lo dibuja
Satori, que no ejecuta CSS. Si cambia un color del tema oscuro, hay que cambiarlo ahí
también.

**Y una segunda trampa, que con dos idiomas es peor:** Next.js invalida la caché de esa
imagen con un hash **del contenido del archivo de ruta**, no de los datos que dibuja ni del
módulo compartido. Si cambia un texto de `src/content/<idioma>/site.ts` que aparece en la
imagen —o el dibujo en `preview-image.tsx`—, la imagen cambia pero **la URL no**, y las
cachés externas siguen sirviendo la vieja.

Los archivos de ruta son **dos**: `src/app/(es)/opengraph-image.tsx` y
`src/app/(en)/en/opengraph-image.tsx`. Al tocar el dibujo o el contenido que sale ahí, hay
que tocar **los dos**.

**Y los tamaños de letra de esa imagen se verifican a 540 px de ancho, no a 1200**: es el
tamaño al que la muestra LinkedIn.

### La frontera servidor/cliente es un error de compilación

- `src/lib/theme.ts` — constantes compartidas, lo único que puede cruzar al cliente.
- `src/lib/theme-script.ts` — importa `server-only`; incluye `themeInitScript` y el tipo
  marcado `ScriptLiteral`, que hace que interpolar algo sin serializar no compile.

`react/no-danger` está en `error` con una única excepción,
`src/components/layout/ThemeScript.tsx`. Ese archivo existe **solo** para contener esa
excepción: son cinco líneas, y los dos layouts raíz más el 404 lo importan en vez de repetir
el `dangerouslySetInnerHTML`. Ampliar la excepción elimina la protección contra XSS del
proyecto: la CSP permite `'unsafe-inline'` y no cubriría el hueco.

Hay una **segunda** excepción de lint: `@next/next/no-html-link-for-pages` está desactivada
para `src/components/layout/HomeLink.tsx`, donde el logo necesita ser un `<a>` común
—`<Link>` no vuelve a desplazar cuando la URL ya coincide con el destino—.

Ese archivo existe **solo** para acotar la excepción: contiene esa única ancla, así que
`SiteHeader` conserva la regla activa. No mover el ancla de vuelta a la cabecera, y no
agregar nada más a `HomeLink.tsx`. Son las **únicas dos** excepciones del proyecto; una
tercera es una decisión de proyecto, no un atajo.

**Solo dos componentes son de cliente:** `TraceRail` y `ThemeToggle`. Mantenerlo así.

### Dos idiomas, dos layouts raíz

El español vive en `/` y el inglés en `/en`, cada uno con su propio layout raíz dentro de un
grupo de rutas: `src/app/(es)/` y `src/app/(en)/`. Es la única forma de que `<html lang>` sea
correcto en cada idioma, porque un layout anidado no puede cambiarlo.

La consecuencia: **con dos layouts raíz no hay ninguno desde el cual componer el 404 global**.
Por eso existe `src/app/global-not-found.tsx` y la bandera `experimental.globalNotFound` en
`next.config.ts`. Sin ella, una URL inventada cae en la pantalla genérica de Next.

`src/app/_site-document.tsx` es el documento entero —`<html>`, `<head>`, `<body>`, cabecera y
pie— y lo usan los dos layouts y el 404. Vive dentro de `src/app/` a propósito: la regla de
lint `@next/next/no-head-element` marca `<head>` fuera de ahí.

Los textos de los proyectos siguen en español también en `/en`, a la espera de que se
reemplacen por los proyectos rehechos.

### Metadatos

Next.js fusiona los metadatos de forma **superficial**: un objeto anidado definido en una
página —`openGraph`, `twitter`, `robots`— reemplaza entero al del layout. Por eso `openGraph`
y `twitter` van completos en cada layout raíz, y no se reparten.

`rootMetadata(locale)` y `homeMetadata(locale)` viven en `src/lib/metadata.ts` para que esa
trampa se resuelva una vez y no por idioma.

`alternates` se declara **solo en las páginas**, nunca en los layouts: en el layout, la 404
heredaba una canónica apuntando a la portada mientras se servía con `noindex`.

`src/lib/preview-image.tsx` solo admite flexbox y necesita `display` explícito en todo
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
