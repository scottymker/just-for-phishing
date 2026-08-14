/**
 * Shared assistive-technology helpers.
 *
 * The training modules re-render whole containers with innerHTML, which both
 * destroys focus and gives a screen reader nothing to announce — a learner
 * would answer a question and hear silence. Rather than sprinkle aria-live on
 * nodes that get replaced, keep one live region that outlives every re-render
 * and write concise messages into it.
 *
 *   JFPA11y.announce('Correct. That was a phishing message.')
 *   JFPA11y.focus(element)   // move focus without adding a tab stop
 */
(function () {
  'use strict';

  var region = null;

  function ensureRegion() {
    if (region && document.body.contains(region)) return region;
    region = document.createElement('div');
    region.className = 'sr-only';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
    return region;
  }

  /**
   * Speak a message. Clearing first and writing on the next frame makes a
   * repeated identical message announce again, which matters when two
   * questions in a row are both "Correct".
   */
  function announce(message) {
    if (!message) return;
    var el = ensureRegion();
    el.textContent = '';
    requestAnimationFrame(function () {
      el.textContent = String(message);
    });
  }

  /**
   * Put focus on a element that is not naturally focusable, without leaving a
   * permanent tab stop behind.
   */
  function focus(target) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return false;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    try {
      el.focus({ preventScroll: false });
    } catch (_e) {
      el.focus();
    }
    return document.activeElement === el;
  }

  /**
   * Disabling the control a keyboard user is standing on drops focus to
   * <body>, which throws them back to the top of the document. Call this
   * instead: it disables the control and hands focus somewhere deliberate.
   */
  function disableAndMoveFocus(control, destination) {
    if (!control) return;
    var hadFocus = document.activeElement === control;
    control.disabled = true;
    if (hadFocus) focus(destination);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureRegion);
  } else {
    ensureRegion();
  }

  window.JFPA11y = {
    announce: announce,
    focus: focus,
    disableAndMoveFocus: disableAndMoveFocus
  };
})();
