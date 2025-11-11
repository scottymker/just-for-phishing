// sms-smishing.js - Refactored for one-at-a-time display
(() => {
  'use strict';

  const START_TIME = 300; // 5 minutes
  let timeRemaining = START_TIME;
  let timerInterval = null;
  let started = false;
  let currentIndex = 0;
  let userAnswers = {};

  const $ = (id) => document.getElementById(id);
  const countdownEl = $('sms-countdown');
  const startBtn = $('start-sms');
  const smsContainer = $('sms-container');
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
    const answeredCount = Object.keys(userAnswers).length;
    progressEl.textContent = `${answeredCount}/${MESSAGES.length} reviewed`;
  }

  function renderMessage(index) {
    const message = MESSAGES[index];
    const hasAnswer = userAnswers[message.id] !== undefined;
    const isReviewing = hasAnswer && userAnswers[message.id].reviewed;

    let content = `
      <div class="scenario-single sms-single" data-message-id="${message.id}">
        <div class="scenario-progress-bar">
          <div class="progress-fill" style="width: ${((index + 1) / MESSAGES.length) * 100}%"></div>
        </div>

        <div class="scenario-number">Message ${index + 1} of ${MESSAGES.length}</div>

        <h2 class="scenario-title">📱 SMS Analysis</h2>

        <div class="sms-phone-view">
          <div class="phone-header">
            <div class="phone-status-bar">
              <span>📶 Verizon LTE</span>
              <span>${message.time}</span>
              <span>🔋 78%</span>
            </div>
          </div>

          <div class="sms-conversation">
            <div class="sms-bubble-container">
              <div class="sms-sender-info">
                <div class="sender-name">${message.fromLabel}</div>
                <div class="sender-number">${message.from}</div>
              </div>
              <div class="sms-bubble">
                ${message.text}
              </div>
              <div class="sms-timestamp">${message.time}</div>
            </div>
          </div>
        </div>
    `;

    if (!isReviewing) {
      content += `
        <div class="scenario-question">
          <p class="question-text">Is this message legitimate or smishing?</p>
          <div class="choice-buttons">
            <button class="choice-btn choice-btn--danger" data-choice="smishing">
              🚨 Smishing Attack
            </button>
            <button class="choice-btn choice-btn--safe" data-choice="legit">
              ✅ Legitimate
            </button>
          </div>
        </div>
      `;
    } else {
      const userChoice = userAnswers[message.id].answer;
      const correct = (userChoice === 'smishing' && message.isSmishing) || (userChoice === 'legit' && !message.isSmishing);

      content += `
        <div class="scenario-result ${correct ? 'result-correct' : 'result-incorrect'}">
          <div class="result-header">
            ${correct ? '✅ Correct!' : '❌ Incorrect'}
          </div>
          <div class="result-verdict">
            <strong>${message.explanation}</strong>
          </div>

          <div class="result-insights">
            <strong>${message.isSmishing ? '🚩 Red Flags:' : '✅ Legitimate Signals:'}</strong>
            <ul>
              ${(message.isSmishing ? message.redFlags : message.legitimateSignals).map(insight => `<li>${insight}</li>`).join('')}
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
            ${index === MESSAGES.length - 1 ? 'Finish' : 'Next'} →
          </button>
        </div>
      </div>
    `;

    smsContainer.innerHTML = content;

    // Add event listeners for choice buttons
    if (!isReviewing) {
      document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleChoice(message.id, btn.dataset.choice));
      });
    }

    // Navigation buttons
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      if (index > 0) {
        currentIndex--;
        renderMessage(currentIndex);
      }
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      if (index < MESSAGES.length - 1) {
        currentIndex++;
        renderMessage(currentIndex);
      } else {
        showSummary();
      }
    });
  }

  function handleChoice(messageId, choice) {
    userAnswers[messageId] = { answer: choice, reviewed: true };
    updateProgress();
    renderMessage(currentIndex);
  }

  function showSummary() {
    stopTimer();

    let correct = 0;
    MESSAGES.forEach(msg => {
      const userAnswer = userAnswers[msg.id];
      if (!userAnswer) return;

      const isCorrect = (userAnswer.answer === 'smishing' && msg.isSmishing) ||
                       (userAnswer.answer === 'legit' && !msg.isSmishing);
      if (isCorrect) correct++;
    });

    const total = MESSAGES.length;
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
      <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="lab.html" class="btn btn--secondary">← Back to Lab</a>
        <button onclick="location.reload()" class="btn btn--sms">Retry Simulation</button>
        <button id="review-btn" class="btn">Review Answers</button>
      </div>
    `;
    summaryEl.classList.remove('hidden');
    smsContainer.innerHTML = '';

    document.getElementById('review-btn')?.addEventListener('click', () => {
      summaryEl.classList.add('hidden');
      currentIndex = 0;
      renderMessage(currentIndex);
    });

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
  }

  function startSimulation() {
    if (started) return;
    started = true;
    startBtn.disabled = true;
    startBtn.textContent = 'Simulation Running...';

    currentIndex = 0;
    userAnswers = {};

    renderMessage(currentIndex);
    startTimer();
    updateProgress();

    feedbackEl.textContent = 'Examine each text message for red flags.';
  }

  startBtn?.addEventListener('click', startSimulation);
})();
