// veteran-scenarios.js - Refactored for one-at-a-time display
(() => {
  'use strict';

  const START_TIME_SECONDS = 600; // 10 minutes
  const countdownEl = document.getElementById('veteran-countdown');
  const startBtn = document.getElementById('start-veteran');
  const scenarioContainer = document.getElementById('veteran-scenario-container');
  const progressEl = document.getElementById('veteran-progress');
  const feedbackEl = document.getElementById('veteran-feedback');
  const summaryEl = document.getElementById('veteran-summary');

  let timeRemaining = START_TIME_SECONDS;
  let timerInterval = null;
  let started = false;
  let currentIndex = 0;
  let userAnswers = {};

  const SCENARIOS = [
    {
      id: 'va-benefits',
      label: 'VA Disability Back-Pay Alert',
      sender: '"VA Benefits Administration" <claims@va-benefits-portal.com>',
      subject: 'URGENT: Unclaimed disability back-pay requires immediate action',
      preview: 'Our records show you have $12,847 in unclaimed disability back-pay from a recent rating increase. Verify your identity and banking information within 72 hours to receive your payment. Click here: http://va-claims-verify.com/backpay',
      detail: 'Attachment: VA_Payment_Form.pdf.exe',
      isPhish: true,
      action: 'Report to VA OIG Hotline and verify any payment issues directly through va.gov or by calling 1-800-827-1000.',
      insights: [
        'Domain "va-benefits-portal.com" is NOT the official VA domain (va.gov).',
        'VA will never ask you to verify banking information via email or suspicious links.',
        'The .exe disguised as a PDF is malware designed to steal credentials and financial information.',
        'Legitimate VA correspondence comes via certified mail for benefit changes, not urgent emails.'
      ]
    },
    {
      id: 'reunion',
      label: 'Unit Reunion Invitation',
      sender: '"SSG Mike Thompson" <mthompson@veteranreunions.net>',
      subject: 'Re: 3rd Battalion Reunion - Nov 15-17, 2025',
      preview: 'Brother, it\'s been too long! We\'re planning the 20-year reunion for 3rd Battalion at Fort Benning. Need you to RSVP and pay the $150 deposit to secure your spot. Limited rooms available. Payment link: http://bit.ly/3batt-reunion',
      detail: 'Mentions names of actual unit members and specific deployment details',
      isPhish: true,
      action: 'Contact unit members directly through verified phone numbers or social media. Never pay via unknown links.',
      insights: [
        'Scammers research unit information from public social media to create convincing scenarios.',
        'The shortened URL (bit.ly) hides the actual destination and is a major red flag.',
        'Legitimate reunion organizers use established military reunion platforms with secure payment.',
        'Playing on military brotherhood and FOMO (fear of missing out) is a common emotional manipulation.'
      ]
    },
    {
      id: 'tricare',
      label: 'TRICARE Enrollment Verification',
      sender: 'TRICARE Support <support@tricare.health.mil>',
      subject: 'Annual TRICARE enrollment verification required',
      preview: 'Your TRICARE coverage requires annual verification to prevent interruption. Please log in to confirm your enrollment status and update dependent information if needed. Sign in at: https://tricare.mil/beneficiary/portal',
      detail: 'Link points to official tricare.mil domain over HTTPS',
      isPhish: false,
      action: 'Verify by typing tricare.mil directly into your browser or calling TRICARE support at 1-866-773-0404.',
      insights: [
        'This sender uses the legitimate .mil domain which is restricted to U.S. military entities.',
        'HTTPS connection to tricare.mil confirms it\'s the official Defense Health Agency website.',
        'Annual enrollment verification is a real TRICARE requirement.',
        'While legitimate, it\'s still best practice to navigate directly to the site rather than clicking links.'
      ]
    },
    {
      id: 'gi-bill',
      label: 'GI Bill Eligibility Expansion',
      sender: '"VA Education Services" <edu-services@va.education.gov>',
      subject: 'New GI Bill benefits available - claim your additional months',
      preview: 'Recent legislation expanded GI Bill benefits. You may qualify for 12 additional months of education benefits. Complete the attached form and return with a copy of your DD-214 to claim. Deadline: 30 days.',
      detail: 'Attachment: GI_Bill_Extension_Application.docx',
      isPhish: true,
      action: 'Verify any GI Bill changes at gibill.va.gov or call 1-888-442-4551. Never send DD-214 via email.',
      insights: [
        'Domain "va.education.gov" looks official but the real VA uses only va.gov (not .gov subdomains).',
        'Scammers specifically request DD-214 forms which contain SSN, date of birth, and service details.',
        'The document attachment likely contains macros that install malware when opened.',
        'Artificial deadline creates pressure to act without verifying through official channels.'
      ]
    },
    {
      id: 'wounded-warrior',
      label: 'Wounded Warrior Project Donation',
      sender: 'Wounded Warrior Project <donations@woundedwarriorproject.org>',
      subject: 'Veterans Day: Support your fellow warriors',
      preview: 'This Veterans Day, help us support wounded veterans and their families. Your donation provides critical programs for those who sacrificed so much. Every dollar makes a difference. Donate securely: https://woundedwarriorproject.org/donate',
      detail: 'Email includes WWP logo, testimonials, and links to their programs',
      isPhish: false,
      action: 'Donate directly through the official website or mail a check. Verify 501(c)(3) status on charity watchdog sites.',
      insights: [
        'woundedwarriorproject.org is the legitimate domain for this established charity.',
        'Major veteran charities do send legitimate fundraising appeals, especially around Veterans Day.',
        'Before donating to any charity, check ratings on CharityNavigator.org or GuideStar.',
        'Legitimate charities provide tax ID numbers, annual reports, and financial transparency.'
      ]
    },
    {
      id: 'employment',
      label: 'Veterans Preference Hiring Alert',
      sender: '"Federal Hiring Initiative" <veterans@federaljobs-usa.com>',
      subject: 'Exclusive: Federal positions with veterans preference closing soon',
      preview: 'As a veteran, you qualify for special hiring authority. We have 47 federal positions available with veterans preference. Upload your resume and SF-50 for priority consideration. Act fast - positions close Friday! Apply: http://federaljobs-usa.com/veterans',
      detail: 'Lists positions at VA, DHS, DOD with $75k-$120k salaries',
      isPhish: true,
      action: 'Apply only through official usajobs.gov. Report fake job scams to OPM and FTC.',
      insights: [
        'federaljobs-usa.com is NOT usajobs.gov - the only legitimate federal job application site.',
        'Scammers collect SF-50 forms (Notification of Personnel Action) to steal identities.',
        'Real federal jobs never require fees, and veterans preference is applied within USAJOBS.',
        'Creating urgency with artificial deadlines pressures veterans to skip verification steps.'
      ]
    },
    {
      id: 'va-health',
      label: 'VA Telehealth Appointment Reminder',
      sender: 'VA Telehealth <no-reply@messages.va.gov>',
      subject: 'Reminder: Telehealth appointment tomorrow at 2:00 PM',
      preview: 'Your telehealth appointment with Dr. Sarah Martinez is scheduled for November 12, 2025 at 2:00 PM EST. Join via VA Video Connect app or click the link in your appointment confirmation email sent separately.',
      detail: 'Includes appointment details, provider name, and instructions to use VA Video Connect app',
      isPhish: false,
      action: 'Confirm appointment through My HealtheVet or call your VA facility directly.',
      insights: [
        'messages.va.gov is a legitimate VA domain for automated appointment reminders.',
        'Notice the email does NOT include a clickable link - it refers to a separate email with the secure link.',
        'VA Video Connect is the official VA telehealth platform.',
        'This follows VA security best practices: reminders don\'t include sensitive health info or suspicious links.'
      ]
    },
    {
      id: 'military-charity',
      label: 'Support Our Troops Foundation',
      sender: '"Col. (Ret.) James Mitchell" <director@supportourtroopsfoundation.org>',
      subject: 'Help deploy care packages to troops overseas',
      preview: 'As a fellow veteran, I\'m reaching out personally. Our foundation sends care packages to deployed soldiers. We need $50 donors to sponsor a package for the holidays. 100% goes directly to our troops. Donate via PayPal: paypal.me/supporttroopsUSA or send gift cards to our PO Box.',
      detail: 'Includes photos of "care packages" and testimonials from "grateful soldiers"',
      isPhish: true,
      action: 'Verify charity registration with state attorney general and IRS. Report fake military charities to FTC.',
      insights: [
        'Using military rank and veteran status creates false credibility and trust.',
        'Requesting PayPal, gift cards, or wire transfers (instead of secure donation platforms) is a red flag.',
        'Claims of "100% goes to troops" are often false - legitimate charities disclose administrative costs.',
        'Search "Support Our Troops Foundation" + "scam" reveals this is a known fraudulent charity.',
        'Real military support organizations are registered 501(c)(3) charities with transparent financials.'
      ]
    }
  ];

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimer() {
    if (timeRemaining > 0) {
      timeRemaining--;
      countdownEl.textContent = formatTime(timeRemaining);

      if (timeRemaining <= 60) {
        countdownEl.classList.add('countdown--danger');
      } else if (timeRemaining <= 180) {
        countdownEl.classList.add('countdown--warning');
      }
    } else {
      stopTimer();
      feedbackEl.textContent = '⏰ Time expired! You can still complete the training.';
    }
  }

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  function updateProgress() {
    const answeredCount = Object.keys(userAnswers).length;
    progressEl.textContent = `${answeredCount}/${SCENARIOS.length} completed`;
  }

  function renderScenario(index) {
    const scenario = SCENARIOS[index];
    const hasAnswer = userAnswers[scenario.id] !== undefined;
    const isReviewing = hasAnswer && userAnswers[scenario.id].reviewed;

    let content = `
      <div class="scenario-single" data-scenario-id="${scenario.id}">
        <div class="scenario-progress-bar">
          <div class="progress-fill" style="width: ${((index + 1) / SCENARIOS.length) * 100}%"></div>
        </div>

        <div class="scenario-number">Scenario ${index + 1} of ${SCENARIOS.length}</div>

        <h2 class="scenario-title">${scenario.label}</h2>

        <div class="scenario-email-box">
          <div class="email-row">
            <span class="email-label">From:</span>
            <span class="email-value">${scenario.sender}</span>
          </div>
          <div class="email-row">
            <span class="email-label">Subject:</span>
            <span class="email-value">${scenario.subject}</span>
          </div>
          <div class="email-row">
            <span class="email-label">Details:</span>
            <span class="email-value">${scenario.detail}</span>
          </div>
        </div>

        <div class="scenario-content">
          <p>${scenario.preview}</p>
        </div>
    `;

    if (!isReviewing) {
      content += `
        <div class="scenario-question">
          <p class="question-text">Is this message legitimate or phishing?</p>
          <div class="choice-buttons">
            <button class="choice-btn choice-btn--danger" data-choice="phish">
              🚨 Phishing Attack
            </button>
            <button class="choice-btn choice-btn--safe" data-choice="legit">
              ✅ Legitimate
            </button>
          </div>
        </div>
      `;
    } else {
      const userChoice = userAnswers[scenario.id].answer;
      const correct = (userChoice === 'phish' && scenario.isPhish) || (userChoice === 'legit' && !scenario.isPhish);

      content += `
        <div class="scenario-result ${correct ? 'result-correct' : 'result-incorrect'}">
          <div class="result-header">
            ${correct ? '✅ Correct!' : '❌ Incorrect'}
          </div>
          <div class="result-verdict">
            <strong>This was ${scenario.isPhish ? 'a phishing attack' : 'legitimate'}.</strong>
          </div>

          <div class="result-action">
            <strong>Recommended Action:</strong> ${scenario.action}
          </div>

          <div class="result-insights">
            <strong>${scenario.isPhish ? '🚩 Red Flags:' : '✅ Legitimate Signals:'}</strong>
            <ul>
              ${scenario.insights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    content += `
        <div class="scenario-nav">
          <button class="nav-btn" id="prev-btn" ${index === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button class="nav-btn nav-btn--primary" id="next-btn">
            ${index === SCENARIOS.length - 1 ? 'Finish' : 'Next'} →
          </button>
        </div>
      </div>
    `;

    scenarioContainer.innerHTML = content;

    // Add event listeners for choice buttons
    if (!isReviewing) {
      document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoice(scenario.id, btn.dataset.choice));
      });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (index > 0) {
          currentIndex--;
          renderScenario(currentIndex);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (index < SCENARIOS.length - 1) {
          currentIndex++;
          renderScenario(currentIndex);
        } else {
          showSummary();
        }
      });
    }
  }

  function handleChoice(scenarioId, choice) {
    userAnswers[scenarioId] = { answer: choice, reviewed: true };
    updateProgress();
    renderScenario(currentIndex);
  }

  function showSummary() {
    stopTimer();

    let correct = 0;
    SCENARIOS.forEach(scenario => {
      const userAnswer = userAnswers[scenario.id];
      if (!userAnswer) return;

      const isCorrect = (userAnswer.answer === 'phish' && scenario.isPhish) ||
                       (userAnswer.answer === 'legit' && !scenario.isPhish);
      if (isCorrect) correct++;
    });

    const total = SCENARIOS.length;
    const percentage = Math.round((correct / total) * 100);
    let grade, message;

    if (percentage === 100) {
      grade = '🏆 Perfect!';
      message = 'Outstanding! You identified all targeted phishing attempts. Your awareness will help protect yourself and others in similar situations.';
    } else if (percentage >= 75) {
      grade = '🎯 Excellent';
      message = `Strong performance! You correctly identified ${correct}/${total} scenarios. Review the explanations to strengthen your defenses further.`;
    } else if (percentage >= 50) {
      grade = '✅ Good';
      message = `Good effort! You identified ${correct}/${total} correctly. Study the insights for each scenario to improve your phishing detection skills.`;
    } else {
      grade = '📚 Needs Improvement';
      message = `You identified ${correct}/${total} correctly. Targeted phishing is sophisticated - review each scenario carefully to learn the warning signs.`;
    }

    summaryEl.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 8px;">${grade}</div>
      <div>Score: ${correct}/${total} (${percentage}%)</div>
      <div style="margin-top: 8px;">${message}</div>
      <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="lab.html" class="btn btn--secondary">← Back to Lab</a>
        <button onclick="location.reload()" class="btn btn--veteran">Retry Training</button>
        <button id="review-btn" class="btn">Review Answers</button>
      </div>
    `;
    summaryEl.classList.remove('hidden');
    scenarioContainer.innerHTML = '';

    document.getElementById('review-btn')?.addEventListener('click', () => {
      summaryEl.classList.add('hidden');
      currentIndex = 0;
      renderScenario(currentIndex);
    });

    // Save progress
    try {
      const progress = JSON.parse(localStorage.getItem('phishing-training-progress') || '{}');
      progress.veteranScenarios = {
        completed: true,
        score: correct,
        total: total,
        percentage: percentage,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('phishing-training-progress', JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save progress');
    }
  }

  function startTraining() {
    if (started) return;
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Training in Progress...';

    currentIndex = 0;
    userAnswers = {};

    renderScenario(currentIndex);
    startTimer();
    updateProgress();

    feedbackEl.textContent = 'Review each scenario carefully and make your choice.';
  }

  startBtn?.addEventListener('click', startTraining);

  // Prevent accidental navigation
  window.addEventListener('beforeunload', (e) => {
    if (started && Object.keys(userAnswers).length < SCENARIOS.length) {
      e.preventDefault();
      e.returnValue = 'Training in progress. Are you sure you want to leave?';
    }
  });
})();
