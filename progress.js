/**
 * Reads the training progress the modules already write to localStorage and
 * puts it on screen.
 *
 * Every module has been storing results under 'phishing-training-progress'
 * since it shipped, but nothing ever read the key back — so "Progress stays in
 * your browser" was true about the storage and invisible to the learner. This
 * is the reader.
 *
 * Markup contract:
 *   [data-progress-module="<key>"]  a module card; gets a completion badge
 *   [data-progress-summary]          a container; gets the "n of 6" summary
 *   [data-progress-reset]            a button; clears stored progress
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'phishing-training-progress';

  var MODULES = [
    { key: 'securityAwarenessQuiz', name: 'Quick Check' },
    { key: 'phishOrTreat',          name: 'Phish or Treat' },
    { key: 'mfaFatigue',            name: 'MFA Fatigue Drill' },
    { key: 'targetedPhishing',      name: 'Targeted Phishing' },
    { key: 'emailLab',              name: 'Email Phishing Lab' },
    { key: 'smsSmishing',           name: 'SMS Smishing' }
  ];

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (_e) {
      // Private browsing, disabled storage, or corrupt JSON. Treat as empty
      // rather than breaking the page.
      return {};
    }
  }

  /** ISO timestamp in, MM-DD-YYYY out. Storage stays ISO. */
  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return mm + '-' + dd + '-' + d.getFullYear();
  }

  function entryFor(store, key) {
    var e = store[key];
    if (!e || !e.completed) return null;
    return {
      score: Number(e.score) || 0,
      total: Number(e.total) || 0,
      percentage: Number(e.percentage) || 0,
      completedAt: e.completedAt || ''
    };
  }

  function badgeFor(entry) {
    var wrap = document.createElement('div');
    wrap.className = 'progress-badge';
    // Three tiers, but the tier is also stated in the text — never colour alone.
    wrap.classList.add(entry.percentage >= 80 ? 'is-strong'
                     : entry.percentage >= 50 ? 'is-partial'
                     : 'is-weak');

    var mark = document.createElement('span');
    mark.className = 'progress-badge-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✓';

    var text = document.createElement('span');
    text.className = 'progress-badge-text';
    var when = formatDate(entry.completedAt);
    text.textContent = 'Completed — ' + entry.score + '/' + entry.total
      + ' (' + entry.percentage + '%)' + (when ? ' on ' + when : '');

    wrap.appendChild(mark);
    wrap.appendChild(text);
    return wrap;
  }

  function decorateCards(store) {
    document.querySelectorAll('[data-progress-module]').forEach(function (card) {
      var existing = card.querySelector('.progress-badge');
      if (existing) existing.remove();
      card.classList.remove('is-completed');

      var entry = entryFor(store, card.getAttribute('data-progress-module'));
      if (!entry) return;

      card.classList.add('is-completed');
      var slot = card.querySelector('[data-progress-slot]') || card;
      slot.appendChild(badgeFor(entry));
    });
  }

  function renderSummary(store) {
    var host = document.querySelector('[data-progress-summary]');
    if (!host) return;

    var done = MODULES.filter(function (m) { return entryFor(store, m.key); });

    // Nothing stored yet: say so plainly rather than showing an empty shell.
    if (!done.length) {
      host.hidden = true;
      return;
    }
    host.hidden = false;
    host.textContent = '';

    var avg = Math.round(
      done.reduce(function (sum, m) { return sum + entryFor(store, m.key).percentage; }, 0) / done.length
    );

    var heading = document.createElement('p');
    heading.className = 'progress-summary-count';
    heading.textContent = done.length + ' of ' + MODULES.length + ' modules completed';

    var detail = document.createElement('p');
    detail.className = 'progress-summary-detail';
    detail.textContent = 'Average score ' + avg + '%. This is stored in this browser only — '
      + 'it is never sent anywhere, and clearing your browser data removes it.';

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'progress-reset';
    reset.setAttribute('data-progress-reset', '');
    reset.textContent = 'Reset my progress';

    host.appendChild(heading);
    host.appendChild(detail);
    host.appendChild(reset);
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) { /* nothing to clear */ }
    render();
  }

  function render() {
    var store = read();
    decorateCards(store);
    renderSummary(store);
  }

  // Delegated so the reset button works after a re-render replaces it.
  document.addEventListener('click', function (event) {
    var btn = event.target.closest && event.target.closest('[data-progress-reset]');
    if (btn) reset();
  });

  // Another tab finishing a module should update this one.
  window.addEventListener('storage', function (event) {
    if (event.key === STORAGE_KEY) render();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.JFPProgress = {
    modules: MODULES,
    read: read,
    render: render,
    reset: reset,
    formatDate: formatDate
  };
})();
