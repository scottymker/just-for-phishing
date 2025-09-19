const levels = [
  {
    id: 1,
    stage: 'Beginner',
    title: 'Level 1: Spot the Phishy Email',
    description: 'Read the message carefully and choose the safest response.',
    scenario: `
      <p><strong>Subject:</strong> Security Alert - Immediate Action Required</p>
      <p><strong>From:</strong> TrustPay Support <code>account-security@support-paypai.com</code></p>
      <p>"We noticed suspicious activity on your account. Your access will be suspended within <strong>12 minutes</strong> unless you verify your identity."</p>
      <p><strong>Link preview:</strong> <code>http://trustpay-verify-info.com/login</code></p>
    `,
    choices: [
      {
        id: 'A',
        label: 'Click the link and verify immediately',
        description: 'Avoid losing access by confirming your identity as soon as possible.',
        isCorrect: false,
        feedback: 'The link is a spoofed domain designed to steal your credentials. Real services do not threaten lockouts within minutes.',
      },
      {
        id: 'B',
        label: 'Ignore the message and delete it right away',
        description: 'Suspicious emails should be deleted to avoid any risk.',
        isCorrect: false,
        feedback: 'Deleting is safer than clicking, but it is better to report the message so your security team is aware.',
      },
      {
        id: 'C',
        label: 'Forward the message to a colleague to double-check',
        description: 'Sharing the email could help confirm if it is legitimate.',
        isCorrect: false,
        feedback: 'Forwarding spreads the phishing attempt. Report it instead.',
      },
      {
        id: 'D',
        label: 'Report the email using the phishing button',
        description: 'Use your organization’s phishing reporting tool so the security team can investigate.',
        isCorrect: true,
        feedback: 'Correct! Report the message through the official channel and warn your team.',
      },
    ],
    hint: 'Look for urgency and unfamiliar sender domains in the email.',
    powerUp: 'Unlocked Scam Radar: You can now detect urgent language traps.',
  },
  {
    id: 2,
    stage: 'Apprentice',
    title: 'Level 2: Text Message Trap',
    description: 'Decide how to handle a suspicious text about a package.',
    scenario: `
      <p><strong>SMS:</strong> "Hi! Your package is pending delivery. Please <a href="#">confirm your details</a> to avoid return."</p>
      <p>The link shows <code>http://fast-shipping-confirm.com</code></p>
      <p>You were not expecting any deliveries today.</p>
    `,
    choices: [
      {
        id: 'A',
        label: 'Tap the link to check what package it is',
        description: 'You do not want to miss the delivery.',
        isCorrect: false,
        feedback: 'Never tap unknown links. They can install malware or steal data.',
      },
      {
        id: 'B',
        label: 'Reply asking the courier for more information',
        description: 'Maybe they will identify the package.',
        isCorrect: false,
        feedback: 'Responding confirms your number is active. Phishers thrive on engagement.',
      },
      {
        id: 'C',
        label: 'Ignore the message and block the number',
        description: 'Stops future messages from this sender.',
        isCorrect: true,
        feedback: 'Correct! Block and delete suspicious texts to avoid tapping risky links.',
      },
      {
        id: 'D',
        label: 'Take a screenshot and post it on social media',
        description: 'Warn your friends so they stay alert.',
        isCorrect: false,
        feedback: 'Sharing publicly could expose private info and encourage others to engage.',
      },
    ],
    hint: 'Unexpected requests with unfamiliar links are strong warning signs.',
    powerUp: 'Unlocked SMS Shield: Your phone filters sketchy links like a pro.',
  },
  {
    id: 3,
    stage: 'Challenger',
    title: 'Level 3: Fake Support Call',
    description: 'You receive a call from someone claiming to be IT support.',
    scenario: `
      <p>The caller says, "We detected malware on your laptop. Give me remote access so I can clean it right now."</p>
      <p>They know your full name and department. They sound urgent and ask for your login details.</p>
    `,
    choices: [
      {
        id: 'A',
        label: 'Give the caller remote access right away',
        description: 'They sound official and have your info.',
        isCorrect: false,
        feedback: 'Unverified callers should never receive remote access. It is a classic social engineering trick.',
      },
      {
        id: 'B',
        label: 'Hang up, then call IT using the known internal number',
        description: 'Confirm if the request is legitimate through a trusted channel.',
        isCorrect: true,
        feedback: 'Correct! Always verify by contacting the official help desk through published channels.',
      },
      {
        id: 'C',
        label: 'Ask the caller to email you instructions',
        description: 'Written steps might help confirm the request.',
        isCorrect: false,
        feedback: 'They could send phishing links. Verify first instead of asking for more contact.',
      },
      {
        id: 'D',
        label: 'Do nothing but keep the caller on the line',
        description: 'Maybe you can gather more information from them.',
        isCorrect: false,
        feedback: 'Staying on the line wastes time and they might gather details from you.',
      },
    ],
    hint: 'When in doubt, call back through a verified number before taking action.',
    powerUp: 'Unlocked Voice Barrier: Phone imposters cannot pressure you anymore.',
  },
  {
    id: 4,
    stage: 'Guardian',
    title: 'Level 4: Payroll Change Request',
    description: 'An executive emails payroll asking to update direct deposit details urgently.',
    scenario: `
      <p><strong>From:</strong> "Taylor, CFO" <code>taylor.finance@trustedbiz.co</code></p>
      <p>"Please update my direct deposit info before today’s payroll runs. Use the attached form and confirm once done."</p>
      <p>The email signature looks real, but the reply-to shows <code>taylor.finance@trustedbiz.co-support.com</code></p>
    `,
    choices: [
      {
        id: 'A',
        label: 'Open the attachment and process the update immediately',
        description: 'You do not want to delay an executive request.',
        isCorrect: false,
        feedback: 'Attachments and urgent requests from executives are a common spear-phishing tactic.',
      },
      {
        id: 'B',
        label: 'Reply asking for confirmation from their assistant',
        description: 'Maybe the assistant can confirm the change.',
        isCorrect: false,
        feedback: 'Replying exposes your email and does not confirm legitimacy. Call a known number instead.',
      },
      {
        id: 'C',
        label: 'Call the executive using a known company number before acting',
        description: 'Verify the request through another channel.',
        isCorrect: true,
        feedback: 'Correct! Cross-check unusual requests through trusted channels before making changes.',
      },
      {
        id: 'D',
        label: 'Forward the email to the whole finance team for visibility',
        description: 'Sharing the request could get it done faster.',
        isCorrect: false,
        feedback: 'Forwarding spreads the phishing attempt. Report it through official channels instead.',
      },
    ],
    hint: 'Mismatch between sender and reply-to domains is a serious warning sign.',
    powerUp: 'Unlocked Guardian Badge: You can stop executive impersonation attacks in their tracks.',
  },
];

