/**
 * Analytics consent.
 *
 * GA4 used to configure itself on page load, which set cookies before anyone
 * was asked. The privacy policy already described "consent controls" that did
 * not exist; this is them.
 *
 * The gtag stub still loads on every page so calls made before a decision are
 * queued rather than thrown away, but `gtag('config', ...)` — the call that
 * actually starts collection and sets cookies — is held back until consent is
 * granted. Declining leaves the queue unsent.
 *
 * The choice is stored in localStorage under 'jfp-analytics-consent' and can be
 * changed at any time from the Privacy page.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'jfp-analytics-consent';
  var MEASUREMENT_ID = 'G-Y3ZYDHQD6Z';

  function read() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === 'granted' || v === 'denied' ? v : null;
    } catch (_e) {
      // Storage unavailable — treat as undecided and do not start collection.
      return null;
    }
  }

  function write(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_e) { /* nothing we can do; the session stays uncollected */ }
  }

  function startAnalytics() {
    if (typeof window.gtag !== 'function' || window.__jfpAnalyticsStarted) return;
    window.__jfpAnalyticsStarted = true;
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
  }

  function clearAnalyticsCookies() {
    // GA's own cookies are first-party, so we can expire them ourselves rather
    // than leaving them behind after someone opts out.
    var host = location.hostname;
    var domains = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/; domain=' + d;
      });
      document.cookie = name + '=; Max-Age=0; path=/';
    });
  }

  function decide(value, opts) {
    write(value);
    if (value === 'granted') {
      startAnalytics();
    } else {
      window.__jfpAnalyticsStarted = false;
      clearAnalyticsCookies();
    }
    dismissBanner();
    renderPreference();
    if (opts && opts.announce) {
      window.JFPA11y?.announce(value === 'granted'
        ? 'Analytics enabled. Thank you.'
        : 'Analytics declined. Nothing is being collected.');
    }
  }

  /* ── Banner ─────────────────────────────────────────────────────────────── */

  var banner = null;

  function dismissBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function showBanner() {
    if (banner) return;

    banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Analytics choice');

    var text = document.createElement('p');
    text.className = 'consent-text';
    text.innerHTML = 'We’d like to count page views to see which modules are worth building on. '
      + 'No account, no personal data, and your training answers never leave this browser. '
      + '<a href="privacy.html">Read the privacy policy</a>.';

    var actions = document.createElement('div');
    actions.className = 'consent-actions';

    var no = document.createElement('button');
    no.type = 'button';
    no.className = 'consent-btn consent-btn--ghost';
    no.textContent = 'No thanks';
    no.addEventListener('click', function () { decide('denied', { announce: true }); });

    var yes = document.createElement('button');
    yes.type = 'button';
    yes.className = 'consent-btn consent-btn--primary';
    yes.textContent = 'Allow analytics';
    yes.addEventListener('click', function () { decide('granted', { announce: true }); });

    // Decline first in the DOM so the least-committal option is the first stop
    // in the tab order.
    actions.appendChild(no);
    actions.appendChild(yes);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }

  /* ── Preference control (Privacy page) ──────────────────────────────────── */

  function renderPreference() {
    var host = document.querySelector('[data-consent-preference]');
    if (!host) return;

    var current = read();
    host.textContent = '';

    var status = document.createElement('p');
    status.className = 'consent-status';
    status.textContent = current === 'granted'
      ? 'Analytics is currently ON for this browser.'
      : current === 'denied'
        ? 'Analytics is currently OFF for this browser.'
        : 'You have not made a choice yet. Analytics is off until you do.';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'consent-btn ' + (current === 'granted' ? 'consent-btn--ghost' : 'consent-btn--primary');
    btn.textContent = current === 'granted' ? 'Turn analytics off' : 'Turn analytics on';
    btn.addEventListener('click', function () {
      decide(current === 'granted' ? 'denied' : 'granted', { announce: true });
    });

    host.appendChild(status);
    host.appendChild(btn);
  }

  /* ── Boot ───────────────────────────────────────────────────────────────── */

  function init() {
    var choice = read();
    if (choice === 'granted') startAnalytics();
    if (choice === null) showBanner();
    renderPreference();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.JFPConsent = { read: read, decide: decide };
})();
