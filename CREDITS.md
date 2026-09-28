# Credits / Créditos

**Original project / Proyecto original:**

- **Author / Autor:** [nasomers](https://github.com/nasomers)
- **Repository / Repositorio:** https://github.com/nasomers/flycast-wasm
- **License / Licencia:** GNU GPL v2 (see `LICENSE` file / ver archivo `LICENSE`)

**Contributors / Contribuidores:**

- **LokiCode404** — local server, launcher page, packaging and the build
  recipe fixes documented in this package (EJS_RA flags, CRLF patch fix,
  bitcode objects for the `-flto` link).
  Servidor local, página de lanzamiento, empaquetado y las correcciones de la
  receta de compilación documentadas en este paquete (flags del EJS_RA,
  arreglo CRLF del patch, objetos bitcode para el enlazado con `-flto`).

---

flycast-wasm is the first Sega Dreamcast emulator running in a browser, powered
by a custom SH4 to WebAssembly JIT recompiler. It is based on
[flyinghead/flycast](https://github.com/flyinghead/flycast) and integrates the
[EmulatorJS](https://emulatorjs.org/) frontend.

flycast-wasm es el primer emulador de Sega Dreamcast que se ejecuta en un
navegador, gracias a un recompilador JIT SH4→WebAssembly propio. Está basado en
[flyinghead/flycast](https://github.com/flyinghead/flycast) e integra el frontend
[EmulatorJS](https://emulatorjs.org/).

---

This package only adds a local server and a launcher page. The emulator core
itself is the work of nasomers. No BIOS or game content is included.

Este paquete solo añade un servidor local y una página de lanzamiento. El core
del emulador es obra de nasomers. No se incluye BIOS ni contenido de juegos.
