# Flycast WASM — Dreamcast in the browser

Sega **Dreamcast** emulator that runs in the browser, based on the
[flycast-wasm](https://github.com/nasomers/flycast-wasm) core (flycast + SH4→WASM
JIT recompiler) integrated into the EmulatorJS frontend.

No BIOS or games are included. You must provide your own legal copies.

---

## Requirements

- **Node.js** 14 or higher ([nodejs.org](https://nodejs.org))
- A modern browser with WebGL2 (Chrome, Edge, Firefox recommended)

## Getting started

1. Place your **BIOS** in `frontend/bios/`:
   - `dc_boot.bin` (2 MB) — required
   - `dc_flash.bin` (128 KB) — required
   - `dc_nvmem.bin` — optional

2. Place your **games** in `frontend/roms/`:
   - `.chd` (recommended) — a single file per game
   - `.zip` — containing a `.gdi` + its tracks
   - `.cue` / `.gdi` — alongside their `.bin` / `.raw` files

   The emulator **auto-detects the format** and shows all games in the menu.
   No editing needed.

3. Start the server:

   ```bash
   npm start
   ```

   (or directly `node server.js`)

   Works on **Windows (without WSL), Windows with WSL, and Linux**. The server
   uses only Node.js APIs and resolves paths for the current OS automatically.

4. Open in your browser:

   ```
   http://localhost:3333/
   ```

---

## How it works

- The server scans `frontend/roms/` and exposes the list via `GET /api/roms`,
  parsing `.cue`/`.gdi` files to know their tracks.
- The page picks a game, injects the BIOS and the tracks into the core's file
  system, and launches it.
- An on-screen overlay shows **FPS** and **resolution** in real time.

## ROM formats

| Format | Detection | How it is served |
|--------|-----------|------------------|
| `.chd` | single file | Passed directly to the core |
| `.zip` | contains `.gdi` + tracks | Unpacked into the FS, the `.gdi` is used |
| `.cue` | references `.bin` files | Tracks are injected, the `.cue` is loaded |
| `.gdi` | references tracks | Tracks are injected, the `.gdi` is loaded |

## Notes

- Default port is `3333`. Change it with the `PORT` environment variable
  (e.g. `PORT=8421 node server.js`).
- The server sends the isolation headers (COOP/COEP) that the WASM core needs.
  Do not replace it with a plain static server (`python -m http.server`, etc.)
  or the emulator will not start.

## Credits / License

- **Author:** [nasomers](https://github.com/nasomers)
- **Repository:** https://github.com/nasomers/flycast-wasm
- **License:** GNU GPL v2 — see [LICENSE](LICENSE) and [CREDITS.md](CREDITS.md)
- **Contributor:** [LokiCode404](https://github.com/LokiCode404) — local server,
  launcher page, packaging and build recipe fixes

The original core is the work of nasomers. This package only adds a local
server and a launcher page.

---

# Flycast WASM — Dreamcast en el navegador

Emulador de **Sega Dreamcast** que se ejecuta en el navegador, basado en el core
[flycast-wasm](https://github.com/nasomers/flycast-wasm) (flycast + recompilador
SH4→WebAssembly) integrado en el frontend EmulatorJS.

No incluye BIOS ni juegos. Debes aportar tus propias copias legales.

---

## Requisitos

- **Node.js** 14 o superior ([nodejs.org](https://nodejs.org))
- Un navegador moderno con WebGL2 (Chrome, Edge, Firefox recomendados)

## Puesta en marcha

1. Coloca tu **BIOS** en `frontend/bios/`:
   - `dc_boot.bin` (2 MB) — obligatorio
   - `dc_flash.bin` (128 KB) — obligatorio
   - `dc_nvmem.bin` — opcional

2. Coloca tus **juegos** en `frontend/roms/`:
   - `.chd` (recomendado) — un solo archivo por juego
   - `.zip` — que contenga un `.gdi` + sus tracks
   - `.cue` / `.gdi` — junto a sus archivos `.bin` / `.raw`

   El emulador **detecta el formato automáticamente** y muestra todos los
   juegos en el menú. No hay que editar nada.

3. Inicia el servidor:

   ```bash
   npm start
   ```

   (o directamente `node server.js`)

   Funciona en **Windows (sin WSL), Windows con WSL y Linux**. El servidor usa
   solo APIs de Node.js y resuelve las rutas según el sistema operativo actual.

4. Abre en el navegador:

   ```
    http://localhost:3333/
    ```

---

## Cómo funciona

- El servidor escanea `frontend/roms/` y expone la lista vía `GET /api/roms`,
  parseando los `.cue`/`.gdi` para conocer sus tracks.
- La página selecciona un juego, inyecta la BIOS y los tracks en el sistema de
  archivos del core, y lo lanza.
- Un indicador en pantalla muestra **FPS** y **resolución** en vivo.

## Formato de las ROMs

| Formato | Detección | Cómo se sirve |
|---------|-----------|---------------|
| `.chd`  | un archivo | Se pasa directamente al core |
| `.zip`  | contiene `.gdi` + tracks | Se descomprime en el FS, se usa el `.gdi` |
| `.cue`  | referencia `.bin` | Se inyectan los tracks, se carga el `.cue` |
| `.gdi`  | referencia tracks | Se inyectan los tracks, se carga el `.gdi` |

## Notas

- El puerto por defecto es `3333`. Cámbialo con la variable de entorno `PORT`
  (p. ej. `PORT=8421 node server.js`).
- El servidor envía las cabeceras de aislamiento (COOP/COEP) que el core WASM
  necesita. No lo sustituyas por un servidor estático simple (`python -m
  http.server`, etc.) porque el emulador no arrancará.

## Créditos / Licencia

- **Autor:** [nasomers](https://github.com/nasomers)
- **Repositorio:** https://github.com/nasomers/flycast-wasm
- **Licencia:** GNU GPL v2 — ver [LICENSE](LICENSE) y [CREDITS.md](CREDITS.md)
- **Contribuidor:** [LokiCode404](https://github.com/LokiCode404) — servidor
  local, página de lanzamiento, empaquetado y correcciones de la receta de
  compilación

El core original es obra de nasomers. Este paquete solo añade un servidor
local y una página de lanzamiento.
