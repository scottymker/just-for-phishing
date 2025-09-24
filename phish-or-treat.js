const START_TIME_SECONDS = 180;
const countdownEl = document.getElementById('challenge-countdown');
const startBtn = document.getElementById('start-challenge');
const form = document.getElementById('challenge-form');
const scenarioList = document.getElementById('scenario-list');
const submitBtn = document.getElementById('submit-challenge');
const progressPill = document.getElementById('progress-pill');
const feedbackEl = document.getElementById('challenge-feedback');
const summaryEl = document.getElementById('challenge-summary');

const SCENARIOS = [
  {
    id: 'bonus',
    label: 'Pumpkin Bonus Portal',
    sender: '"PumpkinFest HR" <hr@pumpkinpatchpay.com>',
    subject: 'Last call: confirm your Halloween bonus',
    preview:
      'We conjured a surprise PumpkinFest bonus just for you. Log into the payroll portal within 30 minutes or the treat evaporates! Link: http://bonus-patchpay.com/login',
    detail: 'Attachment: BonusForm.html',
    isPhish: true,
    action: 'Report the email to security and confirm with HR via the intranet instead of following the link.',
    insights: [
      'The sending domain pumpkinpatchpay.com does not match the company payroll provider.',
      'Time pressure combined with an HTTP link is a classic credential harvest tactic.',
      'HTML attachments are often used to mimic login portals and steal passwords.'
    ]
  },
  {
    id: 'contest',
    label: 'Costume Contest Briefing',
    sender: 'Facilities Team <facilities@candorcorp.com>',
    subject: 'Friday: Costume parade routes & badge reminder',
    preview:
      'Parade steps off at 3 PM. Bring your badge for after-hours access and check the official map on the intranet. Reply with your team name for the bracket.',
    detail: 'Link: https://intranet.candorcorp.com/events/costumes',
    isPhish: false,
    action: 'RSVP through the intranet site and remind teammates to wear badges after hours.',
    insights: [
      'Comes from the verified facilities@candorcorp.com domain you recognize.',
      'Links point to the authenticated intranet over HTTPS, not a look-alike site.',
      'No unexpected attachment or request for sensitive data accompanies the reminder.'
    ]
  },
  {
    id: 'update',
    label: 'Shadowy Patch Alert',
    sender: 'IT Support <alerts@0ffice365-security.com>',
    subject: 'Immediate install required: Outlook Dark Mode Patch',
    preview:
      "A vulnerability in Outlook's Dark Mode was found. Download the patch from the mirror mirror://nightfix.exe and run it before midnight to avoid lockout.",
    detail: 'Mirror link: http://nightfix.exe',
    isPhish: true,
    action: 'Ignore the download, report the message, and install patches only through managed software center.',
    insights: [
      'Sender uses 0ffice365 with a zero instead of the legitimate Microsoft domain.',
      'Executable download links over HTTP are unsafe and bypass corporate deployment.',
      'IT would never threaten lockout for skipping an unofficial patch.'
    ]
  },
  {
    id: 'giftcards',
    label: 'Last-Minute Treats',
    sender: 'CEO <d.moonlight@candorcorp-leadership.com>',
    subject: 'Need 15 e-gift cards before the board call',
    preview:
      "I'm heading into a board meeting and forgot the pumpkin gift cards. Buy 15 cards and send the codes back quietly. I will reimburse you later tonight.",
    detail: 'Marked as High Importance',
    isPhish: true,
    action: 'Call the executive assistant on a trusted number and report the suspicious request immediately.',
    insights: [
      'Spoofed domain candorcorp-leadership.com is not the real corporate domain.',
      'Urgent financial purchase requests are a hallmark of CEO fraud schemes.',
      'Payment instructions request secrecy and reimbursement later, another red flag.'
    ]
  },
  {
    id: 'training',
    label: 'Security Awareness Treat',
    sender: 'Security Awareness <training@candorcorp.com>',
    subject: 'Pumpkin spice phishing lab — October 31 session',
    preview:
      'Reserve your seat for a 20 minute phishing lab. Session will be hosted in the auditorium. Register through LMS and bring a laptop for hands-on practice.',
    detail: 'Link: https://lms.candorcorp.com/course/hauntingsafely',
    isPhish: false,
    action: 'Enroll through the LMS portal and encourage your team to attend the refresher.',
    insights: [
      'Sender and links match the normal corporate training system you already trust.',
      'Encourages sign-up through existing LMS rather than emailing personal data.',
      'Details align with other internal announcements and no scare tactics are used.'
    ]
  },
  {
    id: 'delivery',
    label: 'Night Courier Notice',
    sender: 'Shipping Notice <alerts@jackolantern-logistics.com>',
    subject: 'Package stalled: confirm address for haunted delivery',
    preview:
      'Your costume props are delayed. Open the attached invoice to release the shipment tonight or the props go back to sender.',
    detail: 'Attachment: invoice.zip.js',
    isPhish: true,
    action: 'Do not open the attachment. Report and delete the message, then check your real order history.',
    insights: [
      'Attachment ends in .zip.js indicating a disguised script that could run malware.',
      "Logistics domain is unrelated to the store you ordered from and wasn't expected.",
      'Uses fear of delay to drive an unsafe attachment download.'
    ]
  }
];

