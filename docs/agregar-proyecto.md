# Cómo agregar un proyecto terminado

Guía para tu vos del futuro. Sumar un proyecto al portfolio es **agregar un objeto a un
archivo**. No hay que tocar ningún componente.

---

## Los tres pasos

### 1. Crear una rama

`main` está protegida: no acepta `git push` directo, ni siquiera del dueño del
repositorio. Todo entra por Pull Request.

```bash
cd "/e/Henry/Job Preparation/Portfolio"
git switch main
git pull
git switch -c feature/proyecto-nombre-corto
```

### 2. Agregar el objeto

Abrí [`src/content/projects.ts`](../src/content/projects.ts) y sumá un objeto al array.
Ejemplo completo, con todos los campos:

```ts
{
  slug: "gestor-de-turnos",
  name: "Gestor de turnos",
  role: "Desarrollo individual · Proyecto personal",
  summary:
    "Aplicación para reservar y administrar turnos, con autenticación por token y panel de administración.",
  year: 2026,
  highlights: [
    "API REST con autenticación por token y control de roles",
    "Notificaciones por email al confirmar y al cancelar un turno",
  ],
  technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL"],
  repositoryUrl: "https://github.com/HRamiroAlbornoz/gestor-de-turnos",
  liveUrl: "https://gestor-de-turnos.vercel.app",
}
```

El orden del array **es el orden en que aparecen en el sitio**. Lo más reciente o lo más
fuerte va primero: quien te está evaluando mira dos o tres y sigue de largo.

### 3. Verificar, commitear y abrir el PR

```bash
npm run typecheck
npm run lint
npm run build
npm run dev
```

Si los cuatro pasan y la sección se ve bien en el navegador:

```bash
git add src/content/projects.ts
git commit -m "Add gestor-de-turnos project"
git push -u origin feature/proyecto-nombre-corto
gh pr create --base main --fill
```

---

## Los campos

| Campo | Obligatorio | Qué es |
|---|---|---|
| `slug` | sí | Identificador corto en minúsculas, números y guiones. Es único: no puede repetirse |
| `name` | sí | El nombre visible del proyecto |
| `role` | sí | Qué hiciste vos y en qué contexto. Por ejemplo: `"Backend Developer · Equipo de 3"` |
| `summary` | sí | Uno o dos renglones: qué resuelve y cómo. Máximo 700 caracteres |
| `year` | sí | Año de finalización, como número (`2026`, no `"2026"`) |
| `highlights` | sí | Hasta 3 logros concretos y medibles. Puede ir vacío: `[]` |
| `technologies` | sí | Entre 1 y 12 tecnologías |
| `repositoryUrl` | no | Enlace al código. Si el repositorio es privado, omitilo |
| `liveUrl` | no | Enlace al proyecto desplegado. Si no está desplegado, omitilo |

**Sobre `role`:** es el campo que más lee un tech lead. "Construí X" no dice nada si no
se sabe si lo hiciste solo, en equipo de cinco, o si tocaste solo una parte. Sé preciso.

**Sobre `highlights`:** poné números y hechos verificables, no adjetivos. "API REST de 20
endpoints con autenticación JWT" comunica; "aplicación robusta y escalable" no comunica
nada, porque lo escribe todo el mundo.

**Antes de publicar un enlace, abrilo.** Un deploy de Vercel puede quedar caído o
borrado, y un enlace muerto en un portfolio es peor que no tener enlace. Se comprueba
desde la terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -L https://tu-proyecto.vercel.app
```

Un `200` está bien. Un `404` significa que el deploy ya no existe: omití `liveUrl` hasta
volver a publicarlo.

**Los campos opcionales se omiten, no se ponen en `undefined`.** El proyecto usa
`exactOptionalPropertyTypes`, que distingue "el campo no está" de "el campo está y vale
`undefined`". Escribir `liveUrl: undefined` es un error de compilación; simplemente no
escribas la línea.

---

## Qué pasa si algo está mal

El array se valida con Zod **durante el build**, no cuando alguien visita el sitio. Un
dato inválido rompe `npm run build` con un mensaje que indica el campo exacto.

| Error | Qué vas a ver |
|---|---|
| Dos proyectos con el mismo `slug` | `Hay dos proyectos con el mismo slug` |
| `slug` con mayúsculas o espacios | `Usá solo minúsculas, números y guiones` |
| URL que no es `http` ni `https` | `Invalid URL` |
| `summary` de más de 700 caracteres | `Too big: expected string to have <=700 characters` |
| `year` escrito como texto | `Invalid input: expected number, received string` |
| Falta un campo obligatorio | `Invalid input: expected string, received undefined` |

Eso es deliberado: **es preferible que el build falle a que el sitio se publique roto.**

---

## Por qué la sección se acomoda sola

La sección Proyectos contempla **dos estados** desde el primer día: con proyectos, y sin
ninguno. Si el array queda vacío, muestra el mensaje "todavía sin desplegar" con la traza
punteada y el nodo hueco; si tiene elementos, muestra las tarjetas.

Hoy hay tres proyectos cargados, así que el estado vacío no se ve. Sigue estando en el
código igual, y no es esfuerzo desperdiciado: es lo que hace que agregar o quitar un
proyecto sea **editar datos y nada más**. El componente nunca se toca.

Ese es el motivo por el que el contenido vive separado del código en `src/content/`. La
presentación casi nunca cambia; el contenido cambia todo el tiempo. Separarlos por ese
eje es lo que hace que sumar un proyecto sea un cambio de una línea.

---

## Cuando llegue el momento de un segundo idioma

La estructura ya está preparada: los archivos de `src/content/` pasarían a
`src/content/es/` y `src/content/en/`, con los mismos `slug` y los textos traducidos.
Ningún componente cambia, porque ninguno tiene texto escrito adentro.
