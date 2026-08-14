// Quiz Configuration
const START_TIME_SECONDS = 180;

// DOM Elements
const timerEl = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const instructionsEl = document.getElementById('instructions');
const progressSection = document.getElementById('progress-section');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const questionCard = document.getElementById('question-card');
const questionNumber = document.getElementById('question-number');
const messageFrom = document.getElementById('message-from');
const messageSubject = document.getElementById('message-subject');
const messagePreview = document.getElementById('message-preview');
const messageDetail = document.getElementById('message-detail');
const phishBtn = document.getElementById('phish-btn');
const treatBtn = document.getElementById('treat-btn');
const feedbackSection = document.getElementById('feedback-section');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackExplanation = document.getElementById('feedback-explanation');
const feedbackInsightsList = document.getElementById('feedback-insights-list');
const feedbackActionText = document.getElementById('feedback-action-text');
const nextBtn = document.getElementById('next-btn');
const summarySection = document.getElementById('summary-section');
const summaryIcon = document.getElementById('summary-icon');
const summaryTitle = document.getElementById('summary-title');
const summaryScore = document.getElementById('summary-score');
const summaryText = document.getElementById('summary-text');
const statCorrect = document.getElementById('stat-correct');
const statAccuracy = document.getElementById('stat-accuracy');
const statTime = document.getElementById('stat-time');
const restartBtn = document.getElementById('restart-btn');

