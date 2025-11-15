// mfa-fatigue.js
(() => {
  'use strict';

  const state = {
    active: false,
    round: 0,
    totalRounds: 3,
    remaining: 45,
    timerId: null,
  };

  const el = {};

  const ACTIONS = [
    { key: 'approve', label: 'Approve Request' },
    { key: 'deny', label: 'Deny Only' },
    { key: 'deny-reset', label: 'Deny + Reset Password' },
    { key: 'deny-report', label: 'Deny + Report to Security' },
  ];

  function $(id) { return document.getElementById(id); }

  function setActive(on) {
    state.active = on;
    document.body.dataset.drillActive = on ? '1' : '0';
  }

  function updateTimer() {
    const s = Math.max(0, state.remaining);
    el.countdown.textContent = `00:${String(s).padStart(2, '0')}`;
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

  function logEvent(msg) {
    const d = document.createElement('div');
    d.className = 'event-log-entry';
    d.textContent = msg;
    el.eventLog.appendChild(d);
    el.eventLog.scrollTop = el.eventLog.scrollHeight;
  }

  function setFeedback(msg) {
    el.feedback.textContent = msg;
  }

  function setScore(current, total) {
    el.score.textContent = current;
    el.total.textContent = total;
  }

  function clearNotifications() {
    el.notificationStack.innerHTML = '';
  }

  function pushNotification(text) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = text;
    el.notificationStack.prepend(n);
  }

  function nextPrompt() {
    state.round += 1;
    if (state.round > state.totalRounds) {
      endDrill('✅ Drill complete.');
      return;
    }
    pushNotification(`Login request #${state.round} • Unknown device near Dallas, TX`);
    setFeedback('Pick the safest response.');
  }

  function startDrill() {
    if (state.active) return;
    setActive(true);
    state.round = 0;
    el.eventLog.innerHTML = '';
    el.summary.classList.add('hidden');
    clearNotifications();
    setScore(0, 0);
    logEvent('▶️ Drill started.');
    setFeedback('You have 45 seconds. Make safe choices quickly.');
    startCountdown(45);
    nextPrompt();
  }

  function endDrill(reason) {
    stopTimer();
    setActive(false);
    setFeedback(reason);
    el.summary.textContent = reason;
    el.summary.classList.remove('hidden');
  }

  function handleActionClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    if (!state.active) {
      logEvent('ℹ️ Press “Start Drill” first.');
      setFeedback('Press “Start Drill” to begin.');
      return;
    }

    const action = btn.dataset.action;
    // naive scoring: safe choices are any "deny*"
    const safe = action === 'deny' || action === 'deny-reset' || action === 'deny-report';
    const cur = Number(el.score.textContent);
    const tot = Number(el.total.textContent);

    setScore(cur + (safe ? 1 : 0), Math.max(tot + 1, state.round)); // keep it simple
    logEvent(`You chose: ${btn.textContent.trim()}`);
    if (action === 'approve') {
      pushNotification('⚠️ Account at risk! Approving unexpected prompts is unsafe.');
    }
    nextPrompt();
  }

  function renderActions() {
    el.actions.innerHTML = '';
    ACTIONS.forEach(a => {
      const b = document.createElement('button');
      b.className = 'action-btn';
      b.type = 'button';
      b.dataset.action = a.key;
      b.textContent = a.label;
      el.actions.appendChild(b);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    el.start     = $('start-drill');
    el.countdown = $('countdown');
    el.actions   = $('action-buttons');
    el.feedback  = $('feedback');
    el.eventLog  = $('event-log');
    el.summary   = $('summary');
    el.notificationStack = $('notification-stack');
    el.score     = $('score');
    el.total     = $('total');

    // Only render action buttons if element exists (legacy support)
    if (el.actions) {
      renderActions();
      el.actions.addEventListener('click', handleActionClick);
    }

    updateTimer();
    el.start.addEventListener('click', startDrill);
  });
})();
