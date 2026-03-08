#!/usr/bin/env node
/**
 * Image optimization script for /public directory.
 *
 * Usage:
 *   node scripts/optimize-images.mjs            # optimize all images
 *   node scripts/optimize-images.mjs --dry-run  # preview without writing
 *
 * Rules:
 *   - Skip files < 100 KB (already small enough)
 *   - JPG/JPEG → recompress quality 80, strip metadata, max 1400px wide
 *   - PNG without alpha → convert to JPG (rename file, print warning to update refs)
 *   - PNG with alpha → compress as PNG (quality 80-100 palette), max 1400px wide
 *   - WebP → recompress quality 82, max 1400px wide
 *   - Skips /favicon-for-app/ subdirectory
 */

import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "../public");
const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_UNDER_KB = 100;
const MAX_WIDTH = 1400;

const SKIP_DIRS = new Set(["favicon-for-app"]);

/** Recursively collect image paths */
async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        files.push(...(await collectImages(join(dir, entry.name))));
      }
    } else {
      const ext = extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        files.push(join(dir, entry.name));
      }
    }
  }
  return files;
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  return `${Math.round(bytes / 1024)}KB`;
}

async function processImage(filePath) {
  const { size: originalSize } = await stat(filePath);
  if (originalSize < SKIP_UNDER_KB * 1024) {
    return null; // skip
  }

  const ext = extname(filePath).toLowerCase();
  const img = sharp(filePath);
  const meta = await img.metadata();

  let outPath = filePath;
  let pipeline;

  if (ext === ".png") {
    const hasAlpha = meta.channels === 4 && meta.hasAlpha;

    if (!hasAlpha) {
      // Convert to JPG
      outPath = filePath.replace(/\.png$/i, ".jpg");
      pipeline = img
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true });
    } else {
      // Keep as PNG but compress
      pipeline = img
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .png({ compressionLevel: 9, palette: true, quality: 80 });
    }
  } else if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = img
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true });
  } else if (ext === ".webp") {
    pipeline = img
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 82 });
  } else {
    return null;
  }

  if (DRY_RUN) {
    const newFile = outPath !== filePath ? ` → ${basename(outPath)}` : "";
    console.log(`  [dry] ${basename(filePath)}${newFile}  (${formatSize(originalSize)})`);
    return { original: filePath, output: outPath, originalSize, newSize: 0, dryRun: true };
  }

  const buffer = await pipeline.toBuffer();
  const newSize = buffer.length;

  // Write to temp file first, then replace
  const tmpPath = outPath + ".optim_tmp";
  await sharp(buffer).toFile(tmpPath);

  // Remove original if converting format (PNG→JPG)
  if (outPath !== filePath) {
    await unlink(filePath);
  }
  await rename(tmpPath, outPath);

  return { original: filePath, output: outPath, originalSize, newSize };
}

async function main() {
  console.log(`\n🖼  Image optimizer — ${DRY_RUN ? "DRY RUN" : "writing files"}`);
  console.log(`   dir: ${PUBLIC_DIR}`);
  console.log(`   skip < ${SKIP_UNDER_KB}KB | max width: ${MAX_WIDTH}px\n`);

  const images = await collectImages(PUBLIC_DIR);
  console.log(`Found ${images.length} image(s)\n`);

  let processed = 0;
  let skipped = 0;
  let totalSaved = 0;
  const pngToJpgRenames = [];

  for (const filePath of images) {
    const result = await processImage(filePath);
    if (!result) {
      skipped++;
      continue;
    }
    processed++;

    if (result.dryRun) continue;

    const saved = result.originalSize - result.newSize;
    totalSaved += saved;
    const pct = Math.round((saved / result.originalSize) * 100);
    const renamed = result.output !== result.original ? ` → ${basename(result.output)}` : "";

    console.log(
      `  ✓ ${basename(result.original)}${renamed}  ` +
      `${formatSize(result.originalSize)} → ${formatSize(result.newSize)}  (-${pct}%)`
    );

    if (result.output !== result.original) {
      pngToJpgRenames.push({ from: result.original, to: result.output });
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Processed: ${processed}  |  Skipped (small): ${skipped}`);
  if (!DRY_RUN && totalSaved > 0) {
    console.log(`Total saved: ${formatSize(totalSaved)}`);
  }

  if (pngToJpgRenames.length > 0) {
    console.log(`\n⚠  PNG→JPG renames — update these references in your code:`);
    for (const r of pngToJpgRenames) {
      const rel = basename(r.from).replace(".png", "");
      console.log(`   ${rel}.png  →  ${rel}.jpg`);
    }
  }

  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