const progressLevelsList = document.getElementById('progressLevels');
const progressFill = document.getElementById('progressFill');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const powerUpDisplay = document.getElementById('powerUp');

const levelBadge = document.getElementById('levelBadge');
const levelTitle = document.getElementById('levelTitle');
const levelDescription = document.getElementById('levelDescription');
const scenarioElement = document.getElementById('scenario');
const choicesForm = document.getElementById('choices');
const feedbackElement = document.getElementById('feedback');
const hintButton = document.getElementById('hintButton');
const submitButton = document.getElementById('submitButton');

const certificateSection = document.getElementById('certificate');
const certificateStatus = document.getElementById('certificateStatus');
const certificatePreview = document.getElementById('certificatePreview');
const participantNameInput = document.getElementById('participantName');
const downloadCertificateButton = document.getElementById('downloadCertificate');
const certificateTemplate = document.getElementById('certificateTemplate');

const startAdventureButton = document.getElementById('startAdventure');

let currentLevelIndex = 0;
let selectedChoiceId = null;
let score = 0;
let streak = 0;
let hasViewedHint = false;
let completedLevels = new Set();

const SCORE_REWARD = 25;
const SCORE_PENALTY = -5;
const STREAK_BONUS = 10;

function initializeProgress() {
  progressLevelsList.innerHTML = '';
  levels.forEach((level, index) => {
    const li = document.createElement('li');
    li.classList.add('progress__item');
    if (index === currentLevelIndex) {
      li.classList.add('progress__item--active');
    }
    li.dataset.levelId = level.id;

    const title = document.createElement('h4');
    title.textContent = level.title;

    const description = document.createElement('p');
    description.textContent = level.description;

    const status = document.createElement('span');
    status.classList.add('progress__status');
    status.textContent = index === currentLevelIndex ? 'In progress' : 'Locked';

    li.appendChild(title);
    li.appendChild(description);
    li.appendChild(status);
    progressLevelsList.appendChild(li);
  });
}

