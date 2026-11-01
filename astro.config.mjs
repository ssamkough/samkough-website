// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Keep the whitespace between text and inline elements (<mark>, <a>, <em>…).
  // With compression on, "killed <mark>while" is built as "killed<mark>while".
  compressHTML: false,
});
