const levels = [
  {
    id: 'level1',
    title: 'Level 1: Spot the Phishy Email',
    badge: 'Beginner',
    description: 'Read the message carefully and decide the safest next step.',
    scenario: `
      <p><strong>Subject:</strong> Security Alert - Immediate Action Required</p>
      <p><strong>From:</strong> TrustPay Support <code>account-security@support-paypai.com</code></p>
      <p>
        "We noticed suspicious activity on your account. Your access will be
        suspended within <strong>12 minutes</strong> unless you verify your
        identity."
      </p>
      <p><strong>Link preview:</strong> <code>http://trustpay-verify-info.com/login</code></p>
    `,
    options: [
      {
        id: 'a',
        text: 'Click the link right away before the timer runs out.',
        isCorrect: false,
        feedback:
          'Scammers often manufacture urgency so you act before thinking. Slow down and verify first.',
      },
      {
        id: 'b',
        text: 'Report the email as phishing, then navigate to TrustPay from a saved bookmark to double-check your account.',
        isCorrect: true,
        feedback:
          'Perfect! Reporting and visiting the official site yourself keeps attackers out of your account.',
      },
      {
        id: 'c',
        text: 'Forward the email to coworkers to warn them of the attack.',
        isCorrect: false,
        feedback:
          'Forwarding spreads the malicious link. Use your organization\'s reporting button instead.',
      },
    ],
    hint: 'Look closely at the sender address and the countdown timer.',
    points: 120,
    explanation:
      'Phishing emails impersonate brands and pressure you with fake deadlines. Always inspect addresses and visit the site through your own trusted bookmark.',
  },
  {
    id: 'level2',
    title: 'Level 2: Link Laboratory',
    badge: 'Apprentice',
    description: 'Hovering or tapping links tells you where you will really land.',
    scenario: `
      <p>
        You receive a chat message: "Here is the secure payroll update portal"
        with a shortened link <code>https://tinyurl.com/payroll2024</code>.
      </p>
      <button class="reveal-button" data-action="reveal-link">
        Reveal destination URL
      </button>
      <span class="reveal-output" data-output></span>
    `,
    options: [
      {
        id: 'a',
        text: 'Open the link in a private browser window. Private mode will block malware.',
        isCorrect: false,
        feedback:
          'Private mode hides history but does not block malicious sites. You could still give up credentials.',
      },
      {
        id: 'b',
        text: 'Use a link expander or hover preview to confirm the destination before deciding.',
        isCorrect: true,
        feedback:
          'Exactly. Expanding the URL shows the real destination so you can judge if it is trustworthy.',
      },
      {
        id: 'c',
        text: 'Ignore the message because all shortened links are scams.',
        isCorrect: false,
        feedback:
          'Some legitimate services use short links. Instead of ignoring everything, verify where it leads.',
      },
    ],
    hint: 'Tools like checkshorturl.com can show you the true destination of a short link.',
    points: 140,
    explanation:
      'Before you click, preview the full URL. Check for misspellings, odd domains, or unexpected redirects.',
  },
  {
    id: 'level3',
    title: 'Level 3: Smishing Showdown',
    badge: 'Defender',
    description: 'Text messages can phish too. Recognize the traps.',
    scenario: `
      <p>
        SMS from "Bank Notice": "Unusual withdrawal detected. Reply YES to
        freeze account or call 1-800-555-0101 to speak with security now."
      </p>
      <ul class="timeline">
        <li>Unsolicited alert, high-pressure instructions</li>
        <li>Phone number not listed on your debit card or the bank website</li>
        <li>Requests sensitive action through a text reply</li>
      </ul>
    `,
    options: [
      {
        id: 'a',
        text: 'Call the number in the text immediately to keep your money safe.',
        isCorrect: false,
        feedback:
          'Attackers set up fake call centers. Use the phone number printed on your bank card instead.',
      },
      {
        id: 'b',
        text: 'Reply YES so the scammer knows you are alert and leaves you alone.',
        isCorrect: false,
        feedback:
          'Replying confirms your phone number is active and can trigger more scams.',
      },
      {
        id: 'c',
        text: 'Do not reply. Contact the bank through the number saved in your contacts to confirm.',
        isCorrect: true,
        feedback:
          'Nice! Verifying with an official channel keeps control in your hands.',
      },
    ],
    hint: 'Legitimate banks rarely demand instant replies via text. Contact them through a trusted number.',
    points: 160,
    explanation:
      'Smishing relies on urgency. Disconnect from the message and re-establish contact on your own terms.',
  },
  {
    id: 'level4',
    title: 'Level 4: Inbox Boss Battle',
    badge: 'Phish Fighter',
    description: 'Apply everything you learned to a layered phishing attempt.',
    scenario: `
      <p>
        You are asked to approve an invoice for a vendor. The sender is your
        "CEO" with an email of <code>ceo-office@company-leadership.net</code>.
        There is an attached PDF labeled <strong>Invoice_Q3.zip</strong>.
      </p>
      <p>
        The message says the CEO needs this paid in the next 10 minutes while
        they are boarding a flight and cannot talk.
      </p>
    `,
    options: [
      {
        id: 'a',
        text: 'Open the attachment and skim it. It is faster than bothering anyone else.',
        isCorrect: false,
        feedback:
          'Zip attachments can hide malware. Opening without verifying could compromise your device.',
      },
      {
        id: 'b',
        text: 'Call the CEO using the number you already have to verify the request before acting.',
        isCorrect: true,
        feedback:
          'Well played! Verification through a separate, trusted channel defeats most business email compromise scams.',
      },
      {
        id: 'c',
        text: 'Send the payment. Executives expect fast action and you can review later.',
        isCorrect: false,
        feedback:
          'Rushing payments without validation is exactly what attackers want.',
      },
    ],
    hint: 'Spoofed executive requests are common. Slow down and confirm out-of-band.',
    points: 200,
    explanation:
      'Business email compromise attacks rely on trust and urgency. Always verify payment requests with a quick call or message through a known channel.',
  },
];

