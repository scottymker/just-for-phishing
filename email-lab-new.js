// email-lab-new.js - Redesigned with step-by-step flow
(() => {
  'use strict';

  const START_TIME = 900; // 15 minutes
  let timeRemaining = START_TIME;
  let timerInterval = null;
  let currentScreen = 'instructions'; // 'instructions', 'scenario', 'summary'
  let currentIndex = 0;
  let userAnswers = {};

  const $ = (id) => document.getElementById(id);
  const countdownEl = $('lab-countdown');
  const startBtn = $('start-lab');
  const appContainer = $('app-container');

  const EMAILS = [
    {
      id: 'password-reset',
      from: 'Microsoft Account Team <account-security@micros0ft-verify.com>',
      replyTo: 'noreply@micros0ft-verify.com',
      to: 'you@yourcompany.com',
      subject: 'Security Alert: Unusual sign-in activity',
      date: 'Thu, 7 Nov 2025 03:42:18 +0000',
      body: 'Dear Valued Customer,\n\nWe detected an unusual sign-in attempt to your Microsoft account from:\n\nLocation: Lagos, Nigeria\nDevice: Linux PC\nTime: November 7, 2025 3:15 AM\n\nIf this wasn\'t you, your account may be compromised. Verify your identity immediately to prevent account suspension.\n\nClick here to secure your account: http://verify-microsoft-account.com/security\n\nYou have 24 hours to respond. Failure to verify will result in permanent account lockdown.\n\nThank you,\nMicrosoft Security Team',
      links: ['http://verify-microsoft-account.com/security'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'Domain is "micros0ft-verify.com" (zero instead of O) - not microsoft.com',
        'Urgent threat of "permanent account lockdown" creates panic',
        'Link goes to http (not https) and suspicious domain',
        'Generic greeting "Dear Valued Customer" instead of your name',
        'Grammar issues and artificial urgency'
      ]
    },
    {
      id: 'payroll-update',
      from: 'HR Department <hr@yourcompany.com>',
      replyTo: 'hr@yourcompany.com',
      to: 'employees@yourcompany.com',
      subject: '[All Staff] Payroll System Upgrade - Action Required',
      date: 'Mon, 11 Nov 2025 09:15:33 -0500',
      body: 'Dear Team,\n\nOur payroll system is being upgraded this week. To ensure uninterrupted direct deposits, please verify your banking information by Friday, Nov 15.\n\nWhat you need to do:\n1. Log into the HR Portal at https://hrportal.yourcompany.com/payroll\n2. Navigate to "My Pay" → "Direct Deposit"\n3. Verify your account and routing numbers are correct\n4. Submit confirmation by clicking "Verify"\n\nIf you have questions, contact HR at ext. 5555 or hr@yourcompany.com\n\nBest regards,\nSarah Johnson\nDirector of Human Resources',
      links: ['https://hrportal.yourcompany.com/payroll'],
      attachments: [],
      isPhish: false,
      legitimateSignals: [
        'Sender domain matches your company domain',
        'Links point to company\'s actual HR portal over HTTPS',
        'Provides alternative contact methods (phone extension)',
        'Professional tone without urgency or threats',
        'Reasonable deadline (4 days notice)',
        'Signed with real person\'s name and title'
      ]
    },
    {
      id: 'package-delivery',
      from: 'UPS Delivery Service <tracking@ups-delivery-notice.com>',
      replyTo: 'support@ups-delivery-notice.com',
      to: 'you@gmail.com',
      subject: 'UPS: Package Delivery Attempted - Rescheduling Required',
      date: 'Tue, 12 Nov 2025 14:23:09 -0800',
      body: 'Dear Customer,\n\nWe attempted to deliver package #1Z999AA10123456784 but no one was available to receive it.\n\nPackage Details:\nTracking: 1Z999AA10123456784\nWeight: 3.2 lbs\nSender: Amazon.com\n\nTo reschedule delivery or arrange pickup, download your delivery notice:\nhttp://bit.ly/ups-delivery-notice\n\nYour package will be returned to sender if not claimed within 5 days.\n\nThank you,\nUPS Customer Service',
      links: ['http://bit.ly/ups-delivery-notice'],
      attachments: ['UPS_Delivery_Notice.pdf.exe'],
      isPhish: true,
      redFlags: [
        'Domain "ups-delivery-notice.com" is NOT ups.com',
        'Uses bit.ly shortened URL hiding the real destination',
        'Attachment is .exe disguised as PDF (malware)',
        'Real UPS leaves physical notices and sends texts with real tracking links',
        'Generic "Dear Customer" greeting',
        'Creates urgency with 5-day deadline'
      ]
    },
    {
      id: 'bank-fraud-alert',
      from: 'Chase Fraud Alerts <fraud-alert@chase.com>',
      replyTo: 'alerts@alertcenter.chase.com',
      to: 'you@gmail.com',
      subject: 'Fraud Alert: Unusual Transaction Detected',
      date: 'Wed, 13 Nov 2025 16:07:42 -0500',
      body: 'Dear John Smith,\n\nWe detected a potentially fraudulent transaction on your Chase account ending in 7891:\n\nTransaction Details:\nMerchant: WALMART.COM\nAmount: $847.32\nLocation: Online\nDate: Nov 13, 2025\n\nDid you authorize this transaction?\n• If YES, no action needed\n• If NO, call us immediately at 1-800-935-9935 (24/7)\n\nYou can also review this in your Chase Mobile app or at chase.com.\n\nFor your security, this alert was sent to the email on file. Do not reply to this email.\n\nSincerely,\nChase Fraud Prevention Team',
      links: ['https://www.chase.com'],
      attachments: [],
      isPhish: false,
      legitimateSignals: [
        'Sender domain is legitimate chase.com',
        'Uses your actual name (personalized)',
        'Provides official Chase fraud phone number (verifiable)',
        'Links point to real chase.com website only',
        'Does NOT ask you to click links to "verify" anything',
        'Professional formatting and branding',
        'Tells you not to reply to the email (proper security practice)'
      ]
    },
    {
      id: 'invoice-payment',
      from: '"Accounts Receivable" <invoices@company-name.com>',
      replyTo: 'ar-dept@tempmail.net',
      to: 'accounting@yourcompany.com',
      subject: 'OVERDUE INVOICE #84721 - FINAL NOTICE',
      date: 'Thu, 14 Nov 2025 08:41:55 -0800',
      body: 'URGENT PAYMENT REQUIRED\n\nOur records show Invoice #84721 is 45 days overdue. Payment of $4,832.50 is required immediately to avoid legal action.\n\nInvoice Date: September 30, 2025\nDue Date: October 30, 2025\nAmount Due: $4,832.50\n\nPlease review the attached invoice and remit payment via wire transfer within 48 hours.\n\nWire transfer details:\nBank: International Commerce Bank\nAccount: 8274910573\nRouting: 021000021\nBeneficiary: Corporate Services Ltd.\n\nReply with wire confirmation receipt. Failure to pay will result in collection agency involvement and damage to your business credit rating.\n\nAccounts Receivable Department',
      links: [],
      attachments: ['Invoice_84721.zip'],
      isPhish: true,
      redFlags: [
        'Reply-to email (tempmail.net) doesn\'t match sender domain',
        'You don\'t recognize the company or have any business relationship',
        'Extreme urgency and threats of legal action',
        'Requests wire transfer (irreversible payment method)',
        'No company letterhead, phone number, or verifiable contact info',
        'ZIP attachment likely contains malware',
        'Poor formatting and unprofessional tone'
      ]
    },
    {
      id: 'security-training',
      from: 'IT Security Team <security@yourcompany.com>',
      replyTo: 'security@yourcompany.com',
      to: 'allstaff@yourcompany.com',
      subject: 'Mandatory Cybersecurity Training - Due Nov 30',
      date: 'Fri, 15 Nov 2025 10:30:12 -0500',
      body: 'Dear Colleagues,\n\nAs part of our annual security awareness program, all employees must complete the cybersecurity training module by November 30, 2025.\n\nTraining Details:\n• Platform: Learning Management System (LMS)\n• Duration: 45 minutes\n• Topics: Phishing, passwords, data protection\n• Certificate: Issued upon completion\n\nHow to Access:\n1. Go to lms.yourcompany.com\n2. Log in with your network credentials\n3. Find "2025 Cybersecurity Essentials" under "My Courses"\n4. Complete all modules and pass the quiz (80% required)\n\nIf you have technical issues, contact the IT Help Desk at ext. 4357 or helpdesk@yourcompany.com.\n\nThank you for helping keep our organization secure.\n\nMarcus Chen\nChief Information Security Officer\nIT Security Team',
      links: ['https://lms.yourcompany.com'],
      attachments: [],
      isPhish: false,
      legitimateSignals: [
        'Sender matches your company\'s IT security domain',
        'Links to your company\'s actual LMS platform',
        'Provides clear instructions with alternative contact methods',
        'Reasonable deadline (2 weeks away)',
        'Professional tone and proper formatting',
        'Signed with real name and title',
        'Typical of annual compliance training requirements'
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
          <div class="instructions-icon">🔬</div>
          <h2>Welcome to the Email Phishing Lab</h2>
          <p class="instructions-intro">
            You'll analyze 6 real-world email scenarios to identify phishing attempts.
            Take your time to examine each email carefully.
          </p>

          <div class="instructions-section">
            <h3>📋 What You'll Do</h3>
            <ul class="instructions-list">
              <li><strong>Review each email</strong> — Examine the complete headers, links, and content</li>
              <li><strong>Look for red flags</strong> — Suspicious domains, urgency tactics, poor grammar</li>
              <li><strong>Make your decision</strong> — Is it legitimate or phishing?</li>
              <li><strong>Learn from feedback</strong> — See detailed explanations after each answer</li>
            </ul>
          </div>

          <div class="instructions-section">
            <h3>🔍 Key Indicators to Check</h3>
            <div class="indicators-grid">
              <div class="indicator-item">
                <span class="indicator-icon">📧</span>
                <strong>Sender Domain</strong>
                <p>Verify the email address matches the company</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon">🔗</span>
                <strong>Links & URLs</strong>
                <p>Hover over links to see real destinations</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon">📎</span>
                <strong>Attachments</strong>
                <p>Be wary of unexpected files, especially .exe</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon">⚠️</span>
                <strong>Urgency Tactics</strong>
                <p>Threats and pressure are phishing red flags</p>
              </div>
            </div>
          </div>

          <div class="instructions-footer">
            <div class="time-note">
              <strong>⏱️ Recommended Time:</strong> 15 minutes (not enforced)
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
    const email = EMAILS[currentIndex];
    const hasAnswer = userAnswers[email.id] !== undefined;

    let content = `
      <div class="scenario-screen">
        <div class="scenario-header-bar">
          <div class="scenario-progress-info">
            <span class="scenario-number">Email ${currentIndex + 1} of ${EMAILS.length}</span>
          </div>
          <div class="scenario-progress-bar">
            <div class="scenario-progress-fill" style="width: ${((currentIndex + 1) / EMAILS.length) * 100}%"></div>
          </div>
        </div>

        <div class="scenario-card">
          <h2 class="scenario-title">📧 Analyze This Email</h2>

          <div class="email-display">
            <div class="email-headers">
              <div class="email-field">
                <span class="email-field-label">From:</span>
                <span class="email-field-value">${email.from}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">Reply-To:</span>
                <span class="email-field-value">${email.replyTo}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">To:</span>
                <span class="email-field-value">${email.to}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">Subject:</span>
                <span class="email-field-value email-subject">${email.subject}</span>
              </div>
              <div class="email-field">
                <span class="email-field-label">Date:</span>
                <span class="email-field-value">${email.date}</span>
              </div>
              ${email.links.length > 0 ? `
              <div class="email-field">
                <span class="email-field-label">Links:</span>
                <span class="email-field-value email-links">${email.links.map(l => `<code>${l}</code>`).join('<br>')}</span>
              </div>
              ` : ''}
              ${email.attachments.length > 0 ? `
              <div class="email-field">
                <span class="email-field-label">Attachments:</span>
                <span class="email-field-value email-attachment">${email.attachments.join(', ')}</span>
              </div>
              ` : ''}
            </div>

            <div class="email-body-section">
              <div class="email-body-label">Message Body:</div>
              <div class="email-body-content">${email.body.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
    `;

    if (!hasAnswer) {
      content += `
          <div class="scenario-question">
            <p class="question-text">Is this email legitimate or phishing?</p>
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
      const userChoice = userAnswers[email.id].answer;
      const correct = (userChoice === 'phish' && email.isPhish) || (userChoice === 'legit' && !email.isPhish);

      content += `
          <div class="scenario-result ${correct ? 'result-correct' : 'result-incorrect'}">
            <div class="result-header">
              ${correct ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <div class="result-verdict">
              This email was <strong>${email.isPhish ? 'phishing' : 'legitimate'}</strong>.
            </div>

            <div class="result-insights">
              <strong>${email.isPhish ? '🚩 Red Flags:' : '✅ Legitimate Signals:'}</strong>
              <ul>
                ${(email.isPhish ? email.redFlags : email.legitimateSignals).map(insight => `<li>${insight}</li>`).join('')}
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
              ${currentIndex === EMAILS.length - 1 ? 'View Results' : 'Next'} →
            </button>
          </div>
        </div>
      </div>
    `;

    appContainer.innerHTML = content;

    // Add event listeners
    if (!hasAnswer) {
      document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoice(email.id, btn.dataset.choice));
      });
    }

    document.getElementById('prev-btn')?.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderScenario();
      }
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      if (currentIndex < EMAILS.length - 1) {
        currentIndex++;
        renderScenario();
      } else {
        renderSummary();
      }
    });
  }

  function handleChoice(emailId, choice) {
    userAnswers[emailId] = { answer: choice };
    renderScenario();
  }

  function renderSummary() {
    stopTimer();

    let correct = 0;
    EMAILS.forEach(email => {
      const userAnswer = userAnswers[email.id];
      if (!userAnswer) return;

      const isCorrect = (userAnswer.answer === 'phish' && email.isPhish) ||
                       (userAnswer.answer === 'legit' && !email.isPhish);
      if (isCorrect) correct++;
    });

    const total = EMAILS.length;
    const percentage = Math.round((correct / total) * 100);
    let grade, gradeClass, message;

    if (percentage === 100) {
      grade = '🏆 Expert Analyst';
      gradeClass = 'excellent';
      message = 'Perfect score! You identified all phishing emails and legitimate messages correctly. Your threat detection skills are outstanding.';
    } else if (percentage >= 83) {
      grade = '🎯 Advanced';
      gradeClass = 'good';
      message = `Excellent work! You got ${correct} out of ${total} correct. Review the explanations to master those subtle indicators.`;
    } else if (percentage >= 67) {
      grade = '✅ Proficient';
      gradeClass = 'fair';
      message = `Good job! You scored ${correct} out of ${total}. Study the red flags and legitimate signals to improve further.`;
    } else {
      grade = '📚 Developing';
      gradeClass = 'poor';
      message = `You got ${correct} out of ${total} correct. Phishing emails can be sophisticated—review each example carefully to sharpen your skills.`;
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
      progress.emailLab = {
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
          <div class="placeholder-icon">📧</div>
          <h2>Email Phishing Lab</h2>
          <p>Click "Start Lab" above to begin your training</p>
        </div>
      </div>
    `;
  }

  init();
})();
