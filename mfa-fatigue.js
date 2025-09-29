// /assets/js/mfa-fatigue.js
(() => {
  'use strict';

  // --- State (no globals) ---
  const state = {
    active: false,
    round: 0,
    totalRounds: 3,
    timerId: null,
    remaining: 45,
  };

  // --- Elements (IDs referenced below must exist in the HTML) ---
  const el = {
    startBtn: null,
    timer: null,
    choices: null,
    log: null,
  };

  function setActive(on) {
    state.active = on;
    document.body.dataset.drillActive = on ? '1' : '0';
  }

  function updateTimer() {
    if (!el.timer) return;
    const s = Math.max(0, state.remaining);
    el.timer.textContent = `00:${String(s).padStart(2, '0')}`;
  }

  function stopTimer() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = null;
  }

  function startCountdown(seconds = 45) {
    stopTimer();
    state.remaining = seconds;
    updateTimer();
    state.timerId = setInterval(() => {
      state.remaining -= 1;
      updateTimer();
      if (state.remaining <= 0) {
        endDrill('⏰ Time is up.');
      }
    }, 1000);
  }

  function log(msg) {
    if (!el.log) return;
    const p = document.createElement('p');
    p.textContent = msg;
    el.log.appendChild(p);
  }

  function nextPrompt() {
    state.round += 1;
    if (state.round > state.totalRounds) {
      endDrill('✅ Drill complete.');
      return;
    }
    // You can update the UI here to show the next fake push, etc.
    log(`Prompt ${state.round} incoming…`);
  }

  function startDrill() {
    if (state.active) return;
    setActive(true);
    state.round = 0;
    el.log && (el.log.innerHTML = '');
    log('▶️ Drill started. Make the safest choices quickly.');
    startCountdown(45);
    nextPrompt();
  }

  function endDrill(reason = '⏹ Drill ended.') {
    stopTimer();
    setActive(false);
    log(reason);
  }

  function handleChoiceClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    if (!state.active) {
      // Don’t throw — guide the user instead
      log('ℹ️ Press “Start Drill” first.');
      return;
    }

    const action = btn.dataset.action; // e.g., approve / deny / deny-reset / deny-report
    log(`You chose: ${btn.textContent.trim()}`);

    // TODO: score or branch by action here if desired
    nextPrompt();
  }

  // Wire up after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    el.startBtn = document.getElementById('startDrillBtn');
    el.timer    = document.getElementById('countdown');
    el.choices  = document.getElementById('choices');
    el.log      = document.getElementById('responseLog');

    el.startBtn && el.startBtn.addEventListener('click', startDrill);
    el.choices  && el.choices.addEventListener('click', handleChoiceClick);

    // Initial timer text
    updateTimer();
  });
})();