// Scenarios Data
const SCENARIOS = [
  {
    id: 'bonus',
    label: 'Pumpkin Bonus Portal',
    sender: '"PumpkinFest HR" <hr@pumpkinpatchpay.com>',
    subject: 'Last call: confirm your bonus',
    preview:
      'We have a surprise bonus just for you. Log into the payroll portal within 30 minutes or the offer expires! Link: http://bonus-patchpay.com/login',
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
    subject: 'Friday: Event routes & badge reminder',
    preview:
      'Event steps off at 3 PM. Bring your badge for after-hours access and check the official map on the intranet. Reply with your team name for the bracket.',
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
    label: 'Last-Minute Purchase',
    sender: 'CEO <d.moonlight@candorcorp-leadership.com>',
    subject: 'Need 15 e-gift cards before the board call',
    preview:
      "I'm heading into a board meeting and forgot the gift cards. Buy 15 cards and send the codes back quietly. I will reimburse you later tonight.",
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
    label: 'Security Awareness Training',
    sender: 'Security Awareness <training@candorcorp.com>',
    subject: 'Phishing lab — October 31 session',
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
    subject: 'Package stalled: confirm address for delivery',
    preview:
      'Your order is delayed. Open the attached invoice to release the shipment tonight or the package goes back to sender.',
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

// Quiz State
let timeRemaining = START_TIME_SECONDS;
let timerId = null;
let quizActive = false;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = 0;
let untimed = false;

const untimedToggle = document.getElementById('untimed-toggle');
const extendBtn = document.getElementById('extend-btn');

// Format time as MM:SS
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Update timer display and styling
function updateTimer() {
  if (untimed) {
    timerEl.textContent = 'No limit';
    timerEl.classList.remove('warning', 'danger');
    timerEl.classList.add('untimed');
    return;
  }

  timerEl.classList.remove('untimed');
  timerEl.textContent = formatTime(timeRemaining);

  // Update timer color based on time remaining
  timerEl.classList.remove('warning', 'danger');
  if (timeRemaining <= 60 && timeRemaining > 20) {
    timerEl.classList.add('warning');
  } else if (timeRemaining <= 20) {
    timerEl.classList.add('danger');
  }
}

// Timer countdown
function tickCountdown() {
  if (!quizActive || untimed) return;

  if (timeRemaining <= 0) {
    finishQuiz(true); // Auto-finish on timeout
    return;
  }

  timeRemaining -= 1;
  updateTimer();
}

// Update progress bar
function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / SCENARIOS.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${SCENARIOS.length}`;
}

// Display current question
function displayQuestion() {
  const scenario = SCENARIOS[currentQuestionIndex];

  // Update question number
  questionNumber.textContent = `Scenario ${currentQuestionIndex + 1}`;

  // Update message content
  messageFrom.textContent = scenario.sender;
  messageSubject.textContent = scenario.subject;
  messagePreview.textContent = scenario.preview;
  messageDetail.textContent = scenario.detail;

  // Reset buttons
  phishBtn.disabled = false;
  treatBtn.disabled = false;
  phishBtn.classList.remove('selected');
  treatBtn.classList.remove('selected');

  // Update progress
  updateProgress();

  // Show question card, hide feedback and summary
  questionCard.classList.remove('hidden');
  feedbackSection.classList.add('hidden');
  summarySection.classList.add('hidden');
}

// Handle answer selection
function handleAnswer(userAnswer) {
  const scenario = SCENARIOS[currentQuestionIndex];
  const isCorrect = (userAnswer === 'phish' && scenario.isPhish) ||
                    (userAnswer === 'treat' && !scenario.isPhish);

  // Store answer
  userAnswers.push({
    questionIndex: currentQuestionIndex,
    userAnswer,
    isCorrect
  });

  // Disable answer buttons. Doing this while one of them has focus drops
  // focus to <body> and throws a keyboard user back to the top of the page,
  // so show the feedback first and then hand focus to it deliberately.
  showFeedback(scenario, isCorrect);

  phishBtn.disabled = true;
  treatBtn.disabled = true;

  // Hide question card
  questionCard.classList.add('hidden');

  window.JFPA11y?.focus(feedbackTitle);
}

// Show feedback for current question
function showFeedback(scenario, isCorrect) {
  // Set feedback styling
  feedbackSection.classList.remove('correct', 'incorrect');
  feedbackSection.classList.add(isCorrect ? 'correct' : 'incorrect');

  // Set icon and title
  if (isCorrect) {
    feedbackIcon.innerHTML = '<i data-lucide="circle-check" class="icon"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: feedbackIcon.querySelectorAll('[data-lucide]') });
    feedbackTitle.textContent = 'Correct!';
    feedbackExplanation.textContent = scenario.isPhish
      ? 'You correctly identified this as a phishing attempt. Well done!'
      : 'You correctly identified this as a legitimate message. Great work!';
  } else {
    feedbackIcon.innerHTML = '<i data-lucide="circle-x" class="icon"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: feedbackIcon.querySelectorAll('[data-lucide]') });
    feedbackTitle.textContent = 'Incorrect';
    feedbackExplanation.textContent = scenario.isPhish
      ? 'This was actually a phishing attempt. Here\'s what you should look for:'
      : 'This was actually a legitimate message. Here\'s why it\'s safe:';
  }

  // Populate insights
  feedbackInsightsList.innerHTML = scenario.insights
    .map(insight => `<li>${insight}</li>`)
    .join('');

  // Set action text
  feedbackActionText.textContent = scenario.action;

  // Update next button text
  if (currentQuestionIndex < SCENARIOS.length - 1) {
    nextBtn.textContent = 'Next Scenario →';
  } else {
    nextBtn.textContent = 'See Results →';
  }

  // Show feedback section
  feedbackSection.classList.remove('hidden');

  // Say the verdict out loud. The panel below carries the detail; this is the
  // one line that has to land immediately.
  window.JFPA11y?.announce(
    (isCorrect ? 'Correct. ' : 'Incorrect. ') + feedbackExplanation.textContent
  );
}

// Handle next button click
function handleNext() {
  currentQuestionIndex++;

  if (currentQuestionIndex < SCENARIOS.length) {
    // Show next question
    displayQuestion();
    // The Next button we were standing on is now hidden with the feedback
    // panel, so put focus on the new scenario rather than letting it fall to
    // <body> and restart the tab order at the top of the page.
    window.JFPA11y?.focus(questionNumber);
    window.JFPA11y?.announce('Scenario ' + (currentQuestionIndex + 1) + ' of ' + SCENARIOS.length + '. ' + SCENARIOS[currentQuestionIndex].subject);
  } else {
    // Quiz complete
    finishQuiz(false);
  }
}

// Finish quiz and show summary
function finishQuiz(timedOut) {
  quizActive = false;
  clearInterval(timerId);
  timerId = null;

  // Calculate results
  const totalQuestions = SCENARIOS.length;
  const answeredQuestions = userAnswers.length;
  const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
  const accuracy = answeredQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;
  const timeUsed = START_TIME_SECONDS - timeRemaining;

  window.JFPAnalytics?.trackModuleComplete('phish_or_treat', {
    correct: correctAnswers,
    total: totalQuestions,
    percentage: accuracy,
    timedOut,
  });

  // Set summary content
  if (timedOut) {
    summaryIcon.innerHTML = '<i data-lucide="timer" class="icon"></i>';
    summaryTitle.textContent = "Time's Up!";
    summaryText.textContent = `You answered ${answeredQuestions} of ${totalQuestions} questions before time ran out. Review your results below.`;
  } else if (correctAnswers === totalQuestions) {
    summaryIcon.innerHTML = '<i data-lucide="sparkles" class="icon"></i>';
    summaryTitle.textContent = 'Perfect Score!';
    summaryText.textContent = 'Excellent work! You correctly identified all phishing attempts and legitimate messages.';
  } else if (accuracy >= 75) {
    summaryIcon.innerHTML = '<i data-lucide="thumbs-up" class="icon"></i>';
    summaryTitle.textContent = 'Great Job!';
    summaryText.textContent = 'You have a strong understanding of phishing detection. Keep up the good work!';
  } else if (accuracy >= 50) {
    summaryIcon.innerHTML = '<i data-lucide="book-open" class="icon"></i>';
    summaryTitle.textContent = 'Good Effort!';
    summaryText.textContent = 'You\'re on the right track. Review the feedback to improve your phishing detection skills.';
  } else {
    summaryIcon.innerHTML = '<i data-lucide="dumbbell" class="icon"></i>';
    summaryTitle.textContent = 'Keep Learning!';
    summaryText.textContent = 'Phishing detection takes practice. Review the scenarios and try again to improve your skills.';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons({ els: summaryIcon.querySelectorAll('[data-lucide]') });

  // Set score display
  summaryScore.textContent = `${correctAnswers}/${totalQuestions}`;

  // Set stats
  statCorrect.textContent = correctAnswers;
  statAccuracy.textContent = `${accuracy}%`;
  statTime.textContent = formatTime(timeUsed);

  // Hide everything except summary
  instructionsEl.classList.add('hidden');
  progressSection.classList.add('hidden');
  questionCard.classList.add('hidden');
  feedbackSection.classList.add('hidden');
  summarySection.classList.remove('hidden');

  // Finishing hides whatever had focus. Land on the result and read it out —
  // for a timed drill the learner needs to know it ended and why.
  window.JFPA11y?.focus(summaryTitle);
  window.JFPA11y?.announce(
    (timedOut ? 'Time is up. ' : 'Drill complete. ')
    + summaryScore.textContent + '. ' + summaryText.textContent
  );

  try {
    const progress = JSON.parse(localStorage.getItem('phishing-training-progress') || '{}');
    progress.phishOrTreat = {
      completed: !timedOut || answeredQuestions === totalQuestions,
      score: correctAnswers,
      total: totalQuestions,
      percentage: accuracy,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('phishing-training-progress', JSON.stringify(progress));
  } catch (_e) {}
}

// Start the quiz
function startQuiz() {
  window.JFPAnalytics?.trackModuleStart('phish_or_treat');

  // Reset state
  quizActive = true;
  currentQuestionIndex = 0;
  userAnswers = [];
  timeRemaining = START_TIME_SECONDS;
  quizStartTime = Date.now();

  // Update UI
  startBtn.disabled = true;
  startBtn.textContent = 'Quiz In Progress...';
  updateTimer();

  // Hide instructions, show progress and first question
  instructionsEl.classList.add('hidden');
  progressSection.classList.remove('hidden');
  displayQuestion();

  // Start timer
  timerId = setInterval(tickCountdown, 1000);

  // Extending only makes sense once the clock is actually running.
  if (extendBtn) extendBtn.hidden = untimed;
}

// Restart the quiz
function restartQuiz() {
  // Reset UI
  startBtn.disabled = false;
  startBtn.textContent = 'Start Quiz';

  // Show instructions, hide everything else
  instructionsEl.classList.remove('hidden');
  progressSection.classList.add('hidden');
  questionCard.classList.add('hidden');
  feedbackSection.classList.add('hidden');
  summarySection.classList.add('hidden');

  // Reset state
  timeRemaining = START_TIME_SECONDS;
  if (extendBtn) extendBtn.hidden = true;
  updateTimer();
}

// Timer controls. WCAG 2.2 SC 2.2.1 requires a time limit to be adjustable or
// removable; the countdown is the point of this drill, so offer both instead
// of dropping it.
untimedToggle?.addEventListener('change', () => {
  untimed = untimedToggle.checked;
  if (extendBtn) extendBtn.hidden = untimed || !quizActive;
  updateTimer();
  window.JFPA11y?.announce(untimed
    ? 'Timer off. Take as long as you need.'
    : 'Timer on. ' + formatTime(timeRemaining) + ' remaining.');
});

extendBtn?.addEventListener('click', () => {
  timeRemaining += 120;
  updateTimer();
  window.JFPA11y?.announce('Two minutes added. ' + formatTime(timeRemaining) + ' remaining.');
});

// Event Listeners
startBtn?.addEventListener('click', startQuiz);
phishBtn?.addEventListener('click', () => handleAnswer('phish'));
treatBtn?.addEventListener('click', () => handleAnswer('treat'));
nextBtn?.addEventListener('click', handleNext);
restartBtn?.addEventListener('click', restartQuiz);

// Initialize
updateTimer();
