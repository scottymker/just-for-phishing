// email-lab.js - Redesigned with step-by-step flow
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

  const EMAILS = window.EMAIL_LAB_SCENARIOS;

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
          <div class="instructions-icon"><i data-lucide="microscope" class="icon icon--xl"></i></div>
          <h2>Welcome to the Email Phishing Lab</h2>
          <p class="instructions-intro">
            You'll analyze 6 real-world email scenarios to identify phishing attempts.
            Take your time to examine each email carefully.
          </p>

          <div class="instructions-section">
            <h3><i data-lucide="clipboard-list" class="icon"></i> What You'll Do</h3>
            <ul class="instructions-list">
              <li><strong>Review each email</strong> — Examine the complete headers, links, and content</li>
              <li><strong>Look for red flags</strong> — Suspicious domains, urgency tactics, poor grammar</li>
              <li><strong>Make your decision</strong> — Is it legitimate or phishing?</li>
              <li><strong>Learn from feedback</strong> — See detailed explanations after each answer</li>
            </ul>
          </div>

          <div class="instructions-section">
            <h3><i data-lucide="search" class="icon"></i> Key Indicators to Check</h3>
            <div class="indicators-grid">
              <div class="indicator-item">
                <span class="indicator-icon"><i data-lucide="mail" class="icon icon--xl"></i></span>
                <strong>Sender Domain</strong>
                <p>Verify the email address matches the company</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon"><i data-lucide="link" class="icon icon--xl"></i></span>
                <strong>Links & URLs</strong>
                <p>Hover over links to see real destinations</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon"><i data-lucide="paperclip" class="icon icon--xl"></i></span>
                <strong>Attachments</strong>
                <p>Be wary of unexpected files, especially .exe</p>
              </div>
              <div class="indicator-item">
                <span class="indicator-icon"><i data-lucide="triangle-alert" class="icon icon--xl"></i></span>
                <strong>Urgency Tactics</strong>
                <p>Threats and pressure are phishing red flags</p>
              </div>
            </div>
          </div>

          <div class="instructions-footer">
            <div class="time-note">
              <strong><i data-lucide="timer" class="icon"></i> Recommended Time:</strong> 15 minutes (not enforced)
            </div>
            <button id="begin-lab-btn" class="btn btn-primary btn-large">
              Begin Lab →
            </button>
          </div>
        </div>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: appContainer.querySelectorAll('[data-lucide]') });

    document.getElementById('begin-lab-btn')?.addEventListener('click', () => {
      currentScreen = 'scenario';
      currentIndex = 0;
      userAnswers = {};
      window.JFPAnalytics?.trackModuleStart('email_phishing_lab');
      startTimer();
      startBtn.style.display = 'none';
      renderScenario();
    });
  }

  // Helper: extract domain from an email address string like "Name <user@domain.com>"
  function extractDomain(emailStr) {
    const m = emailStr.match(/@([\w.-]+)/);
    return m ? m[1].toLowerCase() : '';
  }

  // Helper: patch links in rendered email body
  function patchLinks(emailId) {
    const body = document.getElementById('email-body-' + emailId);
    if (!body) return;
    body.querySelectorAll('a[href]').forEach(a => {
      const url = a.getAttribute('href');
      if (!url || url.startsWith('javascript:')) return;
      a.dataset.url = url;
      a.setAttribute('href', 'javascript:void(0)');
      a.classList.add('sim-link');
      const tip = document.createElement('span');
      tip.className = 'link-url-preview';
      tip.textContent = url;
      a.appendChild(tip);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showLinkInspector(emailId, url);
      });
    });
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: body.querySelectorAll('[data-lucide]') });
  }

  // Helper: show link inspector panel
  function showLinkInspector(emailId, url) {
    const panel = document.getElementById('link-inspector-' + emailId);
    const panelBody = document.getElementById('link-inspector-body-' + emailId);
    if (!panel || !panelBody) return;

    let protocol = '', domain = '', path = '';
    try {
      const u = new URL(url);
      protocol = u.protocol;
      domain = u.hostname;
      path = u.pathname + u.search;
    } catch(_) {
      domain = url;
    }

    const isHttp = protocol === 'http:';
    const knownDomains = ['microsoft.com','chase.com','ups.com','yourcompany.com','lms.yourcompany.com','hrportal.yourcompany.com'];
    const isKnown = knownDomains.some(d => domain === d || domain.endsWith('.' + d));
    const isSuspicious = isHttp || !isKnown;

    panelBody.innerHTML = `
      <div class="link-part"><span class="link-part-label">Full URL</span><span style="font-family:var(--font-mono);font-size:.8rem;word-break:break-all">${url}</span></div>
      <div class="link-part"><span class="link-part-label">Protocol</span><span>${protocol || 'unknown'}${isHttp ? ' <strong style="color:var(--red)">(unencrypted — no HTTPS)</strong>' : ''}</span></div>
      <div class="link-part"><span class="link-part-label">Domain</span><span>${domain}${!isKnown ? ' <span style="color:var(--text-secondary);font-size:.8rem">(not a known-legit domain)</span>' : ''}</span></div>
      <div class="link-part"><span class="link-part-label">Path</span><span>${path || '/'}</span></div>
      <span class="link-risk ${isSuspicious ? 'link-risk--warn' : 'link-risk--ok'}">
        ${isSuspicious ? '<i data-lucide="triangle-alert" class="icon icon--sm"></i> Suspicious' : '<i data-lucide="circle-check" class="icon icon--sm"></i> Looks OK'}
      </span>
    `;
    panel.style.display = 'block';
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: panel.querySelectorAll('[data-lucide]') });

    if (typeof gtag === 'function') gtag('event', 'link_inspected', { url_protocol: protocol });
  }

  function renderScenario() {
    const email = EMAILS[currentIndex];
    const hasAnswer = userAnswers[email.id] !== undefined;

    const fromDomain = extractDomain(email.from);
    const replyDomain = extractDomain(email.replyTo);
    const replyMismatch = fromDomain && replyDomain && fromDomain !== replyDomain;

    const brandColors = {
      microsoft: '#0078d4', hr: '#1f5c99', ups: '#351c15',
      chase: '#117ace', corporate: '#2c3e50', itsec: '#1a6b3a'
    };
    const brandColor = brandColors[email.brand] || '#333';

    const emailDisplay = `
      <div class="email-client-chrome">
        <div class="email-brand-header" style="background:${brandColor}">
          <span class="brand-name">${(email.brand || 'Email').replace(/^\w/, c => c.toUpperCase())}</span>
        </div>
        <div class="email-meta-panel">
          <div class="email-meta-field">
            <span class="meta-label">From</span>
            <span class="meta-value">${email.from}</span>
          </div>
          <div class="email-meta-field ${replyMismatch ? 'meta-mismatch' : ''}">
            <span class="meta-label">Reply-To</span>
            <span class="meta-value">${email.replyTo}</span>
          </div>
          <div class="email-meta-field">
            <span class="meta-label">To</span>
            <span class="meta-value">${email.to}</span>
          </div>
          <div class="email-meta-field">
            <span class="meta-label">Date</span>
            <span class="meta-value">${email.date}</span>
          </div>
          <div class="email-meta-field">
            <span class="meta-label">Subject</span>
            <span class="meta-value subject-value">${email.subject}</span>
          </div>
        </div>
        <div class="email-body-render" id="email-body-${email.id}">
          ${email.htmlBody || email.body.replace(/\n/g, '<br>')}
        </div>
        ${email.attachments && email.attachments.length > 0 ? `
        <div class="email-attach-bar">
          <i data-lucide="paperclip" class="icon"></i>
          <strong>Attachment:</strong> ${email.attachments.join(', ')}
        </div>` : ''}
        <div class="link-inspector" id="link-inspector-${email.id}" style="display:none;">
          <div class="link-inspector-header">
            <span><i data-lucide="search" class="icon"></i> Link Inspector</span>
            <span id="link-inspector-close-${email.id}" style="cursor:pointer;font-size:.8rem;display:flex;align-items:center;gap:4px;"><i data-lucide="x" class="icon icon--sm"></i> Close</span>
          </div>
          <div class="link-inspector-body" id="link-inspector-body-${email.id}"></div>
        </div>
      </div>
    `;

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
          <h2 class="scenario-title"><i data-lucide="mail" class="icon"></i> Analyze This Email</h2>

          ${emailDisplay}
    `;

    if (!hasAnswer) {
      content += `
          <div class="scenario-question">
            <p class="question-text">Is this email legitimate or phishing?</p>
            <div class="choice-buttons">
              <button class="choice-btn choice-btn--danger" data-choice="phish">
                <i data-lucide="shield-alert" class="icon"></i> Phishing
              </button>
              <button class="choice-btn choice-btn--safe" data-choice="legit">
                <i data-lucide="circle-check" class="icon"></i> Legitimate
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
              ${correct ? '<i data-lucide="circle-check" class="icon"></i> Correct!' : '<i data-lucide="circle-x" class="icon"></i> Incorrect'}
            </div>
            <div class="result-verdict">
              This email was <strong>${email.isPhish ? 'phishing' : 'legitimate'}</strong>.
            </div>

            <div class="result-insights">
              <strong>${email.isPhish ? '<i data-lucide="flag" class="icon"></i> Red Flags:' : '<i data-lucide="circle-check" class="icon"></i> Legitimate Signals:'}</strong>
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

    patchLinks(email.id);
    const closeBtn = document.getElementById('link-inspector-close-' + email.id);
    if (closeBtn) closeBtn.addEventListener('click', () => {
      document.getElementById('link-inspector-' + email.id).style.display = 'none';
    });
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: appContainer.querySelectorAll('[data-lucide]') });

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

    // renderScenario() replaces the container wholesale, which destroys focus
    // and leaves a screen reader with nothing to announce.
    const email = EMAILS.find(e => e.id === emailId);
    const correct = (choice === 'phish' && email.isPhish) || (choice === 'legit' && !email.isPhish);
    const signals = (email.isPhish ? email.redFlags : email.legitimateSignals) || [];
    window.JFPA11y?.announce(
      (correct ? 'Correct. ' : 'Incorrect. ')
      + 'This email was ' + (email.isPhish ? 'phishing' : 'legitimate') + '. '
      + (signals[0] || '')
    );
    window.JFPA11y?.focus(appContainer.querySelector('.result-header'));
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
    window.JFPAnalytics?.trackModuleComplete('email_phishing_lab', { correct, total, percentage });
    let grade, gradeClass, message;

    if (percentage === 100) {
      grade = '<i data-lucide="trophy" class="icon"></i> Expert Analyst';
      gradeClass = 'excellent';
      message = 'Perfect score! You identified all phishing emails and legitimate messages correctly. Your threat detection skills are outstanding.';
    } else if (percentage >= 83) {
      grade = '<i data-lucide="target" class="icon"></i> Advanced';
      gradeClass = 'good';
      message = `Excellent work! You got ${correct} out of ${total} correct. Review the explanations to master those subtle indicators.`;
    } else if (percentage >= 67) {
      grade = '<i data-lucide="circle-check" class="icon"></i> Proficient';
      gradeClass = 'fair';
      message = `Good job! You scored ${correct} out of ${total}. Study the red flags and legitimate signals to improve further.`;
    } else {
      grade = '<i data-lucide="book-open" class="icon"></i> Developing';
      gradeClass = 'poor';
      message = `You got ${correct} out of ${total} correct. Phishing emails can be sophisticated—review each example carefully to sharpen your skills.`;
    }

    appContainer.innerHTML = `
      <div class="summary-screen">
        <div class="summary-card">
          <div class="summary-icon"><i data-lucide="graduation-cap" class="icon icon--xl"></i></div>
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
              <div class="stat-icon"><i data-lucide="circle-check" class="icon"></i></div>
              <div class="stat-label">Correct</div>
              <div class="stat-value">${correct}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon"><i data-lucide="circle-x" class="icon"></i></div>
              <div class="stat-label">Incorrect</div>
              <div class="stat-value">${total - correct}</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon"><i data-lucide="bar-chart-3" class="icon"></i></div>
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
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: appContainer.querySelectorAll('[data-lucide]') });

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
          <div class="placeholder-icon"><i data-lucide="mail" class="icon icon--xl"></i></div>
          <h2>Email Phishing Lab</h2>
          <p>Click "Start Lab" above to begin your training</p>
        </div>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: appContainer.querySelectorAll('[data-lucide]') });
  }

  init();
})();
