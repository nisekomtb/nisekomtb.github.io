// One-off helper to generate the size-adjust / ascent-override /
// descent-override / line-gap-override CSS for a "Metropolis Fallback"
// @font-face that matches Metropolis metrics using Arial as the
// underlying glyph source.
//
// Run with:  node _scripts/generate-metropolis-fallback.mjs
//
// Paste the output into assets/fonts/metropolis/stylesheet.css.

import { readFile } from 'node:fs/promises';
import { fromBuffer } from '@capsizecss/unpack';
import { createFontStack } from '@capsizecss/core';
import arialMetrics from '@capsizecss/metrics/arial';

const buffer = await readFile(
  './assets/fonts/metropolis/metropolis-regular-webfont.woff2'
);
const metropolisMetrics = await fromBuffer(buffer);

// Capsize wants familyName on the metrics objects so it can label the
// generated fallback face. fromFile() returns the postscript name
// ('Metropolis-Regular'); we want the public 'Metropolis' family.
metropolisMetrics.familyName = 'Metropolis';

const stack = createFontStack([metropolisMetrics, arialMetrics]);

console.log('// Recommended font-family chain:');
console.log(stack.fontFamily);
console.log();
console.log('// CSS:');
console.log(stack.fontFaceDeclarations || stack.fontFaces);
