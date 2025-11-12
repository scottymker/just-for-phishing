// sms-smishing-new.js - Realistic texting experience with typing animations
(() => {
  'use strict';

  const START_TIME = 300; // 5 minutes
  let timeRemaining = START_TIME;
  let timerInterval = null;
  let started = false;
  let currentIndex = 0;
  let userAnswers = {};
  let currentScreen = 'waiting'; // 'waiting', 'messaging', 'summary'
  let messageState = 'typing'; // 'typing', 'message_shown', 'answered', 'result_shown'

  const $ = (id) => document.getElementById(id);
  const countdownEl = $('sms-countdown');
  const startBtn = $('start-sms');
  const appContainer = $('sms-app-container');

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
    }
  }

  function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
  }

  function showTypingAnimation() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
    }
  }

  function hideTypingAnimation() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.style.display = 'none';
    }
  }

  function renderPhone() {
    const message = MESSAGES[currentIndex];
    const answeredCount = Object.keys(userAnswers).length;

    let content = `
      <div class="sms-simulator">
        <div class="sms-progress-bar">
          <div class="sms-progress-fill" style="width: ${(answeredCount / MESSAGES.length) * 100}%"></div>
        </div>
        <div class="sms-progress-text">Message ${currentIndex + 1} of ${MESSAGES.length}</div>

        <div class="phone-container">
          <div class="phone-frame-large">
            <div class="phone-notch"></div>

            <div class="phone-screen-large">
              <div class="phone-status-bar">
                <span>📶 Verizon LTE</span>
                <span>${message.time}</span>
                <span>🔋 78%</span>
              </div>

              <div class="messages-header-bar">
                <div class="contact-info">
                  <div class="contact-name">${message.fromLabel}</div>
                  <div class="contact-number">${message.from}</div>
                </div>
              </div>

              <div class="conversation-area" id="conversation-area">
                <div class="message-bubble-container">
                  <div class="message-bubble received hidden" id="message-bubble">
                    ${message.text}
                  </div>
                  <div class="message-time hidden" id="message-time">${message.time}</div>
                </div>

                <div class="typing-indicator" id="typing-indicator">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="answer-section hidden" id="answer-section">
          <h3>Is this message legitimate or smishing?</h3>
          <div class="answer-buttons">
            <button class="answer-btn answer-btn-danger" id="btn-smishing">
              🚨 Smishing Attack
            </button>
            <button class="answer-btn answer-btn-safe" id="btn-legit">
              ✅ Legitimate
            </button>
          </div>
        </div>

        <div class="result-section hidden" id="result-section">
          <!-- Result will be inserted here -->
        </div>
      </div>
    `;

    appContainer.innerHTML = content;

    // Start the message flow
    setTimeout(() => {
      showMessage();
    }, 2000);
  }

  function showMessage() {
    const messageBubble = document.getElementById('message-bubble');
    const messageTime = document.getElementById('message-time');
    const typingIndicator = document.getElementById('typing-indicator');
    const answerSection = document.getElementById('answer-section');

    // Hide typing, show message
    typingIndicator.style.display = 'none';
    messageBubble.classList.remove('hidden');
    messageTime.classList.remove('hidden');

    // Show answer buttons
    setTimeout(() => {
      answerSection.classList.remove('hidden');

      // Add event listeners
      document.getElementById('btn-smishing').addEventListener('click', () => handleAnswer('smishing'));
      document.getElementById('btn-legit').addEventListener('click', () => handleAnswer('legit'));
    }, 500);

    messageState = 'message_shown';
  }

  function handleAnswer(choice) {
    const message = MESSAGES[currentIndex];
    userAnswers[message.id] = { answer: choice, reviewed: true };

    // Hide answer buttons
    document.getElementById('answer-section').classList.add('hidden');

    // Show typing animation
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'flex';

    // After delay, show result
    setTimeout(() => {
      showResult(choice);
    }, 2000);

    messageState = 'answered';
  }

  function showResult(choice) {
    const message = MESSAGES[currentIndex];
    const correct = (choice === 'smishing' && message.isSmishing) || (choice === 'legit' && !message.isSmishing);

    // Hide typing
    document.getElementById('typing-indicator').style.display = 'none';

    // Show result in phone as a response bubble
    const conversationArea = document.getElementById('conversation-area');
    const resultBubble = document.createElement('div');
    resultBubble.className = 'message-bubble-container';
    resultBubble.innerHTML = `
      <div class="message-bubble sent">
        ${choice === 'smishing' ? '🚨 Report as Smishing' : '✅ Looks Legitimate'}
      </div>
      <div class="message-time">${message.time}</div>
    `;
    conversationArea.appendChild(resultBubble);

    // Show detailed result below phone
    const resultSection = document.getElementById('result-section');
    resultSection.innerHTML = `
      <div class="result-card ${correct ? 'result-correct' : 'result-incorrect'}">
        <div class="result-icon">
          ${correct ? '✅' : '❌'}
        </div>
        <div class="result-title">
          ${correct ? 'Correct!' : 'Incorrect'}
        </div>
        <div class="result-explanation">
          ${message.explanation}
        </div>
        <div class="result-details">
          <strong>${message.isSmishing ? '🚩 Red Flags:' : '✅ Legitimate Signals:'}</strong>
          <ul>
            ${(message.isSmishing ? message.redFlags : message.legitimateSignals).map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <button class="continue-btn" id="continue-btn">
          ${currentIndex < MESSAGES.length - 1 ? 'Continue →' : 'View Results'}
        </button>
      </div>
    `;
    resultSection.classList.remove('hidden');

    // Scroll result into view
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Add continue button listener
    document.getElementById('continue-btn').addEventListener('click', () => {
      if (currentIndex < MESSAGES.length - 1) {
        currentIndex++;
        messageState = 'typing';
        renderPhone();
      } else {
        showSummary();
      }
    });

    messageState = 'result_shown';
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
    let grade, gradeColor;

    if (percentage === 100) {
      grade = '🏆 SMS Security Expert';
      gradeColor = 'excellent';
    } else if (percentage >= 83) {
      grade = '🛡️ Advanced';
      gradeColor = 'good';
    } else if (percentage >= 67) {
      grade = '✅ Proficient';
      gradeColor = 'good';
    } else {
      grade = '📚 Developing';
      gradeColor = 'developing';
    }

    appContainer.innerHTML = `
      <div class="summary-screen">
        <div class="summary-card">
          <div class="summary-icon">📱</div>
          <h2>Simulation Complete!</h2>

          <div class="summary-score ${gradeColor}">${percentage}%</div>
          <div class="summary-grade">${grade}</div>
          <div class="summary-breakdown">${correct} out of ${total} correct</div>

          <div class="summary-stats">
            <div class="stat-item">
              <div class="stat-value">${correct}</div>
              <div class="stat-label">Correct</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${total - correct}</div>
              <div class="stat-label">Incorrect</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">${percentage}%</div>
              <div class="stat-label">Accuracy</div>
            </div>
          </div>

          <div class="summary-actions">
            <button onclick="location.reload()" class="btn btn--sms">Retry Simulation</button>
            <a href="index.html" class="btn btn--secondary">Back to Hub</a>
          </div>
        </div>
      </div>
    `;

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
    currentScreen = 'messaging';

    renderPhone();
    startTimer();
  }

  startBtn?.addEventListener('click', startSimulation);
})();