function updateProgress() {
  const completionPercentage = (completedLevels.size / levels.length) * 100;
  progressFill.style.width = `${completionPercentage}%`;

  progressLevelsList.querySelectorAll('.progress__item').forEach((item, index) => {
    const status = item.querySelector('.progress__status');
    item.classList.remove('progress__item--active', 'progress__item--complete');

    if (completedLevels.has(levels[index].id)) {
      item.classList.add('progress__item--complete');
      status.classList.remove('progress__status--locked');
      status.classList.add('progress__status--complete');
      status.textContent = 'Completed';
    } else if (index === currentLevelIndex) {
      item.classList.add('progress__item--active');
      status.classList.remove('progress__status--locked', 'progress__status--complete');
      status.textContent = 'In progress';
    } else if (index < currentLevelIndex) {
      status.textContent = 'Review available';
      status.classList.remove('progress__status--locked');
    } else {
      status.textContent = 'Locked';
      status.classList.add('progress__status--locked');
    }
  });

  if (completedLevels.size === levels.length) {
    unlockCertificate();
  }
}

function updateScoreboard() {
  scoreDisplay.textContent = score;
  streakDisplay.textContent = streak;
}

function renderLevel(index) {
  const level = levels[index];
  levelBadge.textContent = level.stage;
  levelTitle.textContent = level.title;
  levelDescription.textContent = level.description;
  scenarioElement.innerHTML = level.scenario.trim();

  choicesForm.innerHTML = '';
  selectedChoiceId = null;
  feedbackElement.innerHTML = '';
  feedbackElement.className = 'feedback';
  submitButton.disabled = true;
  hintButton.disabled = false;
  hasViewedHint = false;

  level.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.dataset.choiceId = choice.id;

    const label = document.createElement('div');
    label.className = 'choice__label';

    const icon = document.createElement('div');
    icon.className = 'choice__icon';
    icon.textContent = choice.id;

    const text = document.createElement('span');
    text.textContent = choice.label;

    label.appendChild(icon);
    label.appendChild(text);

    const description = document.createElement('p');
    description.className = 'choice__description';
    description.textContent = choice.description;

    button.appendChild(label);
    button.appendChild(description);

    button.addEventListener('click', () => handleChoiceSelection(choice.id, button));

    choicesForm.appendChild(button);
  });

  powerUpDisplay.textContent =
    completedLevels.has(level.id) || currentLevelIndex > index
      ? level.powerUp
      : 'Earn your first power-up by spotting the scam signals in this email.';
  powerUpDisplay.classList.toggle('power-up--earned', completedLevels.has(level.id));
}

function handleChoiceSelection(choiceId, button) {
  selectedChoiceId = choiceId;
  submitButton.disabled = false;

  choicesForm.querySelectorAll('.choice').forEach((choiceButton) => {
    choiceButton.classList.remove('choice--selected');
  });

  button.classList.add('choice--selected');
}

function showFeedback(result) {
  const level = levels[currentLevelIndex];
  const choice = level.choices.find((c) => c.id === selectedChoiceId);

  feedbackElement.className = 'feedback';
  feedbackElement.classList.add(
    result === 'correct'
      ? 'feedback--positive'
      : result === 'incorrect'
      ? 'feedback--negative'
      : 'feedback--neutral'
  );

  feedbackElement.innerHTML = `
    <p class="feedback__title">${
      result === 'correct' ? 'Nice catch!' : result === 'incorrect' ? 'Not quite.' : 'Hint'
    }</p>
    <p class="feedback__message">${choice ? choice.feedback : level.hint}</p>
  `;
}

function handleSubmission() {
  const level = levels[currentLevelIndex];
  const choice = level.choices.find((c) => c.id === selectedChoiceId);

  if (!choice) {
    showFeedback('neutral');
    return;
  }

  if (choice.isCorrect) {
    score += SCORE_REWARD;
    streak += 1;
    if (streak > 1) {
      score += STREAK_BONUS;
    }
    completedLevels.add(level.id);
    powerUpDisplay.textContent = level.powerUp;
    powerUpDisplay.classList.add('power-up--earned');
    showFeedback('correct');
    submitButton.disabled = true;
    hintButton.disabled = true;
  } else {
    score = Math.max(score + SCORE_PENALTY, 0);
    streak = 0;
    showFeedback('incorrect');
  }

  updateScoreboard();
  updateProgress();
  revealNextLevelButton(choice.isCorrect);
}

