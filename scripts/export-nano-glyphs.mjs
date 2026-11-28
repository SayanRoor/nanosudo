// Export the React glyphs as standalone SVGs and a two-theme size/hover proof.
import { spawnSync } from "node:child_process";
import {
  readdirSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "src/components/icons/nano");
const proof = path.join(root, "artifacts/nano-glyphs");
const compiled = path.join(root, "test-results/nano-glyphs/.compiled");
const destination = path.join(root, "public/brand/glyphs");
const names = [
  "ai",
  "code",
  "link",
  "speed",
  "shield",
  "contract",
  "payment",
  "eye",
  "talk",
  "blueprint",
  "layers",
  "launch",
];

function compileGlyphs() {
  const files = readdirSync(source).filter(
    (name) => /\.(ts|tsx)$/.test(name) && !name.includes(".test."),
  );
  const result = spawnSync(
    process.execPath,
    [
      require.resolve("typescript/bin/tsc"),
      ...files.map((name) => path.join(source, name)),
      "--outDir",
      compiled,
      "--jsx",
      "react-jsx",
      "--target",
      "es2020",
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--skipLibCheck",
      "--esModuleInterop",
    ],
    { cwd: root, stdio: "inherit" },
  );
  if (result.status !== 0) throw new Error("Glyph compilation failed");
  return require(path.join(compiled, "index.js"));
}

function renderGlyph(name, size, prefix) {
  const component = glyphs[`Glyph${name[0].toUpperCase()}${name.slice(1)}`];
  return renderToStaticMarkup(
    createElement(component, { size, title: `Nano ${name}` }),
    { identifierPrefix: prefix },
  );
}

function fixedColors(svg, theme = "dark") {
  const foreground = theme === "dark" ? "#F4F4F1" : "#07080A";
  const colors =
    theme === "dark" ? ["#4ADE80", "#2BB25A"] : ["#2BB25A", "#1A7A3E"];
  return svg
    .replaceAll("currentColor", foreground)
    .replace(
      'style="stop-color:var(--glyph-a, #4ADE80)"',
      `stop-color="${colors[0]}"`,
    )
    .replace(
      'style="stop-color:var(--glyph-b, #2BB25A)"',
      `stop-color="${colors[1]}"`,
    );
}

function exportSvg(name) {
  const svg = fixedColors(renderGlyph(name, 48, `nano-${name}-`));
  writeFileSync(path.join(destination, `${name}.svg`), `${svg}\n`);
}

function renderTheme(theme) {
  const rows = [24, 32, 48]
    .map(
      (size) =>
        `<div class="row"><b>${size} px</b><div class="icons">${names
          .map(
            (name) =>
              `<div class="group cell" data-glyph="${name}">${renderGlyph(name, size, `${theme}-${size}-${name}-`)}<small>${name}</small></div>`,
          )
          .join("")}</div></div>`,
    )
    .join("");
  return `<section data-theme="${theme}"><h2>${theme === "dark" ? "Terminal Black" : "Paper"} / ${theme}</h2>${rows}</section>`;
}

function exportPreview() {
  const css = readFileSync(
    path.join(root, "src/app/globals.css"),
    "utf8",
  ).split("/* Nano Glyphs */")[1];
  const layout = `*{box-sizing:border-box}body{margin:0;background:#171b19;font:14px system-ui;color:#F4F4F1}header{padding:24px 32px}h1{font-size:24px;margin:0 0 8px}p{margin:0;color:#a1aaa4}section{padding:20px 32px;background:#07080A;color:#F4F4F1}section[data-theme=light]{background:#F4F4F1;color:#07080A}h2{font-size:15px;margin:0 0 8px} .row{display:flex;align-items:center;gap:12px}b{width:44px;font-size:12px}.icons{display:grid;grid-template-columns:repeat(12,minmax(80px,1fr));width:100%;gap:8px}.cell{min-height:92px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;border-radius:8px}.cell:hover{background:#80808018}small{font-size:11px;opacity:.65}.nano-glyph{display:block;overflow:visible}`;
  writeFileSync(
    path.join(proof, "preview.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nano Glyph v1 — size and theme proof</title><style>${css}\n${layout}</style><body><header><h1>NANO GLYPH v1</h1><p>12 glyphs · 24 / 32 / 48 px · hover each cell to animate</p></header>${renderTheme("dark")}${renderTheme("light")}</body></html>\n`,
  );
}

function renderSheetTheme(theme, top) {
  const color = theme === "dark" ? "#F4F4F1" : "#07080A";
  const rows = [24, 32, 48]
    .map((size, row) => {
      const center = top + 84 + row * 100;
      const icons = names
        .map((name, index) => {
          const x = 143 + index * 110;
          const svg = fixedColors(
            renderGlyph(name, size, `sheet-${theme}-${size}-${name}-`),
            theme,
          ).replace(
            "<svg ",
            `<svg x="${x - size / 2}" y="${center - size / 2}" `,
          );
          return `${svg}<text x="${x}" y="${center + 39}" font-size="11" text-anchor="middle" opacity=".7">${name}</text>`;
        })
        .join("");
      return `<text x="32" y="${center + 4}" font-size="12">${size} px</text>${icons}`;
    })
    .join("");
  return `<g fill="${color}"><rect y="${top}" width="1440" height="370" fill="${theme === "dark" ? "#07080A" : "#F4F4F1"}"/><text x="32" y="${top + 28}" font-size="15">${theme === "dark" ? "Terminal Black" : "Paper"} / ${theme}</text>${rows}</g>`;
}

async function exportSheet() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="836" viewBox="0 0 1440 836" font-family="Arial, sans-serif"><rect width="1440" height="836" fill="#171B19"/><text x="32" y="40" fill="#F4F4F1" font-size="24" font-weight="bold">NANO GLYPH v1</text><text x="32" y="66" fill="#A1AAA4" font-size="14">12 glyphs · 24 / 32 / 48 px · React source → SVG exports → raster proof</text>${renderSheetTheme("dark", 96)}${renderSheetTheme("light", 466)}</svg>`;
  writeFileSync(path.join(proof, "preview.svg"), `${svg}\n`);
  await sharp(Buffer.from(svg)).png().toFile(path.join(proof, "preview.png"));
}

mkdirSync(proof, { recursive: true });
mkdirSync(destination, { recursive: true });
const glyphs = compileGlyphs();
try {
  names.forEach(exportSvg);
  exportPreview();
  await exportSheet();
} finally {
  rmSync(compiled, { recursive: true, force: true });
}
process.stdout.write(
  "Exported 12 SVGs to public/brand/glyphs and preview.html/svg/png to artifacts/nano-glyphs\n",
);
