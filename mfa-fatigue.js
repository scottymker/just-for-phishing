const countdownEl = document.getElementById('countdown');
const startBtn = document.getElementById('start-drill');
const notificationStack = document.getElementById('notification-stack');
const feedbackEl = document.getElementById('feedback');
const eventLog = document.getElementById('event-log');
const summaryEl = document.getElementById('summary');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const statusTimeEl = document.getElementById('status-time');
const actionButtonsContainer = document.getElementById('action-buttons');

const DRILL_DURATION = 45; // seconds
const PROMPT_RESP_WINDOW_DEFAULT = 12; // seconds

const ACTIONS = [
  {
    id: 'approve',
    label: 'Approve Request',
    description: 'Accept the push even if you were not expecting it.',
    variant: 'danger'
  },
  {
    id: 'deny',
    label: 'Deny Only',
    description: 'Block this prompt and move on without telling security.'
  },
  {
    id: 'deny-reset',
    label: 'Deny + Reset Password',
    description: 'Reject the request and immediately change your password.'
  },
  {
    id: 'deny-report',
    label: 'Deny + Report to Security',
    description: 'Reject the push and alert your security team to investigate.'
  }
];

const PROMPTS = [
  {
    provider: 'Duo Security',
    title: 'Payroll Portal login request',
    request: 'Approve login for payroll.internal.company',
    device: 'Windows 10 · Chrome',
    location: 'Lagos, Nigeria',
    context:
      'You are in New York, off duty. This is the third push in two minutes and you did not initiate it.',
    correct: 'deny-report',
    window: 12,
    success:
      'Exactly right — deny it and escalate so the SOC can cut off the attacker and watch for reuse.',
    failure:
      'Simply denying lets the attacker keep hammering you. Report it so security can intervene.',
    timeout:
      'The attacker kept spamming pushes. Deny and alert security immediately so they can lock it down.'
  },
  {
    provider: 'Microsoft Authenticator',
    title: 'Office 365 sign-in',
    request: 'Approve sign-in request for OneDrive',
    device: 'Pixel 7 · Microsoft Edge',
    location: 'Unknown VPN (RU)',
    context:
      'This is the fifth push in a row. Your password is likely compromised from a password reuse attack.',
    correct: 'deny-reset',
    window: 11,
    success:
      'Great call. Denying and resetting your password breaks the attacker’s access.',
    failure:
      'Without a reset the attacker still knows your password and can keep hammering other systems.',
    timeout:
      'Delaying gives the attacker more time to succeed. Deny it and reset immediately.'
  },
  {
    provider: 'Okta Verify',
    title: 'ServiceNow access request',
    request: 'Approve sign-on to servicenow.company.com',
    device: 'iPadOS 16 · Safari',
    location: 'Los Angeles, CA',
    context:
      'It’s 2:12 AM in Chicago where you are located. No maintenance was scheduled tonight.',
    correct: 'deny-report',
    window: 10,
    success:
      'Exactly — deny and report so security can monitor for related activity and block the source.',
    failure:
      'Unreported push attacks leave defenders blind. Always escalate suspicious bursts.',
    timeout:
      'Push fatigue is the goal. Respond quickly so you can deny and report unexpected attempts.'
  }
];

totalEl.textContent = PROMPTS.length;

const actionLookup = new Map();
ACTIONS.forEach((action) => {
  const btn = document.createElement('button');
  btn.className = 'action-button';
  btn.type = 'button';
  btn.innerHTML = `<strong>${action.label}</strong><br><span>${action.description}</span>`;
  if (action.variant) {
    btn.dataset.variant = action.variant;
  }
  btn.addEventListener('click', () => handleAction(action.id));
  actionButtonsContainer.appendChild(btn);
  actionLookup.set(action.id, { ...action, button: btn });
});

defaultState();
updateStatusClock();
setInterval(updateStatusClock, 60000);