function revealNextLevelButton(isCorrect) {
  if (!isCorrect) return;

  const existingButton = document.getElementById('nextLevelButton');
  if (existingButton) {
    existingButton.remove();
  }

  if (currentLevelIndex < levels.length - 1) {
    const button = document.createElement('button');
    button.id = 'nextLevelButton';
    button.className = 'btn btn--primary';
    button.type = 'button';
    button.textContent = 'Continue to next level';
    button.addEventListener('click', () => {
      currentLevelIndex += 1;
      renderLevel(currentLevelIndex);
      updateProgress();
      updateScoreboard();
      button.remove();
    });

    choicesForm.after(button);
  } else {
    const button = document.createElement('button');
    button.id = 'nextLevelButton';
    button.className = 'btn btn--primary';
    button.type = 'button';
    button.textContent = 'Celebrate your mastery';
    button.addEventListener('click', () => {
      document.getElementById('journey').scrollIntoView({ behavior: 'smooth' });
      button.remove();
    });

    choicesForm.after(button);
  }
}

function unlockCertificate() {
  certificateSection.hidden = false;
  certificateStatus.textContent = 'Unlocked — download your Cyber Hygiene Certificate!';
  certificateStatus.classList.add('certificate__status--unlocked');
  downloadCertificateButton.disabled = false;
  renderCertificatePreview();
}

function renderCertificatePreview() {
  certificatePreview.innerHTML = '';
  const name = participantNameInput.value.trim() || 'Ada Lovelace';
  const template = certificateTemplate.content.cloneNode(true);
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  template.querySelector('[data-field="name"]').textContent = name;
  template.querySelector('[data-field="date"]').textContent = today;

  const sheet = template.querySelector('.certificate-sheet');
  certificatePreview.appendChild(sheet);
  certificatePreview.classList.add('certificate__preview--ready');
}

function getCertificateName() {
  return participantNameInput.value.trim() || 'Cyber Defender';
}

function openCertificateWindow(name) {
  const certWindow = window.open('', '_blank', 'width=900,height=650');
  if (!certWindow) {
    alert('Please allow pop-ups to download your certificate.');
    return;
  }

  const template = certificateTemplate.content.cloneNode(true);
  const today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  template.querySelector('[data-field="name"]').textContent = name;
  template.querySelector('[data-field="date"]').textContent = today;

  certWindow.document.write(`
    <html>
      <head>
        <title>Cyber Hygiene Certificate</title>
        <style>
          body {
            margin: 0;
            padding: 2rem;
            font-family: 'Montserrat', 'Segoe UI', sans-serif;
            background: #f1f5f9;
            color: #0f172a;
          }
          .certificate-sheet {
            max-width: 720px;
            margin: 0 auto;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(226, 232, 240, 0.92));
            border-radius: 24px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 40px 80px rgba(15, 23, 42, 0.2);
            border: 1px solid rgba(148, 163, 184, 0.35);
          }
          h1 {
            font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
            font-size: 2.4rem;
            margin-bottom: 1rem;
          }
          h2 {
            font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
            font-size: 2rem;
            margin: 1.5rem 0;
            color: #0ea5e9;
          }
          p {
            font-size: 1.05rem;
            margin: 0.85rem 0;
            color: #334155;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 2.5rem;
            font-weight: 600;
          }
          button {
            margin-top: 2rem;
            padding: 0.85rem 1.75rem;
            border: none;
            border-radius: 999px;
            background: linear-gradient(135deg, #38bdf8, #0ea5e9);
            color: #041021;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        ${template.firstElementChild.outerHTML}
        <div style="text-align:center;">
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>
      </body>
    </html>
  `);
  certWindow.document.close();
}

function handleHint() {
  hasViewedHint = true;
  const level = levels[currentLevelIndex];
  feedbackElement.className = 'feedback feedback--neutral';
  feedbackElement.innerHTML = `
    <p class="feedback__title">Hint</p>
    <p class="feedback__message">${level.hint}</p>
  `;
}

function startJourney() {
  document.getElementById('journey').scrollIntoView({ behavior: 'smooth' });
}

choicesForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

submitButton.addEventListener('click', handleSubmission);
hintButton.addEventListener('click', handleHint);
startAdventureButton.addEventListener('click', startJourney);

participantNameInput.addEventListener('input', () => {
  if (!certificateSection.hidden) {
    renderCertificatePreview();
  }
});

downloadCertificateButton.addEventListener('click', () => {
  const name = getCertificateName();
  openCertificateWindow(name);
});

initializeProgress();
renderLevel(currentLevelIndex);
updateScoreboard();
updateProgress();
