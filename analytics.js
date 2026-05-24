// GA4 event helpers for Just For Phishing.
// Keeps learner progress local while sending aggregate, non-identifying usage events.
(() => {
  'use strict';

  const SCORE_BUCKETS = [
    { min: 100, label: '100' },
    { min: 80, label: '80-99' },
    { min: 60, label: '60-79' },
    { min: 40, label: '40-59' },
    { min: 0, label: '0-39' },
  ];

  function pageName() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.replace(/\.html$/, '') || 'home';
  }

  function scoreBucket(scorePercent) {
    const numericScore = Number(scorePercent) || 0;
    const bucket = SCORE_BUCKETS.find((entry) => numericScore >= entry.min);
    return bucket ? bucket.label : 'unknown';
  }

  function sendEvent(name, params = {}) {
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', name, {
      page_name: pageName(),
      ...params,
    });
  }

  function trackModuleStart(moduleName) {
    sendEvent('module_start', {
      module_name: moduleName,
    });
  }

  function trackModuleComplete(moduleName, details = {}) {
    const total = Number(details.total) || 0;
    const correct = Number(details.correct ?? details.score) || 0;
    const scorePercent = Number.isFinite(Number(details.percentage))
      ? Number(details.percentage)
      : total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    sendEvent('module_complete', {
      module_name: moduleName,
      score_percent: scorePercent,
      score_bucket: scoreBucket(scorePercent),
      correct_count: correct,
      total_count: total,
      timed_out: Boolean(details.timedOut),
    });
  }

  function trackCtaClick(label, url) {
    sendEvent('cta_click', {
      link_text: label || 'unknown',
      link_url: url || '',
    });
  }

  function classifyLink(anchor) {
    const href = anchor.getAttribute('href') || '';
    const text = (anchor.textContent || anchor.getAttribute('aria-label') || '').trim().slice(0, 80);

    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return null;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (_e) {
      return null;
    }

    const isOutbound = url.origin !== window.location.origin;
    const looksLikeCta = anchor.classList.contains('btn')
      || anchor.className.toString().includes('cta')
      || /start|begin|lab|quiz|training|module|resource|github|contact|download/i.test(text);

    if (isOutbound) {
      return { eventName: 'outbound_click', text, url: url.href };
    }

    if (looksLikeCta) {
      return { eventName: 'cta_click', text, url: url.href };
    }

    return null;
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;

    const link = classifyLink(anchor);
    if (!link) return;

    sendEvent(link.eventName, {
      link_text: link.text || 'unknown',
      link_url: link.url,
    });
  }, { capture: true });

  window.JFPAnalytics = {
    sendEvent,
    trackModuleStart,
    trackModuleComplete,
    trackCtaClick,
    scoreBucket,
  };
})();
