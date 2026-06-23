/**
 * Convierte fuentes OTF a WOFF2 con subsetting latino.
 * Uso: node scripts/convert-fonts.mjs
 *
 * Reduce el peso de fuentes significativamente:
 * - OTF → WOFF2: ~4x reducción por compresión Brotli
 * - Subsetting latino básico: elimina glifos de otros idiomas
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname, basename } from 'path';
import Font from 'fonteditor-core';

// Unicode ranges para subsetting latino (con soporte español)
const LATIN_SUBSET = [
  [0x0020, 0x007E],   // ASCII básico (letras, números, símbolos)
  [0x00A0, 0x00FF],   // Latin-1 Supplement (incluye ñ, acentos, ¿, ¡)
  [0x0131],           // ı (dotless i)
  [0x0152, 0x0153],   // Œ œ
  [0x0160, 0x0161],   // Š š
  [0x0178],           // Ÿ
  [0x017D, 0x017E],   // Ž ž
  [0x02C6],           // ˆ
  [0x02DA],           // ˚
  [0x02DC],           // ˜
  [0x2000, 0x206F],   // General Punctuation
  [0x20AC],           // €
  [0x2122],           // ™
  [0x2190, 0x2199],   // Flechas
  [0x2212],           // −
  [0xFEFF],           // BOM
  [0xFFFD],           // �
];

// OTF files to convert (source paths relative to project root)
const FONT_FILES = [
  { src: 'public/Cocogoose_trial.otf', name: 'Cocogoose Pro' },
  { src: 'public/fonnts.com-TT-Commons-Bold.otf', name: 'TT Commons Bold' },
  { src: 'public/fonnts.com-TT-Commons-Medium.otf', name: 'TT Commons Medium' },
  { src: 'public/fonnts.com-TT-Commons-Regular.otf', name: 'TT Commons Regular' },
];

function collectUnicodes(ranges) {
  const set = new Set();
  for (const range of ranges) {
    if (range.length === 2) {
      const [start, end] = range;
      for (let cp = start; cp <= end; cp++) set.add(cp);
    } else {
      set.add(range[0]);
    }
  }
  return [...set].sort((a, b) => a - b);
}

async function convertFont({ src, name }) {
  const inputPath = resolve(src);
  const outputPath = resolve('public', basename(src).replace(/\.otf$/i, '.woff2'));
  
  console.log(`\n📄 ${name}`);
  console.log(`   Leyendo: ${inputPath}`);
  
  const buffer = readFileSync(inputPath);
  const sizeKB = (buffer.length / 1024).toFixed(0);
  console.log(`   Tamaño OTF: ${sizeKB} KB`);
  
  try {
    // Parse OTF
    const font = Font.create(buffer, {
      type: 'otf',
      subset: collectUnicodes(LATIN_SUBSET),
      hinting: false,
    });
    
    // Export as WOFF2
    const woff2Buffer = font.toBuffer({
      type: 'woff2',
      // metadata: { ... } // optional
    });
    
    writeFileSync(outputPath, woff2Buffer);
    
    const woff2SizeKB = (woff2Buffer.length / 1024).toFixed(0);
    const reduction = ((1 - woff2Buffer.length / buffer.length) * 100).toFixed(0);
    console.log(`   ✅ WOFF2: ${outputPath}`);
    console.log(`   Tamaño WOFF2: ${woff2SizeKB} KB (${reduction}% reducción)`);
    
    return { name, ok: true, before: buffer.length, after: woff2Buffer.length };
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return { name, ok: false, error: err.message };
  }
}

async function main() {
  console.log('🔤 Conversión de fuentes OTF → WOFF2\n');
  
  const results = [];
  for (const font of FONT_FILES) {
    const result = await convertFont(font);
    results.push(result);
  }
  
  console.log('\n═══════════════════════════════');
  console.log('📊 Resumen:');
  let totalBefore = 0;
  let totalAfter = 0;
  let okCount = 0;
  
  for (const r of results) {
    if (r.ok) {
      totalBefore += r.before;
      totalAfter += r.after;
      okCount++;
      console.log(`   ✅ ${r.name}: ${(r.before / 1024).toFixed(0)} KB → ${(r.after / 1024).toFixed(0)} KB`);
    } else {
      console.log(`   ❌ ${r.name}: falló - ${r.error}`);
    }
  }
  
  if (okCount > 0) {
    const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(0);
    console.log(`\n   Total: ${(totalBefore / 1024).toFixed(0)} KB → ${(totalAfter / 1024).toFixed(0)} KB (${totalReduction}% reducción)`);
  }
}

main().catch(console.error);