function startDrill() {
  if (drillActive) {
    return;
  }
  drillActive = true;
  score = 0;
  timeLeft = DRILL_DURATION;
  updateCountdown();
  countdownEl.classList.remove('countdown--warning', 'countdown--danger');
  scoreEl.textContent = score;

  feedbackEl.textContent = 'Push incoming — stay sharp and read every detail.';
  feedbackEl.classList.remove('success', 'error');
  summaryEl.classList.add('hidden');
  summaryEl.textContent = '';
  eventLog.innerHTML = '';
  notificationStack.innerHTML = '';
  awaitingResponse = false;
  activePrompt = null;

  startBtn.textContent = 'Drill in progress';
  startBtn.disabled = true;

  if (countdownTimerId) {
    clearInterval(countdownTimerId);
  }
  countdownTimerId = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft <= 20) {
      countdownEl.classList.add('countdown--warning');
    }
    if (timeLeft <= 10) {
      countdownEl.classList.add('countdown--danger');
    }
    if (timeLeft <= 0) {
      timeLeft = 0;
      updateCountdown();
      finishDrill('time');
      return;
    }
    updateCountdown();
    updateStatusClock();
  }, 1000);

  updateCountdown();
  updateStatusClock();
  queuePrompt(0);
}

function queuePrompt(index) {
  if (!drillActive) {
    return;
  }
  if (index >= PROMPTS.length) {
    finishDrill('complete');
    return;
  }

  const prompt = PROMPTS[index];
  feedbackEl.classList.remove('success', 'error');
  awaitingResponse = true;

  const existingCards = notificationStack.querySelectorAll('.notification-card');
  existingCards.forEach((card) => card.classList.remove('active'));

  const card = createNotificationCard(prompt, index);
  notificationStack.prepend(card);
  activePrompt = { index, data: prompt, card };

  const timerEl = card.querySelector('[data-role="prompt-timer"]');
  startPromptWindow(prompt.window ?? PROMPT_RESP_WINDOW_DEFAULT, timerEl);

  feedbackEl.textContent = `${prompt.provider} push received — choose the safest action.`;
}

function handleAction(actionId) {
  if (!drillActive || !awaitingResponse || !activePrompt) {
    return;
  }
  const action = actionLookup.get(actionId);
  if (!action) {
    return;
  }

  awaitingResponse = false;
  clearPromptTimers();

  const { data, index, card } = activePrompt;
  const timerEl = card?.querySelector('[data-role="prompt-timer"]');

  const isCorrect = actionId === data.correct;
  if (isCorrect) {
    score += 1;
    scoreEl.textContent = score;
    feedbackEl.textContent = data.success;
    feedbackEl.classList.remove('error');
    feedbackEl.classList.add('success');
    timerEl?.classList.add('resolved');
    if (timerEl) {
      timerEl.textContent = 'Resolved';
    }
  } else {
    feedbackEl.textContent = data.failure;
    feedbackEl.classList.remove('success');
    feedbackEl.classList.add('error');
    timerEl?.classList.add('missed');
    if (timerEl) {
      timerEl.textContent = 'Misstep';
    }
  }

  card?.classList.remove('active');

  logEvent(
    `<strong>${data.provider}</strong> (${data.title}): <em>${action.label}</em><br>${
      isCorrect ? data.success : data.failure
    }`
  );

  const nextIndex = index + 1;
  activePrompt = null;
  setTimeout(() => {
    queuePrompt(nextIndex);
  }, 1400);
}

function handlePromptTimeout() {
  if (!drillActive || !awaitingResponse || !activePrompt) {
    return;
  }
  awaitingResponse = false;
  clearPromptTimers();

  const { data, index, card } = activePrompt;
  const timerEl = card?.querySelector('[data-role="prompt-timer"]');
  timerEl?.classList.add('missed');
  if (timerEl) {
    timerEl.textContent = 'Expired';
  }
  card?.classList.remove('active');

  feedbackEl.textContent = data.timeout;
  feedbackEl.classList.remove('success');
  feedbackEl.classList.add('error');

  logEvent(
    `<strong>${data.provider}</strong> (${data.title}): <em>No response</em><br>${data.timeout}`
  );

  activePrompt = null;
  setTimeout(() => {
    queuePrompt(index + 1);
  }, 1400);
}

