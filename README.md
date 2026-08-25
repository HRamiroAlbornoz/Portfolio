# Portfolio — Hernán Ramiro Albornoz

Portfolio personal de un desarrollador Full Stack con foco en backend. Sitio de una sola
página, en español, sin dependencias de servidor: todo se prerenderiza durante el build y
se sirve como archivos estáticos.

**Sitio en producción:** <https://hernan-albornoz.vercel.app>

---

## Stack

| Herramienta | Versión | Por qué |
|---|---|---|
| [Next.js](https://nextjs.org) (App Router) | 16.3.1 | Prerenderiza el HTML completo en el build. Trae metadatos, mapa del sitio e imagen de previsualización como parte del framework, sin librerías extra |
| [React](https://react.dev) | 19.2.8 | Casi todo el sitio son Server Components: no llegan al navegador. Solo dos componentes son de cliente |
| [TypeScript](https://www.typescriptlang.org) | 5 | `strict` activado, más `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`. Cero `any` en el proyecto |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Los colores, la escala tipográfica y los temas se declaran una vez en `globals.css` y se usan como clases |
| [Zod](https://zod.dev) | 4 | Valida el contenido y las variables de entorno **durante el build**: un dato mal cargado rompe el build, no la página |
| [server-only](https://www.npmjs.com/package/server-only) | 0.0.1 | Convierte en error de compilación importar código de servidor desde el navegador |

**Descartado a propósito:** ninguna librería de animación, ninguna de iconos y ninguna de
componentes. El razonamiento está en
[`docs/arquitectura.md`](./docs/arquitectura.md#dependencias).

---

## Levantarlo en local

Necesitás **Node.js 20.9 o superior** y npm.

```bash
git clone https://github.com/HRamiroAlbornoz/Portfolio.git
cd Portfolio
npm install
cp .env.example .env.local
npm run dev
```

Abrí <http://localhost:3000>.

En `.env.local`, poné:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Variables de entorno

| Variable | Obligatoria | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí en producción | URL pública del sitio, **sin barra al final**. La usan el mapa del sitio, la URL canónica y la previsualización al compartir el enlace |

No hay secretos en este proyecto: es la única variable, y es pública por definición.

En desarrollo, si falta, se asume `http://localhost:3000`. **En producción, si falta o
está mal escrita, el build falla con un mensaje claro** — un enlace roto al compartir no
produce ningún error visible, así que conviene que reviente temprano.

---

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Build de producción. Acá corren las validaciones de Zod y se genera la imagen de previsualización |
| `npm start` | Sirve el build de producción en local (requiere `npm run build` antes) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Genera los tipos de rutas de Next.js y después chequea tipos sin emitir archivos |

Los tres que tienen que pasar antes de un merge son `lint`, `typecheck` y `build`, y no
hace falta acordarse: los corre el CI en cada Pull Request.

`typecheck` genera los tipos antes de chequear porque Next.js crea definiciones a partir
de tus rutas —como `LayoutProps`— que no existen en un repositorio recién clonado. El
detalle está en [`docs/arquitectura.md`](./docs/arquitectura.md#integración-continua).

---

## Estructura

```
Portfolio/
├── assets/fonts/          Fuentes para la imagen de previsualización
├── docs/                  Las decisiones del proyecto y su porqué
├── public/cv/             Los CV en PDF, en español e inglés
└── src/
    ├── app/               Rutas y archivos especiales de Next.js
    │   ├── layout.tsx           Fuentes, metadatos, script de tema
    │   ├── page.tsx             Compone las secciones
    │   ├── globals.css          Tokens de color, tipografía y temas
    │   ├── opengraph-image.tsx  Imagen al compartir el enlace
    │   └── sitemap.ts · robots.ts · not-found.tsx
    ├── components/
    │   ├── layout/        Cabecera, pie, enlace de salto y la traza
    │   ├── sections/      Una por sección de la página
    │   └── ui/            Piezas reutilizables
    ├── content/           Todos los textos y datos. Sin JSX
    └── lib/               Esquemas de Zod, entorno, iconos y tema
```

Está organizado **por tipo de archivo**, no por features. Es una desviación consciente de
la convención habitual, y está justificada en
[`docs/arquitectura.md`](./docs/arquitectura.md#el-contenido-vive-separado-del-código).

La idea de fondo: `src/content/` no tiene ni una línea de JSX. Cambiar un texto, sumar un
proyecto o traducir el sitio al inglés no obliga a tocar un solo componente.

---

## Documentación

El código **no lleva comentarios**. Es una decisión del proyecto: los nombres hacen el
trabajo, y todo porqué no evidente vive acá.

| Documento | Qué contiene |
|---|---|
| [`docs/arquitectura.md`](./docs/arquitectura.md) | Cada decisión con la alternativa que se descartó: Next.js sobre Vite, la frontera servidor/cliente, cómo funciona la traza, los iconos, la imagen de previsualización, y qué datos personales se publican y cuáles no |
| [`docs/sistema-de-diseno.md`](./docs/sistema-de-diseno.md) | Los siete tokens de color con sus contrastes medidos, los tres estados del tema, la escala tipográfica y las reglas de movimiento |
| [`docs/agregar-proyecto.md`](./docs/agregar-proyecto.md) | Guía paso a paso para sumar un proyecto terminado |

---

## Sumar un proyecto

Es editar un archivo de datos, no escribir código:

1. Agregá un objeto a [`src/content/projects.ts`](./src/content/projects.ts).
2. Corré `npm run build`.

Si falta un campo o una URL está mal escrita, **el build falla y dice exactamente qué**.
Hay dos redes de seguridad: TypeScript mientras escribís y Zod al construir. La captura de
pantalla es opcional; la tarjeta se ve completa con o sin ella.

Los pasos con un ejemplo listo para copiar están en
[`docs/agregar-proyecto.md`](./docs/agregar-proyecto.md).

---

## Accesibilidad y rendimiento

Objetivos verificados, no aspiracionales:

- Contrastes **medidos** con la fórmula de WCAG, no estimados a ojo. Todos cumplen AA en
  los dos temas.
- Enlace de salto al contenido, puntos de referencia semánticos y jerarquía de encabezados
  sin saltos.
- Foco de teclado visible en todo elemento interactivo, con área mínima de 44 px.
- El sitio entero se puede recorrer con `Tab`.
- `prefers-reduced-motion` apaga todas las animaciones.
- Tema claro y oscuro automático según el sistema, más un selector manual de tres estados,
  sin parpadeo al recargar.
- Cuatro cabeceras de seguridad en todas las rutas, incluida una Política de Seguridad de
  Contenido. Qué protegen y qué no, en
  [`docs/arquitectura.md`](./docs/arquitectura.md#cabeceras-de-seguridad).

---

## Despliegue

Se despliega en [Vercel](https://vercel.com) desde la rama `main`. Cada Pull Request
genera su propia URL de previsualización.

Lo único que hay que configurar en el panel es `NEXT_PUBLIC_SITE_URL` con la URL final.

---

## Convenciones del repositorio

- **Ramas:** `feature/*` para funcionalidades, `chore/*` para infraestructura. `main` está
  protegida: no se pushea directo, todo entra por Pull Request.
- **CI:** cada Pull Request corre lint, chequeo de tipos y build
  ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)). Si el check `verify` está en
  rojo, no se mergea.
- **Commits:** en inglés, en imperativo (`Add trace rail scroll progress`).
- **Sin comentarios en el código.** Si algo necesita explicación, va a `docs/`.
- **Sin `any`.** Todo dato externo se valida con Zod.
