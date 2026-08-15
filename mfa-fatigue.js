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

    const verdict = safe
      ? `Safe choice: ${btn.textContent.trim()}.`
      : `Unsafe choice: ${btn.textContent.trim()}. Approving a prompt you did not trigger hands the attacker your account.`;
    window.JFPA11y?.announce(`${verdict} Score ${state.correct} of ${state.answered}.`);

    if (action === 'approve') {
      pushNotification('Account at risk! Approving unexpected prompts is unsafe.');
    }
    nextPrompt();
  }

  function renderActions() {
    // The action buttons persist across rounds today, so this only matters if
    // renderActions() is ever called again mid-drill — but rebuilding the list
    // under a focused button would drop focus to <body>, so carry it over.
    const focusedAction = document.activeElement && document.activeElement.dataset
      ? document.activeElement.dataset.action
      : null;

    el.actions.innerHTML = '';
    ACTIONS.forEach(a => {
      const b = document.createElement('button');
      b.className = 'action-btn';
      b.type = 'button';
      b.dataset.action = a.key;
      b.textContent = a.label;
      el.actions.appendChild(b);
    });

    if (focusedAction) {
      const replacement = el.actions.querySelector(`[data-action="${focusedAction}"]`);
      if (replacement) replacement.focus();
    }
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


/* Phone status-bar clock. Was an inline <script> in mfa-fatigue.html; moved
   here so the Content-Security-Policy does not need 'unsafe-inline'. */
// Update status bar time to current time
function updateStatusTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = String(minutes).padStart(2, '0');
  document.getElementById('status-time').textContent = `${displayHours}:${displayMinutes} ${ampm}`;
}
updateStatusTime();
setInterval(updateStatusTime, 60000); // Update every minute

// Interactive MFA phone notification system
document.addEventListener('DOMContentLoaded', () => {
  const notificationStack = document.getElementById('notification-stack');
  let interactiveMode = false;
  let currentNotificationElement = null;

  // MFA scenarios with educational content
  const MFA_SCENARIOS = [
    {
      location: 'Moscow, Russia',
      device: 'Unknown Windows PC',
      isLegit: false,
      explanation: '✅ Correct! This sign-in attempt from Moscow is highly suspicious. Always DENY unexpected MFA requests from unfamiliar locations.',
      incorrectMsg: '❌ Incorrect. Approving this request from an unfamiliar location (Moscow) could give an attacker access to your account.'
    },
    {
      location: 'San Francisco, CA',
      device: 'iPhone 14',
      isLegit: false,
      explanation: '✅ Correct! Even though the location might seem familiar, if YOU didn\'t initiate this login, always DENY and report it.',
      incorrectMsg: '❌ Incorrect. Never approve an MFA request you didn\'t trigger yourself, even if the location seems reasonable.'
    },
    {
      location: 'Lagos, Nigeria',
      device: 'Unknown Android',
      isLegit: false,
      explanation: '✅ Correct! This is a classic MFA fatigue attack from an unexpected location. Always deny and report suspicious activity.',
      incorrectMsg: '❌ Incorrect. International login attempts you didn\'t initiate are major red flags. Always deny and change your password.'
    }
  ];

  let currentScenarioIndex = 0;
  let score = 0;

  // Intercept pushNotification calls and make them interactive
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.className === 'notification' && node.textContent && !node.querySelector('.notification-header')) {
          makeNotificationInteractive(node);
        }
      });
    });
  });

  function makeNotificationInteractive(node) {
    if (currentScenarioIndex >= MFA_SCENARIOS.length) return;

    const scenario = MFA_SCENARIOS[currentScenarioIndex];
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Create structured interactive notification
    node.innerHTML = `
      <div class="notification-header">
        <div class="notification-icon">🔐</div>
        <div class="notification-app">
          <div class="notification-app-name">Microsoft Authenticator</div>
          <div class="notification-time">now</div>
        </div>
      </div>
      <div class="notification-content">
        <div class="notification-title">Sign-in Attempt</div>
        <div class="notification-meta">
          <div><strong>Location:</strong> ${scenario.location}</div>
          <div><strong>Device:</strong> ${scenario.device}</div>
          <div><strong>Time:</strong> ${time}</div>
        </div>
      </div>
      <div class="notification-actions">
        <button class="notification-btn notification-btn-deny" data-answer="deny">Deny</button>
        <button class="notification-btn notification-btn-approve" data-answer="approve">Approve</button>
      </div>
      <div class="notification-feedback hidden"></div>
    `;

    currentNotificationElement = node;

    // Add click handlers to buttons
    const denyBtn = node.querySelector('[data-answer="deny"]');
    const approveBtn = node.querySelector('[data-answer="approve"]');

    denyBtn.addEventListener('click', () => handleAnswer('deny', node, scenario));
    approveBtn.addEventListener('click', () => handleAnswer('approve', node, scenario));

    // Add active class briefly
    node.classList.add('active');
    setTimeout(() => node.classList.remove('active'), 500);
  }

  function handleAnswer(answer, notificationElement, scenario) {
    const correct = answer === 'deny'; // Deny is always the safe choice
    if (correct) score++;

    // Disable buttons
    const buttons = notificationElement.querySelectorAll('.notification-btn');
    buttons.forEach(btn => btn.disabled = true);

    // Show feedback in notification
    const feedbackEl = notificationElement.querySelector('.notification-feedback');
    feedbackEl.textContent = correct ? scenario.explanation : scenario.incorrectMsg;
    feedbackEl.className = `notification-feedback ${correct ? 'correct' : 'incorrect'}`;
    feedbackEl.classList.remove('hidden');

    // Update external score display
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = currentScenarioIndex + 1;

    // Log event
    const eventLog = document.getElementById('event-log');
    const logEntry = document.createElement('div');
    logEntry.className = 'event-log-entry';
    logEntry.textContent = `${correct ? '✅' : '❌'} ${answer === 'deny' ? 'Denied' : 'Approved'} request from ${scenario.location}`;
    eventLog.appendChild(logEntry);
    eventLog.scrollTop = eventLog.scrollHeight;

    // Move to next scenario after delay
    currentScenarioIndex++;

    if (currentScenarioIndex < MFA_SCENARIOS.length) {
      setTimeout(() => {
        // Clear old notifications to prevent stacking
        notificationStack.innerHTML = '';

        // Create next notification directly
        const nextNotification = document.createElement('div');
        nextNotification.className = 'notification';
        nextNotification.textContent = `Login request #${currentScenarioIndex + 1} • ${MFA_SCENARIOS[currentScenarioIndex].location}`;
        notificationStack.prepend(nextNotification);
      }, 3000);
    } else {
      window.JFPAnalytics?.trackModuleComplete('mfa_fatigue_drill', {
        correct: score,
        total: MFA_SCENARIOS.length,
        percentage: Math.round((score / MFA_SCENARIOS.length) * 100),
      });

      // Drill complete
      setTimeout(() => {
        const feedback = document.getElementById('feedback');
        feedback.textContent = `🎉 Drill Complete! Score: ${score}/${MFA_SCENARIOS.length}`;
        const summary = document.getElementById('summary');
        summary.textContent = `You correctly identified ${score} out of ${MFA_SCENARIOS.length} suspicious MFA requests.`;
        summary.classList.remove('hidden');
      }, 3000);
    }
  }

  observer.observe(notificationStack, { childList: true, subtree: true });
});
  