function finishDrill(reason) {
  if (!drillActive) {
    return;
  }
  drillActive = false;
  awaitingResponse = false;
  activePrompt = null;
  clearPromptTimers();
  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
  updateCountdown();
  countdownEl.classList.remove('countdown--warning', 'countdown--danger');
  startBtn.textContent = 'Restart Drill';
  startBtn.disabled = false;

  const total = PROMPTS.length;
  let summaryText = '';
  if (reason === 'time') {
    summaryText = `Time! You locked in ${score} of ${total} correct responses before the clock hit zero. Review the log and retry for a perfect run.`;
    feedbackEl.textContent = 'The clock expired while pushes were still firing. Stay decisive and try again for a perfect run.';
    feedbackEl.classList.remove('success');
    feedbackEl.classList.add('error');
  } else if (score === total) {
    summaryText = 'Flawless execution — you denied and escalated every suspicious push. Keep that instinct!';
    feedbackEl.textContent = 'Locked down every attempt. Screenshot this perfect run!';
    feedbackEl.classList.remove('error');
    feedbackEl.classList.add('success');
  } else {
    summaryText = `Drill complete. You selected the safest response for ${score} of ${total} pushes. Review the log to tighten your instincts.`;
    feedbackEl.textContent = 'Drill complete. Study the log for any prompts you missed.';
    feedbackEl.classList.remove('success', 'error');
  }

  summaryEl.textContent = summaryText;
  summaryEl.classList.remove('hidden');
}

function startPromptWindow(windowSeconds, timerEl) {
  clearPromptTimers();
  let secondsRemaining = windowSeconds;
  if (timerEl) {
    timerEl.textContent = formatSeconds(secondsRemaining);
    timerEl.classList.remove('resolved', 'missed');
  }

  promptTickerId = setInterval(() => {
    secondsRemaining -= 1;
    if (secondsRemaining <= 0) {
      if (timerEl) {
        timerEl.textContent = '00:00';
      }
      clearPromptTimers();
      handlePromptTimeout();
      return;
    }
    if (timerEl) {
      timerEl.textContent = formatSeconds(secondsRemaining);
    }
  }, 1000);

  promptTimeoutId = setTimeout(() => {
    handlePromptTimeout();
  }, windowSeconds * 1000);
}

function clearPromptTimers() {
  if (promptTickerId) {
    clearInterval(promptTickerId);
    promptTickerId = null;
  }
  if (promptTimeoutId) {
    clearTimeout(promptTimeoutId);
    promptTimeoutId = null;
  }
}

function updateCountdown() {
  countdownEl.textContent = formatSeconds(timeLeft);
}

function formatSeconds(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = String(Math.floor(safeSeconds / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function logEvent(message) {
  const entry = document.createElement('div');
  entry.className = 'event-log-entry';
  entry.innerHTML = message;
  eventLog.prepend(entry);
}

function createNotificationCard(prompt, index) {
  const card = document.createElement('article');
  card.className = 'notification-card active';
  card.innerHTML = `
    <div class="notification-provider">
      <span>${prompt.provider}</span>
      <span class="prompt-timer" data-role="prompt-timer"></span>
    </div>
    <div class="notification-title">${prompt.title}</div>
    <div class="notification-meta">
      <div><strong>Attempt:</strong> ${index + 1} of ${PROMPTS.length}</div>
      <div><strong>Request:</strong> ${prompt.request}</div>
      <div><strong>Device:</strong> ${prompt.device}</div>
      <div><strong>Location:</strong> ${prompt.location}</div>
    </div>
    <div class="notification-context">${prompt.context}</div>
  `;
  return card;
}

function defaultState() {
  startBtn.disabled = false;
  startBtn.textContent = 'Start Drill';
  scoreEl.textContent = '0';
  timeLeft = DRILL_DURATION;
  countdownEl.textContent = formatSeconds(DRILL_DURATION);
  countdownEl.classList.remove('countdown--warning', 'countdown--danger');
}

function updateStatusClock() {
  if (!statusTimeEl) {
    return;
  }
  const now = new Date();
  statusTimeEl.textContent = now.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
}
