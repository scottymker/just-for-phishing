// mfa-fatigue.js
(() => {
  'use strict';

  const state = {
    active: false,
    round: 0,
    totalRounds: 3,
    remaining: 45,
    timerId: null,
    correct: 0,
    answered: 0,
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
        endDrill('Time is up.');
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
      endDrill('Drill complete.');
      return;
    }
    pushNotification(`Login request #${state.round} • Unknown device near Dallas, TX`);
    setFeedback('Pick the safest response.');
  }

  function startDrill() {
    if (state.active) return;
    window.JFPAnalytics?.trackModuleStart('mfa_fatigue_drill');
    setActive(true);
    state.round = 0;
    state.correct = 0;
    state.answered = 0;
    el.eventLog.innerHTML = '';
    el.summary.classList.add('hidden');
    clearNotifications();
    setScore(0, 0);
    logEvent('Drill started.');
    setFeedback('You have 45 seconds. Make safe choices quickly.');
    startCountdown(45);
    nextPrompt();
  }

  function endDrill(reason) {
    const correct = state.correct;
    const total = state.answered || state.totalRounds;
    window.JFPAnalytics?.trackModuleComplete('mfa_fatigue_drill', {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      timedOut: reason.includes('Time'),
    });
    stopTimer();
    setActive(false);
    setFeedback(reason);
    el.summary.textContent = reason;
    el.summary.classList.remove('hidden');

    try {
      const progress = JSON.parse(localStorage.getItem('phishing-training-progress') || '{}');
      progress.mfaFatigue = {
        completed: true,
        score: correct,
        total,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem('phishing-training-progress', JSON.stringify(progress));
    } catch (_e) {}
  }

  function handleActionClick(e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    if (!state.active) {
      logEvent('Press “Start Drill” first.');
      setFeedback('Press “Start Drill” to begin.');
      return;
    }

    const action = btn.dataset.action;
    const safe = action === 'deny' || action === 'deny-reset' || action === 'deny-report';

    state.answered += 1;
    if (safe) state.correct += 1;
    setScore(state.correct, state.answered);
    logEvent(`You chose: ${btn.textContent.trim()}`);
    if (action === 'approve') {
      pushNotification('Account at risk! Approving unexpected prompts is unsafe.');
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
