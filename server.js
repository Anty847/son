const http = require("http");
const fs = require("fs");
const path = require("path");

// path.join handles Windows (\) and Linux/WSL (/) separators consistently
const ROOT = path.resolve(__dirname, "frontend");
const ROMS_DIR = path.join(ROOT, "roms");
const BIOS_DIR = path.join(ROOT, "bios");
const PORT = process.env.PORT || 3333;

const MIME = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".wasm": "application/wasm",
    ".data": "application/octet-stream",
    ".bin": "application/octet-stream",
    ".raw": "application/octet-stream",
    ".chd": "application/octet-stream",
    ".cue": "text/plain",
    ".gdi": "text/plain",
    ".zip": "application/zip",
    ".7z": "application/x-7z-compressed",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
};

// ---- ROM discovery ----

function coreVersion() {
    // Hash of the flycast core .data so the launcher can cache-bust it:
    // whenever a new core is compiled, the hash changes and the browser
    // fetches the fresh .data instead of serving the cached one.
    try {
        const coreFile = path.join(ROOT, "data/cores/flycast-wasm.data");
        const data = fs.readFileSync(coreFile);
        const crypto = require("crypto");
        return crypto.createHash("md5").update(data).digest("hex").slice(0, 12);
    } catch (e) {
        return "unknown";
    }
}

function parseCueTracks(text) {
    const tracks = [];
    const re = /FILE\s+"([^"]+)"/g;
    let m;
    while ((m = re.exec(text))) tracks.push(m[1]);
    return tracks;
}

function parseGdiTracks(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const tracks = [];
    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(/\s+/);
        // GDI line: <track> <lba> <type> <sectors> <filename> [<pregap>]
        if (parts.length >= 5) tracks.push(parts[4]);
    }
    return tracks;
}

function listRoms() {
    const roms = [];
    if (!fs.existsSync(ROMS_DIR)) return roms;
    const isGame = /\.(chd|cdi|iso|gdi|cue|zip|7z)$/i;
    for (const f of fs.readdirSync(ROMS_DIR)) {
        if (!isGame.test(f)) continue;
        const p = path.join(ROMS_DIR, f);
        let stat;
        try { stat = fs.statSync(p); } catch (e) { continue; }
        if (!stat.isFile()) continue;
        const ext = path.extname(f).toLowerCase();
        const entry = {
            file: f,
            url: "roms/" + encodeURI(f),
            ext,
            size: stat.size,
            type: "single",
            tracks: []
        };
        if (ext === ".cue" || ext === ".gdi") {
            entry.type = "multi";
            try {
                const text = fs.readFileSync(p, "utf8");
                entry.tracks = ext === ".cue" ? parseCueTracks(text) : parseGdiTracks(text);
            } catch (e) {
                entry.tracks = [];
            }
        }
        roms.push(entry);
    }
    // Sort alphabetically (case-insensitive)
    roms.sort((a, b) => a.file.toLowerCase().localeCompare(b.file.toLowerCase()));
    return roms;
}

function listBios() {
    const needed = ["dc_boot.bin", "dc_flash.bin"];
    const found = {};
    if (fs.existsSync(BIOS_DIR)) {
        for (const f of fs.readdirSync(BIOS_DIR)) {
            if (needed.includes(f) || /\.bin$/.test(f)) found[f] = true;
        }
    }
    return {
        present: needed.every(f => found[f]),
        files: Object.keys(found),
        needed
    };
}

// ---- HTTP server ----

http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);

    // API: list ROMs (auto-detect formats)
    if (urlPath === "/api/roms") {
        res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ roms: listRoms(), bios: listBios(), coreVersion: coreVersion() }));
        return;
    }

    if (urlPath === "/") urlPath = "/test-flycast.html";

    // Resolve within ROOT, preventing traversal (works on Windows and Linux)
    let filePath = path.resolve(ROOT, "." + urlPath);
    const rel = path.relative(ROOT, filePath);
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
    }

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(404);
            res.end("Not found: " + urlPath);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const type = MIME[ext] || "application/octet-stream";
        // Cross-origin isolation required by the WASM core (SharedArrayBuffer/COEP)
        res.writeHead(200, {
            "Content-Type": type,
            "Content-Length": stat.size,
            "Cross-Origin-Opener-Policy": "same-origin",
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cache-Control": "no-store",
        });
        fs.createReadStream(filePath).pipe(res);
    });
}).listen(PORT, () => {
    console.log(`Flycast WASM test server: http://localhost:${PORT}/`);
});