let timeRemaining = START_TIME_SECONDS;
let timerId = null;
let challengeActive = false;
let hasSubmitted = false;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function renderScenarios() {
  const cards = SCENARIOS.map((scenario, index) => {
    const radios = `
      <div class="scenario-choice-row">
        <label class="choice-chip">
          <input type="radio" name="scenario-${index}" value="treat" data-index="${index}">
          <span>🍬 Treat</span>
        </label>
        <label class="choice-chip choice-chip--danger">
          <input type="radio" name="scenario-${index}" value="phish" data-index="${index}">
          <span>🎃 Phish</span>
        </label>
      </div>
    `;

    return `
      <article class="scenario-card" data-index="${index}">
        <header class="scenario-header">
          <div class="scenario-label">Case ${index + 1}</div>
          <div class="scenario-tag">${scenario.label}</div>
        </header>
        <div class="scenario-meta">
          <div><strong>From:</strong> ${scenario.sender}</div>
          <div><strong>Subject:</strong> ${scenario.subject}</div>
        </div>
        <p class="scenario-preview">${scenario.preview}</p>
        <p class="scenario-detail">${scenario.detail}</p>
        ${radios}
        <div class="scenario-reveal hidden">
          <p class="reveal-result"></p>
          <ul class="reveal-insights"></ul>
          <p class="reveal-action"></p>
        </div>
      </article>
    `;
  }).join('');

  scenarioList.innerHTML = cards;
}

function resetChallenge() {
  form.reset();
  renderScenarios();
  updateProgress();
  feedbackEl.textContent = 'Identify each message as a phish or treat before time runs out!';
  summaryEl.classList.add('hidden');
  summaryEl.textContent = '';
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit responses';
}

function startChallenge() {
  if (challengeActive) return;
  challengeActive = true;
  hasSubmitted = false;
  timeRemaining = START_TIME_SECONDS;
  countdownEl.textContent = formatTime(timeRemaining);
  countdownEl.classList.remove('countdown--warning', 'countdown--danger');
  startBtn.disabled = true;
  startBtn.textContent = 'Challenge running...';
  resetChallenge();
  tickCountdown();
  timerId = setInterval(tickCountdown, 1000);
}

function tickCountdown() {
  if (!challengeActive) return;
  countdownEl.textContent = formatTime(timeRemaining);

  if (timeRemaining <= 60) {
    countdownEl.classList.add('countdown--warning');
  }
  if (timeRemaining <= 20) {
    countdownEl.classList.add('countdown--danger');
  }

  if (timeRemaining <= 0) {
    finishChallenge(true);
    return;
  }

  timeRemaining -= 1;
}

function updateProgress() {
  if (!progressPill) return;
  const answered = SCENARIOS.reduce((count, _, index) => {
    return count + (form.querySelector(`input[name="scenario-${index}"]:checked`) ? 1 : 0);
  }, 0);
  progressPill.textContent = `${answered}/${SCENARIOS.length} marked`;

  if (challengeActive && !hasSubmitted) {
    if (answered === SCENARIOS.length) {
      feedbackEl.textContent = 'All set! Submit when you are confident in your calls.';
    } else {
      const remaining = SCENARIOS.length - answered;
      feedbackEl.innerHTML = `Keep going — ${remaining} more ${remaining === 1 ? 'message' : 'messages'} to classify.`;
    }
  }
}

function finishChallenge(autoSubmitted = false) {
  if (hasSubmitted) return;
  hasSubmitted = true;
  challengeActive = false;
  clearInterval(timerId);
  timerId = null;

  startBtn.disabled = false;
  startBtn.textContent = 'Restart the challenge';
  submitBtn.disabled = true;
  submitBtn.textContent = autoSubmitted ? 'Time expired' : 'Submitted';

  let score = 0;

  SCENARIOS.forEach((scenario, index) => {
    const choice = form.querySelector(`input[name="scenario-${index}"]:checked`);
    const userAnswer = choice ? choice.value : null;
    const isCorrect = userAnswer === (scenario.isPhish ? 'phish' : 'treat');

    if (isCorrect) score += 1;

    const card = scenarioList.querySelector(`.scenario-card[data-index="${index}"]`);
    if (!card) return;

    card.classList.toggle('scenario-card--correct', isCorrect);
    card.classList.toggle('scenario-card--incorrect', !isCorrect);

    const reveal = card.querySelector('.scenario-reveal');
    if (!reveal) return;

    const resultEl = reveal.querySelector('.reveal-result');
    const insightsList = reveal.querySelector('.reveal-insights');
    const actionEl = reveal.querySelector('.reveal-action');

    if (resultEl) {
      resultEl.textContent = scenario.isPhish
        ? 'It was a phish. Trust your instincts and report!'
        : 'A genuine treat! Still stay vigilant with every click.';
      resultEl.classList.toggle('reveal-result--correct', isCorrect);
      resultEl.classList.toggle('reveal-result--incorrect', !isCorrect);
    }

    if (insightsList) {
      insightsList.innerHTML = scenario.insights.map((item) => `<li>${item}</li>`).join('');
    }

    if (actionEl) {
      actionEl.textContent = scenario.action;
    }

    reveal.classList.remove('hidden');
  });

  const total = SCENARIOS.length;
  const accuracy = Math.round((score / total) * 100);
  const summaryPrefix = autoSubmitted ? "Time's up!" : score === total ? 'Flawless victory!' : 'Challenge complete!';
  summaryEl.textContent = `${summaryPrefix} You spotted ${score} of ${total} correctly (${accuracy}% accuracy).`;
  summaryEl.classList.remove('hidden');
  feedbackEl.textContent = autoSubmitted
    ? 'The moon struck midnight before you finished. Review the reveals to study each clue.'
    : 'Review the reveals to reinforce each clue before trying again.';
}

startBtn?.addEventListener('click', startChallenge);

form?.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  if (event.target.type === 'radio') {
    updateProgress();
  }
});

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!challengeActive) return;
  finishChallenge(false);
});