const levelTitle = document.getElementById('levelTitle');
const levelBadge = document.getElementById('levelBadge');
const levelDescription = document.getElementById('levelDescription');
const scenarioEl = document.getElementById('scenario');
const choicesEl = document.getElementById('choices');
const feedbackEl = document.getElementById('feedback');
const hintButton = document.getElementById('hintButton');
const submitButton = document.getElementById('submitButton');
const progressFill = document.getElementById('progressFill');
const progressLevels = document.getElementById('progressLevels');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const startButton = document.getElementById('startAdventure');
const experienceSection = document.getElementById('experience');
const certificateSection = document.getElementById('certificate');
const certificateStatus = document.getElementById('certificateStatus');
const certificateSection = document.getElementById('certificate');
const participantName = document.getElementById('participantName');
const downloadCertificateButton = document.getElementById('downloadCertificate');
const certificatePreview = document.getElementById('certificatePreview');

let currentLevelIndex = 0;
let selectedOptionId = null;
let score = 0;
let streak = 0;

const STARTING_SCORE = 0;
const INCORRECT_PENALTY = 20;

function initializeProgress() {
  levels.forEach((level, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${level.badge}`;
    li.id = `progress-${level.id}`;
    progressLevels.appendChild(li);
  });
}

function renderLevel(index) {
  const level = levels[index];
  levelTitle.textContent = level.title;
  levelBadge.textContent = level.badge;
  levelDescription.textContent = level.description;
  scenarioEl.innerHTML = level.scenario;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  selectedOptionId = null;
  submitButton.disabled = true;
  submitButton.textContent = index === levels.length - 1 ? 'Lock in answer' : 'Lock in answer';
  submitButton.dataset.state = 'answer';

  choicesEl.innerHTML = '';
  level.options.forEach((option, optionIndex) => {
    const label = document.createElement('label');
    label.className = 'choice';
    label.innerHTML = `
      <input type="radio" name="choice" value="${option.id}" />
      <div>
        <strong>Option ${String.fromCharCode(65 + optionIndex)}</strong>
        <p>${option.text}</p>
      </div>
    `;

    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      selectedOptionId = option.id;
      submitButton.disabled = false;
      choicesEl
        .querySelectorAll('.choice')
        .forEach((choice) => choice.classList.remove('choice--selected'));
      label.classList.add('choice--selected');
    });

    choicesEl.appendChild(label);
  });

  attachScenarioInteractions(level);
  updateCurrentLevelIndicator();
}

function attachScenarioInteractions(level) {
  const revealButton = scenarioEl.querySelector('[data-action="reveal-link"]');
  if (revealButton) {
    const output = scenarioEl.querySelector('[data-output]');
    revealButton.addEventListener('click', () => {
      output.textContent = 'Revealed URL: https://malicious-payroll-login.netlify.app';
      output.style.color = '#f97316';
      revealButton.disabled = true;
      revealButton.textContent = 'Link revealed';
    });
  }
}

function updateProgress() {
  const completed = progressLevels.querySelectorAll('.completed').length;
  const total = levels.length;
  const percent = Math.round((completed / total) * 100);
  progressFill.style.width = `${percent}%`;
}

function updateCurrentLevelIndicator() {
  Array.from(progressLevels.children).forEach((item, index) => {
    const isCurrent = index === currentLevelIndex;
    item.classList.toggle('current', isCurrent);
    if (isCurrent) {
      item.setAttribute('aria-current', 'step');
    } else {
      item.removeAttribute('aria-current');
    }
  });
}

function handleAnswer() {
  if (!selectedOptionId) return;

  const level = levels[currentLevelIndex];
  const choice = level.options.find((option) => option.id === selectedOptionId);
  if (!choice) return;

  if (choice.isCorrect) {
    streak += 1;
    score += level.points + streak * 10;
    feedbackEl.textContent = `✅ ${choice.feedback} ${level.explanation}`;
    feedbackEl.className = 'feedback feedback--correct';
    markLevelComplete(level.id);
    submitButton.textContent =
      currentLevelIndex === levels.length - 1 ? 'Claim certificate' : 'Continue to next level';
    submitButton.dataset.state = 'next';
    hintButton.disabled = true;
  } else {
    streak = 0;
    score = Math.max(STARTING_SCORE, score - INCORRECT_PENALTY);
    feedbackEl.textContent = `⚠️ ${choice.feedback}`;
    feedbackEl.className = 'feedback feedback--incorrect';
  }

  updateScoreboard();
}

function markLevelComplete(levelId) {
  const li = document.getElementById(`progress-${levelId}`);
  li?.classList.add('completed');
  updateProgress();
}

function goToNextLevel() {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex += 1;
    hintButton.disabled = false;
    renderLevel(currentLevelIndex);
    experienceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: document.querySelector('.container').offsetTop - 40, behavior: 'smooth' });
  } else {
    showCertificate();
  }
}

function updateScoreboard() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
}

function showHint() {
  const level = levels[currentLevelIndex];
  feedbackEl.textContent = `💡 Hint: ${level.hint}`;
  feedbackEl.className = 'feedback feedback--hint';
}

function showCertificate() {
  certificateSection.hidden = false;
  document.getElementById(`progress-${levels[currentLevelIndex].id}`)?.classList.add('completed');
  updateProgress();
  updateCertificatePreview(getCertificateName());
  progressLevels.querySelectorAll('.current').forEach((item) =>
    item.classList.remove('current')
  );
  certificateSection.classList.add('certificate--unlocked');
  certificateStatus.textContent =
    "Unlocked — you're officially a Cyber Hygiene Pro!";
  certificateStatus.classList.add('certificate__status--unlocked');
  certificateSection.scrollIntoView({ behavior: 'smooth' });
}

function getCertificateName() {
  return participantName.value.trim() || 'Cyber Defender';
}

function updateCertificatePreview(name) {
  certificatePreview.innerHTML = '';
  const template = document.getElementById('certificateTemplate');
  const clone = template.content.cloneNode(true);
  clone.querySelector('[data-field="name"]').textContent = name;
  clone.querySelector('[data-field="date"]').textContent = new Date().toLocaleDateString();
  certificatePreview.appendChild(clone);
}

function openCertificateWindow(name) {
  const date = new Date().toLocaleDateString();
  const certificateWindow = window.open('', '_blank', 'width=900,height=700');
  if (!certificateWindow) {
    alert('Please allow pop-ups to download your certificate.');
    return;
  }

  certificateWindow.document.write(`
    <html>
      <head>
        <title>Cyber Hygiene Certificate</title>
        <style>
          body {
            font-family: 'Montserrat', 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e0f2fe;
            margin: 0;
            height: 100vh;
          }
          .sheet {
            width: 760px;
            border: 12px solid #38bdf8;
            padding: 3rem 2.5rem;
            text-align: center;
            background: #f8fafc;
            color: #0f172a;
            border-radius: 1rem;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
          }
          h1 {
            margin: 0 0 1rem;
            font-size: 2.6rem;
            letter-spacing: 0.05em;
          }
          h2 {
            margin: 1.5rem 0 0.5rem;
            font-size: 2rem;
            color: #0284c7;
          }
          p {
            font-size: 1.1rem;
            line-height: 1.6;
          }
          .footer {
            margin-top: 2.5rem;
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <h1>Cyber Hygiene Certificate</h1>
          <p>This certifies that</p>
          <h2>${name}</h2>
          <p>
            has successfully completed the Just for Phishing training journey
            and demonstrated a commitment to safe cyber practices.
          </p>
          <div class="footer">
            <span>Technology Readiness Team</span>
            <span>${date}</span>
          </div>
        </div>
      </body>
    </html>
  `);
  certificateWindow.document.close();
  certificateWindow.focus();
  certificateWindow.print();
}

submitButton.addEventListener('click', () => {
  if (submitButton.dataset.state === 'next') {
    goToNextLevel();
    return;
  }
  handleAnswer();
});

hintButton.addEventListener('click', showHint);

startButton.addEventListener('click', () => {
  experienceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
});

participantName.addEventListener('input', () => {
  updateCertificatePreview(getCertificateName());
});

downloadCertificateButton.addEventListener('click', () => {
  const name = getCertificateName();
  openCertificateWindow(name);
});

initializeProgress();
renderLevel(currentLevelIndex);
updateScoreboard();
updateCertificatePreview(getCertificateName());
