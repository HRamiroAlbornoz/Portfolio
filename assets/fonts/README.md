# Fuentes incrustadas en la imagen de previsualización

Estos archivos **no** los usa el sitio. El sitio carga sus fuentes con
`next/font/google` en `src/app/layout.tsx`.

Estas copias existen solo para `src/app/opengraph-image.tsx`, que genera la
imagen que se ve al compartir el enlace en LinkedIn o WhatsApp. Esa imagen se
dibuja durante el build con un motor propio que no lee CSS ni hereda las
fuentes del sitio: hay que pasarle el archivo binario a mano.

Se guardan en el repositorio, en lugar de descargarlas durante el build, para
que el build nunca dependa de que un servidor externo responda.

Formato `.woff` porque es el más liviano de los tres que acepta el motor
(`ttf`, `otf`, `woff`). No sirve `.woff2`.

| Archivo | Fuente | Peso | Dónde se usa en la imagen |
|---|---|---|---|
| `Archivo-Bold.woff` | Archivo | 700 | El nombre |
| `InstrumentSans-Regular.woff` | Instrument Sans | 400 | La frase de presentación |
| `JetBrainsMono-Regular.woff` | JetBrains Mono | 400 | Las etiquetas en mayúsculas |

Subconjunto latino, descargados de [Fontsource](https://fontsource.org/).

## Licencia

Las tres se distribuyen bajo la **SIL Open Font License 1.1**, cuyo texto
completo está en `LICENSE.txt`. La licencia permite redistribuirlas dentro de
este repositorio siempre que se incluyan el texto y los avisos de copyright:

- Archivo — Copyright 2020 The Archivo Project Authors
  (https://github.com/Omnibus-Type/Archivo)
- Instrument Sans — Copyright 2022 The Instrument Sans Project Authors
  (https://github.com/Instrument/instrument-sans)
- JetBrains Mono — Copyright 2020 The JetBrains Mono Project Authors
  (https://github.com/JetBrains/JetBrainsMono)
