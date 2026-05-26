// domain-analyzer.js — Domain Lookalike Analyzer
// No build tools, no fetch — fully file:// compatible
(function () {
  'use strict';

  // ─── Homoglyph map ───────────────────────────────────────────────────────────
  const HOMOGLYPHS = {
    'o': ['0', 'ο'],   // 0, Greek small letter omicron
    'l': ['1', 'I', '|'],  // 1, uppercase I, pipe
    'a': ['@'],
    'e': ['3'],
    'i': ['1', 'ı'],   // 1, dotless i
    's': ['5'],
    'n': ['ṅ']         // n with dot above
  };

  // Keywords for added-word variants
  const KEYWORDS = [
    'secure', 'security', 'login', 'support', 'verify',
    'account', 'update', 'service', 'help', 'portal', 'online', 'alert'
  ];

  // Max results per group
  const MAX_HOMOGLYPHS = 8;
  const MAX_TYPOS      = 5;
  const MAX_TLD_SWAPS  = 8;
  const MAX_KEYWORDS   = 12;
  const MAX_SUBDOMAINS = 5;

  // TLDs to swap to
  const ALT_TLDS = ['.net', '.org', '.co', '.io', '.info', '.biz', '.us', '.com.co'];

  // ─── Core analysis function ───────────────────────────────────────────────────

  function analyzeDomain(rawDomain) {
    // Normalise: lowercase, strip leading protocol/www
    const domain = rawDomain.toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .trim();

    // Split into name and TLD (handle multi-part TLDs like .com.co)
    const dotIdx = domain.indexOf('.');
    if (dotIdx < 0) return null;

    const name = domain.slice(0, dotIdx);
    const tld  = domain.slice(dotIdx); // includes the dot

    return {
      original: domain,
      name,
      tld,
      homoglyphs:   buildHomoglyphs(name, tld),
      typos:        buildTypos(name, tld),
      tld_swap:     buildTldSwaps(name, tld),
      added_words:  buildAddedWords(name, tld),
      subdomain_tricks: buildSubdomainTricks(name, tld)
    };
  }

  // ─── Homoglyphs ───────────────────────────────────────────────────────────────

  function buildHomoglyphs(name, tld) {
    const results = [];
    const seen = new Set();

    for (let i = 0; i < name.length; i++) {
      const ch = name[i];
      const substitutions = HOMOGLYPHS[ch];
      if (!substitutions) continue;

      substitutions.forEach(sub => {
        const newName = name.slice(0, i) + sub + name.slice(i + 1);
        const variant = newName + tld;

        if (!seen.has(variant) && variant !== name + tld) {
          seen.add(variant);
          results.push({
            domain: variant,
            description: `'${ch}' replaced with '${sub}' at position ${i + 1}`,
            diffStart: i,
            diffLen: sub.length
          });
        }
      });

      if (results.length >= MAX_HOMOGLYPHS) break;
    }

    return results.slice(0, MAX_HOMOGLYPHS);
  }

  // ─── Typos ────────────────────────────────────────────────────────────────────

  function buildTypos(name, tld) {
    const results = [];
    const seen = new Set();

    // Adjacent character transpositions
    for (let i = 0; i < name.length - 1; i++) {
      const swapped = name.slice(0, i) + name[i + 1] + name[i] + name.slice(i + 2);
      const variant = swapped + tld;
      if (!seen.has(variant) && variant !== name + tld) {
        seen.add(variant);
        results.push({
          domain: variant,
          description: `Characters '${name[i]}' and '${name[i + 1]}' transposed`,
          diffStart: i,
          diffLen: 2
        });
      }
    }

    // Doubled first characters (e.g. paypal → ppaypal)
    for (let i = 0; i < Math.min(3, name.length); i++) {
      const doubled = name.slice(0, i + 1) + name[i] + name.slice(i + 1);
      const variant = doubled + tld;
      if (!seen.has(variant)) {
        seen.add(variant);
        results.push({
          domain: variant,
          description: `Letter '${name[i]}' doubled at position ${i + 1}`,
          diffStart: i,
          diffLen: 2
        });
      }
    }

    return results.slice(0, MAX_TYPOS);
  }

  // ─── TLD swaps ────────────────────────────────────────────────────────────────

  function buildTldSwaps(name, tld) {
    const results = [];
    const seen = new Set();

    ALT_TLDS.forEach(altTld => {
      if (altTld === tld) return; // skip if same
      const variant = name + altTld;
      if (!seen.has(variant)) {
        seen.add(variant);
        results.push({
          domain: variant,
          description: `TLD changed from ${tld} to ${altTld}`,
          diffStart: name.length,
          diffLen: altTld.length
        });
      }
    });

    return results.slice(0, MAX_TLD_SWAPS);
  }

  // ─── Added words ─────────────────────────────────────────────────────────────

  function buildAddedWords(name, tld) {
    const results = [];
    const seen = new Set();
    const cleanTld = tld.replace(/^\./, '');

    KEYWORDS.forEach(kw => {
      // keyword appended: paypal-secure.com
      const append = `${name}-${kw}.${cleanTld}`;
      if (!seen.has(append)) {
        seen.add(append);
        results.push({
          domain: append,
          description: `Keyword "${kw}" appended`,
          diffStart: name.length + 1,
          diffLen: kw.length
        });
      }

      // keyword prepended: secure-paypal.com
      const prepend = `${kw}-${name}.${cleanTld}`;
      if (!seen.has(prepend)) {
        seen.add(prepend);
        results.push({
          domain: prepend,
          description: `Keyword "${kw}" prepended`,
          diffStart: 0,
          diffLen: kw.length
        });
      }
    });

    return results.slice(0, MAX_KEYWORDS);
  }

  // ─── Subdomain tricks ─────────────────────────────────────────────────────────

  function buildSubdomainTricks(name, tld) {
    const cleanTld = tld.replace(/^\./, '');
    return [
      {
        domain: `${name}${tld}.verify.net`,
        description: 'Legitimate domain used as subdomain of attacker domain',
        diffStart: name.length + tld.length + 1,
        diffLen: 'verify.net'.length
      },
      {
        domain: `${name}${tld}.secure-login.com`,
        description: 'Legitimate domain used as subdomain of attacker domain',
        diffStart: name.length + tld.length + 1,
        diffLen: 'secure-login.com'.length
      },
      {
        domain: `login.${name}-verify.${cleanTld}`,
        description: '"login" subdomain on typo domain',
        diffStart: 0,
        diffLen: 6
      },
      {
        domain: `secure.${name}-online.${cleanTld}`,
        description: '"secure" subdomain on typo domain',
        diffStart: 0,
        diffLen: 7
      },
      {
        domain: `account.${name}-support.${cleanTld}`,
        description: '"account" subdomain on typo domain',
        diffStart: 0,
        diffLen: 8
      }
    ].slice(0, MAX_SUBDOMAINS);
  }

  // ─── Rendering ───────────────────────────────────────────────────────────────

  function highlightDiff(domain, diffStart, diffLen) {
    if (diffStart === undefined || diffLen === undefined) return escHtml(domain);
    const before = domain.slice(0, diffStart);
    const marked = domain.slice(diffStart, diffStart + diffLen);
    const after  = domain.slice(diffStart + diffLen);
    return escHtml(before) + `<mark class="diff-mark">${escHtml(marked)}</mark>` + escHtml(after);
  }

  function renderGroup(title, icon, items, original) {
    if (items.length === 0) {
      return `
        <div class="result-group">
          <div class="result-group-header">
            <span>${icon}</span>
            <span class="result-group-title">${title}</span>
            <span class="result-group-count">0</span>
          </div>
          <div class="no-results">No variants generated for this category.</div>
        </div>`;
    }

    const rows = items.map((item, idx) => `
      <div class="result-item">
        <div>
          <div class="result-domain">${highlightDiff(item.domain, item.diffStart, item.diffLen)}</div>
          <div class="result-desc">${escHtml(item.description)} &nbsp;·&nbsp; <span style="color:#aaa;">vs. ${escHtml(original)}</span></div>
        </div>
        <button class="copy-btn" data-copy="${escHtml(item.domain)}" data-idx="${idx}-${title.replace(/\s/g,'')}">Copy</button>
      </div>
    `).join('');

    return `
      <div class="result-group">
        <div class="result-group-header">
          <span>${icon}</span>
          <span class="result-group-title">${title}</span>
          <span class="result-group-count">${items.length}</span>
        </div>
        ${rows}
      </div>`;
  }

  function renderResults(analysis) {
    const area = document.getElementById('results-area');

    area.innerHTML = `
      <div style="margin-bottom:8px;">
        <p style="font-size:.95rem;color:var(--muted);">
          Showing lookalike variants for <strong style="color:var(--ink);font-family:'JetBrains Mono',monospace;">${escHtml(analysis.original)}</strong>
        </p>
      </div>
      ${renderGroup('Homoglyph Substitutions', '<i data-lucide="type" class="icon"></i>',           analysis.homoglyphs,       analysis.original)}
      ${renderGroup('Typos & Transpositions',  '<i data-lucide="pencil" class="icon"></i>',          analysis.typos,            analysis.original)}
      ${renderGroup('TLD Swaps',               '<i data-lucide="globe" class="icon"></i>',           analysis.tld_swap,         analysis.original)}
      ${renderGroup('Keyword Additions',        '<i data-lucide="key" class="icon"></i>',             analysis.added_words,      analysis.original)}
      ${renderGroup('Subdomain Tricks',         '<i data-lucide="shuffle" class="icon"></i>',         analysis.subdomain_tricks, analysis.original)}
    `;

    area.style.display = 'grid';
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: area.querySelectorAll('[data-lucide]') });

    // Wire up copy buttons
    area.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
          }).catch(() => fallbackCopy(text, btn));
        } else {
          fallbackCopy(text, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); btn.textContent = 'Copied!'; btn.classList.add('copied'); }
    catch (_) { btn.textContent = 'Error'; }
    document.body.removeChild(ta);
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Event wiring ────────────────────────────────────────────────────────────

  function runAnalysis() {
    const input = document.getElementById('domain-input');
    const raw = (input.value || '').trim();
    if (!raw) {
      input.focus();
      input.style.borderColor = '#dc2626';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    const analysis = analyzeDomain(raw);
    if (!analysis) {
      input.style.borderColor = '#dc2626';
      setTimeout(() => { input.style.borderColor = ''; }, 1500);
      return;
    }

    // GA4 event
    if (typeof gtag === 'function') {
      gtag('event', 'tool_use', { tool_name: 'domain_analyzer' });
    }

    renderResults(analysis);

    // Scroll results into view
    document.getElementById('results-area').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const domainInput = document.getElementById('domain-input');

    analyzeBtn.addEventListener('click', runAnalysis);

    domainInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runAnalysis();
    });

    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        domainInput.value = btn.getAttribute('data-domain');
        runAnalysis();
      });
    });
  });
})();
