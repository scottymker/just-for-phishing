// sms-smishing.js
(() => {
  'use strict';

  const START_TIME = 300; // 5 minutes
  let timeRemaining = START_TIME;
  let timerInterval = null;
  let started = false;
  let submitted = false;
  let currentMessageIndex = 0;

  const $ = (id) => document.getElementById(id);
  const countdownEl = $('sms-countdown');
  const startBtn = $('start-sms');
  const form = $('sms-form');
  const smsList = $('sms-list');
  const verdictArea = $('sms-verdict-area');
  const submitBtn = $('submit-sms');
  const progressEl = $('sms-progress');
  const feedbackEl = $('sms-feedback');
  const summaryEl = $('sms-summary');

  const MESSAGES = [
    {
      id: 'package-delivery',
      from: '+1 (844) 555-0193',
      fromLabel: 'Unknown',
      time: '9:42 AM',
      text: 'USPS: Your package is waiting for pickup. Confirm delivery address and pay $3.99 redelivery fee: http://bit.ly/usps-pkge-24h',
      isSmishing: true,
      explanation: 'Classic smishing scam using urgency and small payment request.',
      redFlags: [
        'USPS doesn\'t text from random numbers - they use short codes like 28777 or 47722',
        'Bit.ly shortened URL hides the real (malicious) destination',
        'Small fee ($3.99) makes people less suspicious but leads to credit card theft',
        'USPS redelivery is free and arranged through usps.com, not text links'
      ]
    },
    {
      id: 'bank-fraud',
      from: '+1 (866) 234-7890',
      fromLabel: 'Wells Fargo (saved)',
      time: '10:15 AM',
      text: 'Wells Fargo Alert: We blocked a suspicious charge of $892.34. To verify your account, reply YES or NO.',
      isSmishing: false,
      explanation: 'This resembles legitimate bank fraud alerts sent from known numbers.',
      legitimateSignals: [
        'Banks do send fraud alerts from known numbers (verify independently)',
        'Simple YES/NO response doesn\'t ask for sensitive data',
        'No suspicious links or requests for login credentials',
        'However, still best to call the bank directly using the number on your card'
      ]
    },
    {
      id: 'prize-winner',
      from: '+1 (323) 555-8472',
      fromLabel: 'Unknown',
      time: '11:03 AM',
      text: 'Congratulations! You\'ve been selected as a Walmart gift card winner! Claim your $500 reward now: walmart-rewards-center.com/claim?id=849273',
      isSmishing: true,
      explanation: 'Fake prize scam designed to steal personal information.',
      redFlags: [
        'You didn\'t enter any Walmart contest or sweepstakes',
        'Domain "walmart-rewards-center.com" is NOT walmart.com',
        'Legitimate companies don\'t notify contest winners via random text',
        'Link likely leads to phishing site requesting SSN, credit card, or banking info'
      ]
    },
    {
      id: 'account-suspension',
      from: '+1 (650) 555-3091',
      fromLabel: 'Unknown',
      time: '12:37 PM',
      text: 'ALERT: Your Amazon Prime account has been suspended due to billing failure. Update payment method immediately to restore service: amzn-account-services.com/verify',
      isSmishing: true,
      explanation: 'Account suspension scam exploiting fear of losing service.',
      redFlags: [
        'Domain "amzn-account-services.com" is fake (real is amazon.com)',
        'Amazon doesn\'t suspend accounts without email warnings first',
        'Urgent language "immediately" pressures quick action without verification',
        'Grammar is slightly off ("billing failure" vs "payment issue")'
      ]
    },
    {
      id: 'appointment-reminder',
      from: '+1 (555) 123-4567',
      fromLabel: 'Dr. Martinez Office',
      time: '2:18 PM',
      text: 'Reminder: Your appointment with Dr. Martinez is tomorrow (Nov 12) at 2:00 PM. Reply CONFIRM or call 555-123-4567 to reschedule.',
      isSmishing: false,
      explanation: 'Legitimate appointment reminder from saved contact.',
      legitimateSignals: [
        'Sender is in your contacts (you saved this number)',
        'Appointment details match your calendar',
        'Provides callback number that matches the contact',
        'Simple CONFIRM reply doesn\'t request sensitive information',
        'Professional tone without urgency or threats'
      ]
    },
    {
      id: 'tax-refund',
      from: '+1 (202) 555-7834',
      fromLabel: 'Unknown',
      time: '4:52 PM',
      text: 'IRS: You have a pending tax refund of $1,247.00. Claim within 48 hours: irs-treasury-refund.com/claim Enter your SSN and bank info to receive direct deposit.',
      isSmishing: true,
      explanation: 'IRS impersonation scam to steal identity and banking information.',
      redFlags: [
        'IRS NEVER initiates contact via text message - only postal mail',
        'Domain "irs-treasury-refund.com" is fake (real is irs.gov)',
        'Artificial urgency ("48 hours") is a pressure tactic',
        'Requesting SSN and bank info via text/website is a major red flag',
        'IRS refunds are processed automatically through your tax return'
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

      if (timeRemaining <= 30) {
        countdownEl.classList.add('countdown--danger');
      } else if (timeRemaining <= 90) {
        countdownEl.classList.add('countdown--warning');
      }
    } else {
      stopTimer();
      feedbackEl.textContent = '⏰ Time expired! Continue at your own pace.';
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
    progressEl.textContent = `${answered}/6 reviewed`;

    if (answered === 6) {
      submitBtn.disabled = false;
      feedbackEl.textContent = '✅ All messages analyzed! Submit when ready.';
    }
  }

  function selectMessage(messageId) {
    // Highlight selected message
    document.querySelectorAll('.sms-message').forEach(msg => {
      msg.classList.remove('sms-message--active');
    });
    document.querySelector(`[data-message-id="${messageId}"]`)?.classList.add('sms-message--active');

    // Show verdict options for this message
    const message = MESSAGES.find(m => m.id === messageId);
    verdictArea.innerHTML = `
      <div class="verdict-section">
        <div class="verdict-message-info">
          <div><strong>Analyzing:</strong> Message from ${message.fromLabel}</div>
          <div class="verdict-message-preview">"${message.text.substring(0, 80)}${message.text.length > 80 ? '...' : ''}"</div>
        </div>

        <div class="verdict-label">Is this message legitimate or smishing?</div>
        <div class="scenario-choice-row">
          <label class="choice-chip choice-chip--danger">
            <input type="radio" name="${message.id}" value="smishing" required>
            <span>🚨 Smishing</span>
          </label>
          <label class="choice-chip">
            <input type="radio" name="${message.id}" value="legit">
            <span>✅ Legitimate</span>
          </label>
        </div>
      </div>
    `;

    // Add event listeners for new radio buttons
    document.querySelectorAll(`input[name="${message.id}"]`).forEach(input => {
      input.addEventListener('change', () => {
        updateProgress();
        // Automatically move to next message
        const currentIdx = MESSAGES.findIndex(m => m.id === messageId);
        if (currentIdx < MESSAGES.length - 1) {
          setTimeout(() => {
            selectMessage(MESSAGES[currentIdx + 1].id);
          }, 500);
        }
      });
    });
  }

  function renderMessages() {
    smsList.innerHTML = MESSAGES.map((msg, idx) => `
      <div class="sms-message ${idx === 0 ? 'sms-message--active' : ''}"
           data-message-id="${msg.id}"
           onclick="window.selectSMS('${msg.id}')">
        <div class="sms-header">
          <div class="sms-sender">${msg.fromLabel}</div>
          <div class="sms-time">${msg.time}</div>
        </div>
        <div class="sms-from">${msg.from}</div>
        <div class="sms-text">${msg.text}</div>
        <div class="sms-reveal hidden" id="sms-reveal-${msg.id}"></div>
      </div>
    `).join('');

    // Select first message
    selectMessage(MESSAGES[0].id);

    // Expose global function
    window.selectSMS = selectMessage;
  }

  function startSimulation() {
    if (started) return;
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Simulation Running...';

    renderMessages();
    startTimer();

    feedbackEl.textContent = 'Click each message to analyze it. Look for red flags before making your decision.';
  }

  function submitAnalysis(e) {
    e.preventDefault();
    if (submitted) return;
    submitted = true;

    stopTimer();
    submitBtn.disabled = true;

    let correct = 0;
    const total = MESSAGES.length;

    MESSAGES.forEach(msg => {
      const selected = document.querySelector(`input[name="${msg.id}"]:checked`);
      const messageCard = document.querySelector(`[data-message-id="${msg.id}"]`);
      const reveal = document.getElementById(`sms-reveal-${msg.id}`);

      if (!selected) return;

      const userAnswer = selected.value;
      const correctAnswer = msg.isSmishing ? 'smishing' : 'legit';
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        correct++;
        messageCard.classList.add('sms-message--correct');
      } else {
        messageCard.classList.add('sms-message--incorrect');
      }

      let revealHTML = `
        <div class="reveal-result ${isCorrect ? 'reveal-result--correct' : 'reveal-result--incorrect'}">
          ${isCorrect ? '✅ Correct!' : (msg.isSmishing ? '❌ This was smishing' : '❌ This was legitimate')}
        </div>
        <div style="margin-top:8px;"><strong>${msg.explanation}</strong></div>
      `;

      if (msg.isSmishing) {
        revealHTML += `<ul class="reveal-insights">${msg.redFlags.map(flag => `<li>${flag}</li>`).join('')}</ul>`;
      } else {
        revealHTML += `<ul class="reveal-insights">${msg.legitimateSignals.map(sig => `<li>${sig}</li>`).join('')}</ul>`;
      }

      reveal.innerHTML = revealHTML;
      reveal.classList.remove('hidden');
    });

    const percentage = Math.round((correct / total) * 100);
    let grade, message;

    if (percentage === 100) {
      grade = '🏆 SMS Security Expert';
      message = 'Perfect! You correctly identified all smishing and legitimate messages.';
    } else if (percentage >= 83) {
      grade = '🛡️ Advanced';
      message = `Great work! ${correct}/${total} correct. You have strong smishing detection skills.`;
    } else if (percentage >= 67) {
      grade = '✅ Proficient';
      message = `Good job! ${correct}/${total} correct. Review the red flags to strengthen your awareness.`;
    } else {
      grade = '📚 Learning';
      message = `${correct}/${total} correct. Smishing is increasingly sophisticated - study the examples carefully.`;
    }

    summaryEl.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 8px;">${grade}</div>
      <div>Score: ${correct}/${total} (${percentage}%)</div>
      <div style="margin-top: 8px;">${message}</div>
      <div style="margin-top: 16px;">
        <a href="index.html" class="btn btn--secondary" style="margin-right: 12px;">Back to Hub</a>
        <button onclick="location.reload()" class="btn btn--sms">Retry Simulation</button>
      </div>
    `;
    summaryEl.classList.remove('hidden');

    // Save progress
    try {
      const progress = JSON.parse(localStorage.getItem('phishing-training-progress') || '{}');
      progress.smsSmishing = {
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

  startBtn?.addEventListener('click', startSimulation);
  form?.addEventListener('submit', submitAnalysis);

  // Update phone time
  function updatePhoneTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const timeEl = $('phone-time');
    if (timeEl) timeEl.textContent = timeStr;
  }
  updatePhoneTime();
  setInterval(updatePhoneTime, 60000);
})();
