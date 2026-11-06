/**
 * Génère les icônes PWA (PNG) sans dépendance externe.
 * Usage : node scripts/generate-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";

const BRAND = [0xc9, 0x57, 0x2c];
const INK = [0x12, 0x16, 0x1e];
const WHITE = [0xff, 0xff, 0xff];

const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
        let c = n;
        for (let k = 0; k < 8; k += 1) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[n] = c >>> 0;
    }
    return table;
})();

function crc32(buffer) {
    let crc = 0xffffffff;
    for (const byte of buffer) {
        crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, "ascii");
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function encodePng(width, height, rgba) {
    const stride = width * 4;
    const raw = Buffer.alloc((stride + 1) * height);
    for (let y = 0; y < height; y += 1) {
        raw[y * (stride + 1)] = 0;
        rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk("IHDR", ihdr),
        chunk("IDAT", deflateSync(raw, { level: 9 })),
        chunk("IEND", Buffer.alloc(0)),
    ]);
}

function roundedRectContains(x, y, w, h, radius) {
    const dx = Math.max(radius - x, 0, x - (w - radius));
    const dy = Math.max(radius - y, 0, y - (h - radius));
    if (dx === 0 || dy === 0) return x >= 0 && y >= 0 && x <= w && y <= h;
    return dx * dx + dy * dy <= radius * radius;
}

/** Dessine une icône : fond arrondi (ou plein) + lettre Z géométrique. */
function drawIcon(size, { maskable = false, rounded = true } = {}) {
    const scale = 2; // supersampling pour des bords propres
    const s = size * scale;
    const pixels = Buffer.alloc(s * s * 4);

    const radius = rounded ? s * 0.22 : 0;
    const inset = maskable ? s * 0.1 : 0;
    const inner = s - inset * 2;

    // Géométrie du Z, centrée dans la zone sûre
    const zLeft = inset + inner * 0.28;
    const zRight = inset + inner * 0.72;
    const zTop = inset + inner * 0.3;
    const zBottom = inset + inner * 0.7;
    const barH = inner * 0.085;
    const thickness = barH;

    const inZ = (x, y) => {
        // barre haute
        if (y >= zTop && y <= zTop + barH && x >= zLeft && x <= zRight) return true;
        // barre basse
        if (y >= zBottom - barH && y <= zBottom && x >= zLeft && x <= zRight) return true;
        // diagonale du haut-droit vers le bas-gauche
        if (y >= zTop && y <= zBottom) {
            const t = (y - zTop) / (zBottom - zTop);
            const center = zRight + (zLeft - zRight) * t;
            if (Math.abs(x - center) <= thickness / 2) return true;
        }
        return false;
    };

    for (let py = 0; py < s; py += 1) {
        for (let px = 0; px < s; px += 1) {
            const index = (py * s + px) * 4;
            const inside = rounded ? roundedRectContains(px, py, s, s, radius) : true;
            if (!inside) {
                pixels[index + 3] = 0;
                continue;
            }
            const isZ = inZ(px, py);
            const color = isZ ? WHITE : maskable ? BRAND : BRAND;
            pixels[index] = color[0];
            pixels[index + 1] = color[1];
            pixels[index + 2] = color[2];
            pixels[index + 3] = 255;
        }
    }

    // Downsample 2x2 -> anti-aliasing
    const out = Buffer.alloc(size * size * 4);
    for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
            let r = 0;
            let g = 0;
            let b = 0;
            let a = 0;
            for (let dy = 0; dy < scale; dy += 1) {
                for (let dx = 0; dx < scale; dx += 1) {
                    const i = ((y * scale + dy) * s + (x * scale + dx)) * 4;
                    const alpha = pixels[i + 3] / 255;
                    r += pixels[i] * alpha;
                    g += pixels[i + 1] * alpha;
                    b += pixels[i + 2] * alpha;
                    a += alpha;
                }
            }
            const count = scale * scale;
            const o = (y * size + x) * 4;
            if (a === 0) {
                out[o + 3] = 0;
                continue;
            }
            out[o] = Math.round(r / a);
            out[o + 1] = Math.round(g / a);
            out[o + 2] = Math.round(b / a);
            out[o + 3] = Math.round((a / count) * 255);
        }
    }

    return encodePng(size, size, out);
}

mkdirSync("public/icons", { recursive: true });

const targets = [
    { path: "public/icons/icon-192.png", size: 192, options: { rounded: false } },
    { path: "public/icons/icon-512.png", size: 512, options: { rounded: false } },
    { path: "public/icons/maskable-512.png", size: 512, options: { maskable: true, rounded: false } },
    { path: "public/icons/apple-touch-icon.png", size: 180, options: { rounded: false } },
    { path: "public/favicon-32.png", size: 32, options: { rounded: false } },
];

for (const target of targets) {
    const png = drawIcon(target.size, target.options);
    writeFileSync(target.path, png);
    console.log(`${target.path} — ${target.size}×${target.size} — ${png.length} octets`);
}
