// email-lab.js
(() => {
  'use strict';

  const START_TIME = 900; // 15 minutes
  let timeRemaining = START_TIME;
  let timerInterval = null;
  let started = false;
  let submitted = false;

  const $ = (id) => document.getElementById(id);
  const countdownEl = $('lab-countdown');
  const startBtn = $('start-lab');
  const form = $('lab-form');
  const emailList = $('email-list');
  const submitBtn = $('submit-lab');
  const progressEl = $('lab-progress');
  const feedbackEl = $('lab-feedback');
  const summaryEl = $('lab-summary');

  const EMAILS = [
    {
      id: 'password-reset',
      from: 'Microsoft Account Team <account-security@micros0ft-verify.com>',
      replyTo: 'noreply@micros0ft-verify.com',
      to: 'you@yourcompany.com',
      subject: 'Security Alert: Unusual sign-in activity',
      date: 'Thu, 7 Nov 2025 03:42:18 +0000',
      body: `<div>Dear Valued Customer,<br><br>
We detected an unusual sign-in attempt to your Microsoft account from:<br>
<strong>Location:</strong> Lagos, Nigeria<br>
<strong>Device:</strong> Linux PC<br>
<strong>Time:</strong> November 7, 2025 3:15 AM<br><br>
If this wasn't you, your account may be compromised. <strong>Verify your identity immediately</strong> to prevent account suspension.<br><br>
<a href="http://verify-microsoft-account.com/security">Click here to secure your account</a><br><br>
You have 24 hours to respond. Failure to verify will result in permanent account lockdown.<br><br>
Thank you,<br>
Microsoft Security Team</div>`,
      links: ['http://verify-microsoft-account.com/security'],
      attachments: [],
      isPhish: true,
      redFlags: [
        'Domain is "micros0ft-verify.com" (zero instead of O) - not microsoft.com',
        'Urgent threat of "permanent account lockdown" creates panic',
        'Link goes to http (not https) and suspicious domain',
        'Generic greeting "Dear Valued Customer" instead of your name',
        'Grammar issues: "sign-in attempt" vs proper "sign-in activity"'
      ]
    },
    {
      id: 'payroll-update',
      from: 'HR Department <hr@yourcompany.com>',
      replyTo: 'hr@yourcompany.com',
      to: 'employees@yourcompany.com',
      subject: '[All Staff] Payroll System Upgrade - Action Required',
      date: 'Mon, 11 Nov 2025 09:15:33 -0500',
      body: `<div>Dear Team,<br><br>
Our payroll system is being upgraded this week. To ensure uninterrupted direct deposits, please verify your banking information by Friday, Nov 15.<br><br>
<strong>What you need to do:</strong><br>
1. Log into the HR Portal at <a href="https://hrportal.yourcompany.com/payroll">https://hrportal.yourcompany.com/payroll</a><br>
2. Navigate to "My Pay" → "Direct Deposit"<br>
3. Verify your account and routing numbers are correct<br>
4. Submit confirmation by clicking "Verify"<br><br>
If you have questions, contact HR at ext. 5555 or hr@yourcompany.com<br><br>
Best regards,<br>
Sarah Johnson<br>
Director of Human Resources</div>`,
      links: ['https://hrportal.yourcompany.com/payroll'],
      attachments: [],
      isPhish: false,
      redFlags: [],
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
      body: `<div>Dear Customer,<br><br>
We attempted to deliver package #1Z999AA10123456784 but no one was available to receive it.<br><br>
<strong>Package Details:</strong><br>
Tracking: 1Z999AA10123456784<br>
Weight: 3.2 lbs<br>
Sender: Amazon.com<br><br>
To reschedule delivery or arrange pickup, download your delivery notice:<br>
<a href="http://bit.ly/ups-delivery-notice">Download Delivery Notice (PDF)</a><br><br>
Your package will be returned to sender if not claimed within 5 days.<br><br>
Thank you,<br>
UPS Customer Service</div>`,
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
      body: `<div>Dear John Smith,<br><br>
We detected a potentially fraudulent transaction on your Chase account ending in 7891:<br><br>
<strong>Transaction Details:</strong><br>
Merchant: WALMART.COM<br>
Amount: $847.32<br>
Location: Online<br>
Date: Nov 13, 2025<br><br>
<strong>Did you authorize this transaction?</strong><br>
• If YES, no action needed<br>
• If NO, call us immediately at <strong>1-800-935-9935</strong> (24/7)<br><br>
You can also review this in your Chase Mobile® app or at <a href="https://www.chase.com">chase.com</a>.<br><br>
For your security, this alert was sent to the email on file. Do not reply to this email.<br><br>
Sincerely,<br>
Chase Fraud Prevention Team<br><br>
<small style="color: #666;">This is an automated security alert from Chase. Please do not reply.</small></div>`,
      links: ['https://www.chase.com'],
      attachments: [],
      isPhish: false,
      redFlags: [],
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
      body: `<div>URGENT PAYMENT REQUIRED<br><br>
Our records show Invoice #84721 is 45 days overdue. Payment of <strong>$4,832.50</strong> is required immediately to avoid legal action.<br><br>
Invoice Date: September 30, 2025<br>
Due Date: October 30, 2025<br>
Amount Due: $4,832.50<br><br>
Please review the attached invoice and remit payment via wire transfer within 48 hours.<br><br>
Wire transfer details:<br>
Bank: International Commerce Bank<br>
Account: 8274910573<br>
Routing: 021000021<br>
Beneficiary: Corporate Services Ltd.<br><br>
Reply with wire confirmation receipt. Failure to pay will result in collection agency involvement and damage to your business credit rating.<br><br>
Accounts Receivable Department</div>`,
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
      body: `<div>Dear Colleagues,<br><br>
As part of our annual security awareness program, all employees must complete the cybersecurity training module by <strong>November 30, 2025</strong>.<br><br>
<strong>Training Details:</strong><br>
• Platform: Learning Management System (LMS)<br>
• Duration: 45 minutes<br>
• Topics: Phishing, passwords, data protection<br>
• Certificate: Issued upon completion<br><br>
<strong>How to Access:</strong><br>
1. Go to <a href="https://lms.yourcompany.com">lms.yourcompany.com</a><br>
2. Log in with your network credentials<br>
3. Find "2025 Cybersecurity Essentials" under "My Courses"<br>
4. Complete all modules and pass the quiz (80% required)<br><br>
If you have technical issues, contact the IT Help Desk at ext. 4357 or helpdesk@yourcompany.com.<br><br>
Thank you for helping keep our organization secure.<br><br>
Marcus Chen<br>
Chief Information Security Officer<br>
IT Security Team</div>`,
      links: ['https://lms.yourcompany.com'],
      attachments: [],
      isPhish: false,
      redFlags: [],
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
      feedbackEl.textContent = '⏰ Time expired! Complete the lab at your own pace.';
    }
  }

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  function updateProgress() {
    const answered = document.querySelectorAll('input[type="radio"]:checked').length;
    progressEl.textContent = `${answered}/6 analyzed`;

    if (answered === 6) {
      submitBtn.disabled = false;
      feedbackEl.textContent = '✅ All emails analyzed! Submit when ready.';
    }
  }

  function toggleEmail(emailId) {
    const card = document.querySelector(`[data-email-id="${emailId}"]`);
    const details = card.querySelector('.email-details');
    const btn = card.querySelector('.expand-btn');

    const isExpanded = !details.classList.contains('hidden');

    if (isExpanded) {
      details.classList.add('hidden');
      btn.textContent = '🔍 Expand Email';
    } else {
      details.classList.remove('hidden');
      btn.textContent = '▲ Collapse';
    }
  }

  function renderEmails() {
    emailList.innerHTML = EMAILS.map((email, idx) => `
      <div class="email-card" data-email-id="${email.id}">
        <div class="email-header">
          <div class="email-index">Email ${idx + 1}/6</div>
          <button type="button" class="expand-btn" onclick="window.toggleEmail('${email.id}')">
            🔍 Expand Email
          </button>
        </div>

        <div class="email-preview">
          <div class="email-meta-row">
            <span class="email-label">From:</span>
            <span class="email-value">${email.from}</span>
          </div>
          <div class="email-meta-row">
            <span class="email-label">Subject:</span>
            <span class="email-value">${email.subject}</span>
          </div>
        </div>

        <div class="email-details hidden">
          <div class="email-meta-row">
            <span class="email-label">Reply-To:</span>
            <span class="email-value">${email.replyTo}</span>
          </div>
          <div class="email-meta-row">
            <span class="email-label">To:</span>
            <span class="email-value">${email.to}</span>
          </div>
          <div class="email-meta-row">
            <span class="email-label">Date:</span>
            <span class="email-value">${email.date}</span>
          </div>
          ${email.links.length > 0 ? `
            <div class="email-meta-row">
              <span class="email-label">Links:</span>
              <span class="email-value">${email.links.map(l => `<code>${l}</code>`).join('<br>')}</span>
            </div>
          ` : ''}
          ${email.attachments.length > 0 ? `
            <div class="email-meta-row">
              <span class="email-label">Attachments:</span>
              <span class="email-value email-attachment">${email.attachments.join(', ')}</span>
            </div>
          ` : ''}

          <div class="email-body">${email.body}</div>
        </div>

        <div class="email-verdict">
          <div class="verdict-label">Your Analysis:</div>
          <div class="scenario-choice-row">
            <label class="choice-chip choice-chip--danger">
              <input type="radio" name="${email.id}" value="phish" required>
              <span>🚨 Phishing</span>
            </label>
            <label class="choice-chip">
              <input type="radio" name="${email.id}" value="legit">
              <span>✅ Legitimate</span>
            </label>
          </div>
        </div>

        <div class="email-reveal hidden" id="reveal-${email.id}"></div>
      </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', updateProgress);
    });

    // Expose toggle function globally
    window.toggleEmail = toggleEmail;
  }

  function startLab() {
    if (started) return;
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Lab in Progress...';

    renderEmails();
    startTimer();

    feedbackEl.textContent = 'Expand each email to examine full details. Look for red flags in headers, links, and content.';
  }

  function submitLab(e) {
    e.preventDefault();
    if (submitted) return;
    submitted = true;

    stopTimer();
    submitBtn.disabled = true;

    let correct = 0;
    const total = EMAILS.length;

    EMAILS.forEach(email => {
      const selected = document.querySelector(`input[name="${email.id}"]:checked`);
      const card = document.querySelector(`[data-email-id="${email.id}"]`);
      const reveal = document.getElementById(`reveal-${email.id}`);

      if (!selected) return;

      const userAnswer = selected.value;
      const correctAnswer = email.isPhish ? 'phish' : 'legit';
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        correct++;
        card.classList.add('email-card--correct');
      } else {
        card.classList.add('email-card--incorrect');
      }

      let revealHTML = `<div class="reveal-result ${isCorrect ? 'reveal-result--correct' : 'reveal-result--incorrect'}">
        ${isCorrect ? '✅ Correct!' : (email.isPhish ? '❌ This was a phishing email' : '❌ This was legitimate')}
      </div>`;

      if (email.isPhish) {
        revealHTML += `<div><strong>🚩 Red Flags:</strong></div><ul class="reveal-insights">
          ${email.redFlags.map(flag => `<li>${flag}</li>`).join('')}
        </ul>`;
      } else {
        revealHTML += `<div><strong>✅ Legitimate Signals:</strong></div><ul class="reveal-insights">
          ${email.legitimateSignals.map(sig => `<li>${sig}</li>`).join('')}
        </ul>`;
      }

      reveal.innerHTML = revealHTML;
      reveal.classList.remove('hidden');
    });

    const percentage = Math.round((correct / total) * 100);
    let grade, message;

    if (percentage === 100) {
      grade = '🏆 Expert Analyst';
      message = 'Perfect! You identified all phishing emails and legitimate messages correctly.';
    } else if (percentage >= 83) {
      grade = '🎯 Advanced';
      message = `Excellent work! ${correct}/${total} correct. Review the explanations to master the subtle indicators.`;
    } else if (percentage >= 67) {
      grade = '✅ Proficient';
      message = `Good job! ${correct}/${total} correct. Study the red flags and legitimate signals to improve further.`;
    } else {
      grade = '📚 Developing';
      message = `${correct}/${total} correct. Phishing emails can be sophisticated - review each example carefully.`;
    }

    summaryEl.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 8px;">${grade}</div>
      <div>Score: ${correct}/${total} (${percentage}%)</div>
      <div style="margin-top: 8px;">${message}</div>
      <div style="margin-top: 16px;">
        <a href="index.html" class="btn btn--secondary" style="margin-right: 12px;">Back to Hub</a>
        <button onclick="location.reload()" class="btn">Retry Lab</button>
      </div>
    `;
    summaryEl.classList.remove('hidden');

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

    summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  startBtn?.addEventListener('click', startLab);
  form?.addEventListener('submit', submitLab);
})();
