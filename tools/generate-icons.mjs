// Generate a self-hosted Lucide subset containing only the icons this site uses.
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..');
const LUCIDE_VERSION = '0.468.0';

// --- 1. load the upstream UMD bundle in a throwaway scope -------------------
const src = await fetch(`https://unpkg.com/lucide@${LUCIDE_VERSION}/dist/umd/lucide.min.js`)
  .then(r => {
    if (!r.ok) throw new Error(`unpkg returned ${r.status}`);
    return r.text();
  });
const win = {};
const mod = { exports: {} };
new Function('exports', 'module', 'define', 'globalThis', 'window', 'self', src)(
  mod.exports, mod, undefined, win, win, win
);
const upstream = (win.lucide || mod.exports).icons;

// --- 2. find every icon name the site actually references ------------------
const used = new Set();
const SKIP = new Set(['.git', 'node_modules', 'tools']);
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(p); continue; }
    if (!/\.(html|js)$/.test(entry.name)) continue;
    if (p === path.join(REPO, 'assets/icons.js')) continue; // don't read our own output
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.matchAll(/data-lucide="([a-z0-9-]+)"/g)) used.add(m[1]);
  }
};
walk(REPO);

const kebabToPascal = (s) => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');

const names = [...used].sort();
const missing = names.filter(n => !upstream[kebabToPascal(n)]);
if (missing.length) {
  console.error('NOT FOUND IN LUCIDE:', missing);
  process.exit(1);
}

// --- 3. serialise each icon's children to a raw SVG inner string -----------
const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const serialise = (node) => {
  const [tag, attrs, children = []] = node;
  const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
  return children.length
    ? `<${tag}${a}>${children.map(serialise).join('')}</${tag}>`
    : `<${tag}${a}/>`;
};

const table = {};
for (const name of names) {
  const [, , children] = upstream[kebabToPascal(name)];
  table[name] = children.map(serialise).join('');
}

// --- 4. emit the runtime ---------------------------------------------------
const body = names.map(n => `  ${JSON.stringify(n)}: ${JSON.stringify(table[n])}`).join(',\n');

const out = `/*!
 * Lucide icon subset for Just For Phishing — self-hosted.
 *
 * Generated from lucide@${LUCIDE_VERSION} (ISC License, https://lucide.dev) by
 * tools/generate-icons.mjs. Contains only the ${names.length} icons this site
 * actually references, so it is ~10x smaller than the full UMD bundle and needs
 * no third-party CDN in the Content-Security-Policy.
 *
 * Do not hand-edit. To add an icon, use it in markup with data-lucide="name"
 * and re-run: node tools/generate-icons.mjs
 *
 * Exposes the same surface the site calls:
 *   lucide.createIcons()                  -> replace every [data-lucide] in the document
 *   lucide.createIcons({ els: nodeList }) -> replace only the given elements
 */
(function (global) {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';

  var ICONS = {
${body}
  };

  var BASE_ATTRS = {
    xmlns: SVG_NS,
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  };

  function replace(el) {
    var name = el.getAttribute('data-lucide');
    var inner = ICONS[name];
    if (!inner) return;

    var svg = document.createElementNS(SVG_NS, 'svg');
    for (var key in BASE_ATTRS) {
      if (Object.prototype.hasOwnProperty.call(BASE_ATTRS, key)) {
        svg.setAttribute(key, BASE_ATTRS[key]);
      }
    }

    // Carry the placeholder's own attributes across, so class-based sizing
    // (.icon, .icon--xl) and aria-hidden survive the swap.
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name === 'data-lucide') continue;
      svg.setAttribute(attr.name, attr.value);
    }
    svg.classList.add('lucide', 'lucide-' + name);

    // Decorative unless the author gave it a label.
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
    } else {
      svg.setAttribute('role', 'img');
    }

    svg.innerHTML = inner;
    el.parentNode.replaceChild(svg, el);
  }

  function createIcons(options) {
    var els = options && options.els
      ? options.els
      : document.querySelectorAll('[data-lucide]');
    // Snapshot first: replace() mutates the DOM as it goes.
    Array.prototype.slice.call(els).forEach(replace);
  }

  global.lucide = { createIcons: createIcons, icons: ICONS };
})(typeof window !== 'undefined' ? window : this);
`;

fs.writeFileSync(path.join(REPO, 'assets/icons.js'), out);
console.log(`wrote assets/icons.js — ${names.length} icons, ${(out.length / 1024).toFixed(1)} KB`);
console.log('icons:', names.join(', '));
