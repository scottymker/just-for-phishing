// targeted-phishing.js - Training module for targeted phishing scenarios
(() => {
  'use strict';

  const START_TIME = 600; // 10 minutes
  let timeRemaining = START_TIME;
  let timerInterval = null;
  let currentScreen = 'instructions'; // 'instructions', 'scenario', 'summary'
  let currentIndex = 0;
  let userAnswers = {};

  const $ = (id) => document.getElementById(id);
  const countdownEl = $('lab-countdown');
  const startBtn = $('start-lab');
  const appContainer = $('app-container');

  const SCENARIOS = [
    {
      id: 'gov-benefits-fraud',
      from: 'VA Benefits Admin <contact@va-gov.us>',
      replyTo: 'noreply@va-gov.us',
      to: 'veteran@example.com',
      subject: 'Action Required: Your GI Bill Benefits are on Hold',
      date: 'Tue, 12 Nov 2025 11:15:21 +0000',
      body: 'Dear Veteran,\n\nOur records indicate an issue with your GI Bill enrollment verification. To avoid interruption of your benefits, you must verify your details immediately.\n\nPlease click the link below to review and confirm your information within 24 hours:\nhttp://va-gov.us/verify-enrollment\n\nFailure to do so will result in your benefits being suspended pending a manual review, which can take 4-6 weeks.\n\nThank you,\nVA Benefits Administration',
      links: ['http://va-gov.us/verify-enrollment'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'The sender domain "va-gov.us" is not the official VA domain, which is "va.gov".',
        'Creates a strong sense of urgency with the threat of suspending benefits.',
        'The link uses HTTP, not HTTPS. Official government sites always use HTTPS.',
        'The link itself is a fake domain, designed to look real.',
        'The VA typically communicates through official channels or letters, not urgent emails from unofficial addresses.'
      ]
    },
    {
      id: 'professional-networking-legit',
      from: 'Jane Doe via LinkedIn <messages-noreply@linkedin.com>',
      replyTo: 'messages-noreply@linkedin.com',
      to: 'you@yourcompany.com',
      subject: 'Inquiry about your profile for a Senior Developer role',
      date: 'Tue, 12 Nov 2025 14:30:00 -0500',
      body: 'Hi there,\n\nI came across your profile on LinkedIn and was very impressed with your experience in full-stack development and your work on Project Titan.\n\nWe have an opening for a Senior Full-Stack Developer at Acme Inc. that seems like a great match for your skills. The role involves leading a new team focused on next-generation cloud services.\n\nWould you be open to a brief, confidential chat next week to discuss this further? You can view the job description and apply via the link on our official LinkedIn page.\n\nBest regards,\nJane Doe\nSenior Recruiter, Acme Inc.',
      links: ['https://www.linkedin.com/jobs/view/123456789'],
      attachments: [],
      isPhish: false,
      legitimateSignals: [
        'The email comes from a legitimate "@linkedin.com" address.',
        'The recruiter mentions a specific, real project from your profile ("Project Titan").',
        'It directs you to the official LinkedIn platform, not a strange third-party site.',
        'The tone is professional and doesn\'t create undue urgency or pressure.',
        'There are no suspicious attachments or requests for personal financial information.'
      ]
    },
    {
      id: 'healthcare-attack',
      from: 'EHR Compliance Dept <support@ehr-systems.org>',
      replyTo: 'support@ehr-systems.org',
      to: 'clinic-staff@hospital.org',
      subject: 'URGENT: Mandatory HIPAA Security Update Required',
      date: 'Tue, 12 Nov 2025 09:05:14 -0800',
      body: 'To all clinical staff,\n\nA new HIPAA security advisory (HIPAA-SEC-2025-04) was just released. All workstations must be patched immediately to protect patient data.\n\nDownload and run the security patch from the link below. This must be completed by the end of your shift today to ensure compliance.\n\nDownload Patch: http://ehr-systems.org/updates/patch-hs2025-04.exe\n\nYour workstation may restart after the update. Please save all work before running the patch.\n\nEHR Compliance Department',
      links: ['http://ehr-systems.org/updates/patch-hs2025-04.exe'],
      attachments: ['patch-hs2025-04.exe'],
      isPhish: true,
      redFlags: [
        'The sender domain "ehr-systems.org" is generic and not your specific, known EHR vendor.',
        'Urgent requests to download and run an ".exe" file are a major red flag for malware.',
        'Legitimate software patches are typically deployed by IT through managed systems, not via email links.',
        'The threat of non-compliance is used to rush employees into making a mistake.',
        'The link is an executable file, which should never be run from an email.'
      ]
    },
    {
      id: 'charity-fraud',
      from: 'Global Relief Fund <donate@global-relief-international.com>',
      replyTo: 'donations@global-relief-international.com',
      to: 'you@example.com',
      subject: 'Your help is needed: Support for recent hurricane victims',
      date: 'Mon, 11 Nov 2025 18:20:45 -0500',
      body: 'Dear Friend,\n\nThe recent devastation from Hurricane Leo has left thousands without food, water, or shelter. Families have lost everything.\n\nIn this desperate time, your generosity can make a world of difference. A donation of just $25 can provide a family with a warm meal and clean water. Please, give what you can today.\n\nDonate Now: http://global-relief-international.com/donate\n\nYour compassion is their only hope. Thank you for your support.\n\nSincerely,\nGlobal Relief Fund',
      links: ['http://global-relief-international.com/donate'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'The domain "global-relief-international.com" is not a well-known or registered charity. Always verify charities on sites like Charity Navigator.',
        'High-pressure emotional language ("desperate time", "only hope") is a common tactic in charity scams.',
        'The link goes to an unverified website. Legitimate charities use secure, recognizable donation portals.',
        'Scammers often exploit recent natural disasters to trick people into donating.'
      ]
    },
    {
      id: 'reunion-event-legit',
      from: 'Springfield High Alumni Association <contact@springfield-alumni.org>',
      replyTo: 'contact@springfield-alumni.org',
      to: 'you@example.com',
      subject: 'Save the Date: Springfield High Class of 2015 Reunion!',
      date: 'Sun, 10 Nov 2025 16:45:10 -0600',
      body: 'Hi everyone,\n\nGet ready to reconnect! The 10-year reunion for the Springfield High Class of 2015 is officially scheduled for July 19, 2026.\n\nWe\'re still finalizing the venue, but we wanted to give everyone a heads-up. Please visit the official alumni website to update your contact information and express your interest in attending.\n\nUpdate Your Info: https://www.springfield-alumni.org/update-contact\n\nThis will help us get an accurate headcount. More details to follow in the coming months!\n\nGo Badgers!\n\nYour Reunion Committee',
      links: ['https://www.springfield-alumni.org/update-contact'],
      attachments: [],
      isPhish: false,
      legitimateSignals: [
        'The email points to a dedicated, official-looking alumni website with HTTPS.',
        'It doesn\'t ask for money or sensitive information, only for contact details on their own platform.',
        'The timeline is reasonable (planning a year in advance), unlike urgent phishing emails.',
        'The tone is informational and not demanding.',
        'You can independently verify the alumni association\'s existence.'
      ]
    },
    {
      id: 'finance-credential-harvest',
      from: 'Fidelity Investments <alerts@fidelity-online.net>',
      replyTo: 'noreply@fidelity-online.net',
      to: 'you@example.com',
      subject: 'Security Alert: Please review your account activity',
      date: 'Tue, 12 Nov 2025 08:55:30 -0500',
      body: 'Dear Customer,\n\nFor your security, we routinely monitor for unusual activity. We detected a login from a new device in a different state.\n\nDate: November 12, 2025\nLocation: Phoenix, AZ\n\nIf this was not you, please review your account activity and secure your account immediately by logging in through our secure portal.\n\nReview Activity: https://www.fidelity-online.net/login/review\n\nIf you do not review this activity, your account may be temporarily restricted.\n\nThank you,\nFidelity Security Team',
      links: ['https://www.fidelity-online.net/login/review'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'The domain "fidelity-online.net" is a fake look-alike domain. The real domain is "fidelity.com".',
        'The generic greeting "Dear Customer" is common in phishing emails.',
        'The link, while using HTTPS, points to the fraudulent domain.',
        'The threat of account restriction is designed to make you act without thinking.',
        'Always log in to financial sites by typing the address directly into your browser, not by clicking email links.'
      ]
    },
    {
      id: 'it-spear-phishing',
      from: 'IT Help Desk <helpdesk@yourcompany.com.co>',
      replyTo: 'helpdesk@yourcompany.com.co',
      to: 'john.smith@yourcompany.com',
      subject: 'Re: Your ticket #481516 - VPN Issue',
      date: 'Tue, 12 Nov 2025 15:10:00 -0500',
      body: 'Hi John,\n\nFollowing up on your VPN ticket from this morning. We\'ve deployed a fix for the connectivity issues you were experiencing with the new server.\n\nPlease log in to the updated VPN portal here to confirm the issue is resolved:\nhttps://vpn.yourcompany.com/login-new\n\nLet us know if you continue to have problems.\n\nThanks,\nIT Help Desk',
      links: ['https://vpn.yourcompany.com/login-new'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'The sender\'s domain is "yourcompany.com.co" - the ".co" is a common trick to impersonate a ".com" domain.',
        'The attacker is referencing a real, recent problem (a VPN ticket), making the email highly convincing.',
        'Even if the link looks real, the suspicious sender domain is the biggest clue.',
        'This is classic spear phishing: highly targeted and uses specific knowledge about the recipient.',
        'Always be wary of follow-up emails that come from a slightly different address than the original.'
      ]
    },
    {
      id: 'trust-based-manipulation',
      from: 'Sarah Jenkins <s.jenkins@yourcompany-portal.com>',
      replyTo: 's.jenkins@yourcompany-portal.com',
      to: 'you@yourcompany.com',
      subject: 'Quick question about the Q4 report',
      date: 'Mon, 11 Nov 2025 13:00:51 -0500',
      body: 'Hey,\n\nHope you\'re having a good week. I\'m trying to finalize the Q4 projections and my access to the shared drive seems to be broken. I keep getting an error.\n\nCould you do me a huge favor and grab the latest draft from the link below and email it to me? I need it for the 2 PM meeting.\n\nGet Draft: https://yourcompany-portal.com/files/Q4-projections-draft.xlsx\n\nThanks a million!\n\n-Sarah',
      links: ['https://yourcompany-portal.com/files/Q4-projections-draft.xlsx'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'The sender\'s email, while looking like a colleague, is from an external domain "yourcompany-portal.com", not "@yourcompany.com".',
        'The attacker is creating a plausible story (broken access) to get you to bypass normal security procedures.',
        'The link points to an external, unofficial domain to download a file, which is likely malware.',
        'This is social engineering that exploits your trust in colleagues and your desire to be helpful.',
        'Always verify unusual requests from colleagues through a separate channel, like an instant message or phone call.'
      ]
    }
  ];

  // Timer functions
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
    }
  }

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  // Screen rendering functions
  function renderInstructions() {
    appContainer.innerHTML = `
      <div class="instructions-screen">
        <div class="instructions-card">
          <div class="instructions-icon">🎯</div>
          <h2>Welcome to the Targeted Phishing Lab</h2>
          <p class="instructions-intro">
            You'll analyze 8 scenarios of "spear phishing," where attacks are personalized to trick you.
            These are more sophisticated than normal phishing.
          </p>

          <div class="instructions-section">
            <h3>📋 What You'll Do</h3>
            <ul class="instructions-list">
              <li><strong>Examine each scenario</strong> — Attackers will use details about your job, industry, or personal life.</li>
              <li><strong>Identify subtle red flags</strong> — Look for small errors in domains, unusual requests, and emotional pressure.</li>
              <li><strong>Decide if it's a targeted attack</strong> — Is it phishing or a legitimate, personalized message?</li>
              <li><strong>Learn the tactics</strong> — See detailed explanations of how spear phishing works.</li>
            </ul>
          </div>

          <div class="instructions-section">
            <h3>🔍 Key Indicators of Spear Phishing</h3>
            <div class="indicators-grid">
              <div class="indicator-item">
                <span class="indicator-icon">👤</span>
                <strong>Personalization</strong>
                <p>Uses your name, job title, or recent activities</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon">🏢</span>
                <strong>Context-Aware</strong>
                <p>References real projects, colleagues, or events</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon">🔗</span>
                <strong>Look-Alike Domains</strong>
                <p>Uses domains like "yourcompany.com.co" or "login-portal.net"</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon">🤝</span>
                <strong>Exploits Trust</strong>
                <p>Impersonates a trusted person like a boss or colleague</p>
              </div>
            </div>
          </div>

          <div class="instructions-footer">
            <div class="time-note">
              <strong>⏱️ Recommended Time:</strong> 10 minutes (not enforced)
            </div>
            <button id="begin-lab-btn" class="btn btn-primary btn-large">
              Begin Lab →
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('begin-lab-btn')?.addEventListener('click', () => {
      currentScreen = 'scenario';
      currentIndex = 0;
      userAnswers = {};
      startTimer();
      startBtn.style.display = 'none';
      renderScenario();
    });
  }

  function renderScenario() {
    const scenario = SCENARIOS[currentIndex];
    const hasAnswer = userAnswers[scenario.id] !== undefined;

    let content = `
      <div class="scenario-screen">
        <div class="scenario-header-bar">
          <div class="scenario-progress-info">
            <span class="scenario-number">Scenario ${currentIndex + 1} of ${SCENARIOS.length}</span>
          </div>
          <div class="scenario-progress-bar">
            <div class="scenario-progress-fill" style="width: ${((currentIndex + 1) / SCENARIOS.length) * 100}%"></div>
          </div>
        </div>

        <div class="scenario-card">
          <h2 class="scenario-title">🎯 Analyze This Message</h2>

          <div class="email-display">
            <div class="email-headers">
              <div class="email-field">
                <span class="email-field-label">From:</span>
                <span class="email-field-value">${scenario.from}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">Reply-To:</span>
                <span class="email-field-value">${scenario.replyTo}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">To:</span>
                <span class="email-field-value">${scenario.to}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">Subject:</span>
                <span class="email-field-value email-subject">${scenario.subject}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">Date:</span>
                <span class="email-field-value">${scenario.date}</span>
              </div>
              ${scenario.links.length > 0 ? `
              <div class="email-field">
                <span class="email-field-label">Links:</span>
                <span class="email-field-value email-links">${scenario.links.map(l => `<code>${l}</code>`).join('<br>') }</span>
              </div>
              ` : ''}
              ${scenario.attachments.length > 0 ? `
              <div class="email-field">
                <span class="email-field-label">Attachments:</span>
                <span class="email-field-value email-attachment">${scenario.attachments.join(', ')}</span>
              </div>
              ` : ''}
            </div>

            <div class="email-body-section">
              <div class="email-body-label">Message Body:</div>
              <div class="email-body-content">${scenario.body.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
    `;

    if (!hasAnswer) {
      content += `
          <div class="scenario-question">
            <p class="question-text">Is this message legitimate or a targeted phishing attack?</p>
            <div class="choice-buttons">
              <button class="choice-btn choice-btn--danger" data-choice="phish">
                🚨 Phishing
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
              This message was <strong>${scenario.isPhish ? 'a targeted phishing attack' : 'legitimate'}</strong>.
            </div>

            <div class="result-insights">
              <strong>${scenario.isPhish ? '🚩 Red Flags:' : '✅ Legitimate Signals:'}</strong>
              <ul>
                ${(scenario.isPhish ? scenario.redFlags : scenario.legitimateSignals).map(insight => `<li>${insight}</li>`).join('')}
              </ul>
            </div>
          </div>
      `;
    }

    content += `
          <div class="scenario-nav">
            <button class="nav-btn" id="prev-btn" ${currentIndex === 0 ? 'disabled' : ''}>
              ← Previous
            </button>
            <button class="nav-btn nav-btn-primary" id="next-btn" ${!hasAnswer ? 'disabled' : ''}>
              ${currentIndex === SCENARIOS.length - 1 ? 'View Results' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    `;

    appContainer.innerHTML = content;

    // Add event listeners
    if (!hasAnswer) {
      document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoice(scenario.id, btn.dataset.choice));
      });
    }

    document.getElementById('prev-btn')?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderScenario();
      }
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      if (currentIndex < SCENARIOS.length - 1) {
        currentIndex++;
        renderScenario();
      } else {
        renderSummary();
      }
    });
  }

  function handleChoice(scenarioId, choice) {
    userAnswers[scenarioId] = { answer: choice };
    renderScenario();
  }

  function renderSummary() {
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
    let grade, gradeClass, message;

    if (percentage === 100) {
      grade = '🏆 Expert Analyst';
      gradeClass = 'excellent';
      message = 'Perfect score! You have an exceptional eye for spotting highly convincing targeted attacks. Your skills are top-notch.';
    } else if (percentage >= 75) {
      grade = '🎯 Advanced';
      gradeClass = 'good';
      message = `Excellent work! You got ${correct} out of ${total} correct. Spear phishing is tough, and you have a strong ability to detect it.`;
    } else if (percentage >= 50) {
      grade = '✅ Proficient';
      gradeClass = 'fair';
      message = `Good job! You scored ${correct} out of ${total}. These attacks are tricky. Review the red flags to sharpen your skills.`;
    } else {
      grade = '📚 Developing';
      gradeClass = 'poor';
      message = `You got ${correct} out of ${total} correct. Targeted attacks are designed to be convincing. Review each scenario to learn the tactics.`;
    }

    appContainer.innerHTML = `
      <div class="summary-screen">
        <div class="summary-card">
          <div class="summary-icon">🎓</div>
          <h2 class="summary-title">Lab Complete!</h2>

          <div class="summary-score-display">
            <div class="summary-score ${gradeClass}">${percentage}%</div>
            <div class="summary-grade">${grade}</div>
            <div class="summary-breakdown">${correct} out of ${total} correct</div>
          </div>

          <div class="summary-message">
            ${message}
          </div>

          <div class="summary-stats">
            <div class="stat-item">
              <div class="stat-icon">✅</div>
              <div class="stat-label">Correct</div>
              <div class="stat-value">${correct}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">❌</div>
              <div class="stat-label">Incorrect</div>
              <div class="stat-value">${total - correct}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📊</div>
              <div class="stat-label">Accuracy</div>
              <div class="stat-value">${percentage}%</div>
            </div>
          </div>

          <div class="summary-actions">
            <button id="review-btn" class="btn btn-secondary">Review Answers</button>
            <button onclick="location.reload()" class="btn btn-secondary">Retry Lab</button>
            <a href="lab.html" class="btn btn-primary">Back to Lab Hub</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('review-btn')?.addEventListener('click', () => {
      currentIndex = 0;
      renderScenario();
    });

    // Save progress
    try {
      const progress = JSON.parse(localStorage.getItem('phishing-training-progress') || '{}');
      progress.targetedPhishing = {
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

  // Initialize
  function init() {
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';
        renderInstructions();
      });
    }

    // Show placeholder
    appContainer.innerHTML = `
      <div class="placeholder-screen">
        <div class="placeholder-content">
          <div class="placeholder-icon">🎯</div>
          <h2>Targeted Phishing Lab</h2>
          <p>Click "Start Lab" above to begin your training</p>
        </div>
      </div>
    `;
  }

  init();
})();
