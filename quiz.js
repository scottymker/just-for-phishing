// Quiz Questions — loaded from data/quiz-questions.js (window.QUIZ_QUESTIONS)
const quizQuestions = window.QUIZ_QUESTIONS;

// Quiz State
// `answers` is the single source of truth, indexed by question. Score and the
// category breakdown are derived from it, so revisiting a question can never
// double-count — see answerFor()/getScore()/getCategoryScores() below.
let currentQuestionIndex = 0;
let answers = [];

const CATEGORIES = [
  "Phishing Detection",
  "Multi-Factor Authentication (MFA)",
  "Password Security",
  "Social Engineering",
  "Safe Browsing"
];

function answerFor(index) {
  return answers[index] || null;
}

function getScore() {
  return answers.reduce((total, answer) => total + (answer && answer.correct ? 1 : 0), 0);
}

function getCategoryScores() {
  const scores = {};
  CATEGORIES.forEach(category => {
    scores[category] = { correct: 0, total: 0 };
  });

  answers.forEach((answer, index) => {
    if (!answer) return;
    const category = quizQuestions[index].category;
    if (!scores[category]) scores[category] = { correct: 0, total: 0 };
    scores[category].total++;
    if (answer.correct) scores[category].correct++;
  });

  return scores;
}

// Initialize quiz
function initQuiz() {
  window.JFPAnalytics?.trackModuleStart('security_awareness_quiz');
  currentQuestionIndex = 0;
  answers = [];

  displayQuestion();
}

// Display current question
function displayQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  const questionCard = document.getElementById('question-card');
  const summaryCard = document.getElementById('summary-card');
  const feedbackCard = document.getElementById('feedback-card');
  const nextBtn = document.getElementById('next-btn');
  const prevBtn = document.getElementById('prev-btn');

  // Show question card, hide summary
  questionCard.classList.remove('hidden');
  summaryCard.classList.add('hidden');
  feedbackCard.classList.remove('show');

  // Update progress
  const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  document.getElementById('progress-fill').style.width = progressPercent + '%';
  document.getElementById('progress-text').textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

  // Update question number badge
  document.getElementById('question-number').textContent = `Question ${currentQuestionIndex + 1}`;

  // Update question text
  document.getElementById('question-text').textContent = question.question;

  // Create options
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, index) => {
    const optionElement = document.createElement('button');
    optionElement.type = 'button';
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => selectAnswer(index));
    optionElement.dataset.index = index;
    optionsContainer.appendChild(optionElement);
  });

  nextBtn.textContent = currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz →' : 'Next Question →';

  // Show/hide previous button
  if (currentQuestionIndex > 0) {
    prevBtn.classList.remove('hidden');
  } else {
    prevBtn.classList.add('hidden');
  }

  // If this question has already been answered, render it locked. This runs on
  // every navigation, forward and back, so an answered question can never be
  // presented as answerable a second time.
  const existing = answerFor(currentQuestionIndex);
  if (existing) {
    renderAnsweredState(existing, question);
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }

  // Add apple animation
  createFallingApple();
}

// Paint an already-answered question: options locked, correct answer marked,
// feedback card restored.
function renderAnsweredState(answer, question) {
  const options = document.querySelectorAll('.option');

  options.forEach(opt => {
    opt.classList.add('disabled');
    opt.disabled = true;
  });

  options[answer.selectedIndex].classList.add('selected');
  options[answer.selectedIndex].classList.add(answer.correct ? 'correct' : 'incorrect');
  if (!answer.correct) {
    options[question.correctIndex].classList.add('correct');
  }

  showFeedback(answer.correct, question);
}

// Select answer
function selectAnswer(index) {
  const question = quizQuestions[currentQuestionIndex];
  const options = document.querySelectorAll('.option');

  // If already answered, don't allow change
  if (answerFor(currentQuestionIndex)) return;

  const isCorrect = index === question.correctIndex;

  // Record the answer at its question's own slot, so re-entering the question
  // overwrites rather than appends.
  answers[currentQuestionIndex] = {
    questionIndex: currentQuestionIndex,
    selectedIndex: index,
    correct: isCorrect
  };

  // Lock the options immediately — the reveal below is animated, but the
  // question is already closed.
  options.forEach(opt => {
    opt.classList.add('disabled');
    opt.disabled = true;
  });
  options[index].classList.add('selected');

  setTimeout(() => {
    if (isCorrect) {
      options[index].classList.add('correct');
    } else {
      options[index].classList.add('incorrect');
      // Also show the correct answer
      options[question.correctIndex].classList.add('correct');
    }

    // Show feedback
    showFeedback(isCorrect, question);

    // Enable next button
    document.getElementById('next-btn').disabled = false;
  }, 300);
}

// Show feedback
function showFeedback(isCorrect, question) {
  const feedbackCard = document.getElementById('feedback-card');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackCategory = document.getElementById('feedback-category');

  feedbackCard.className = 'feedback-card show ' + (isCorrect ? 'correct' : 'incorrect');
  feedbackIcon.innerHTML = isCorrect ? '<i data-lucide="circle-check" class="icon"></i>' : '<i data-lucide="circle-x" class="icon"></i>';
  if (typeof lucide !== 'undefined') lucide.createIcons({ els: feedbackIcon.querySelectorAll('[data-lucide]') });
  feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Not Quite';
  feedbackText.innerHTML = `
    <strong>${question.explanation}</strong><br><br>
    <em><i data-lucide="lightbulb" class="icon"></i> ${question.tips}</em>
  `;
  if (typeof lucide !== 'undefined') lucide.createIcons({ els: feedbackText.querySelectorAll('[data-lucide]') });
  feedbackCategory.textContent = `${question.category}`;
}

// Next question
function nextQuestion() {
  if (!answerFor(currentQuestionIndex)) return;

  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    showSummary();
  }
}

// Previous question (view only, can't change answer)
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

// Show summary
function showSummary() {
  const questionCard = document.getElementById('question-card');
  const summaryCard = document.getElementById('summary-card');
  const feedbackCard = document.getElementById('feedback-card');
  const navButtons = document.querySelector('.nav-buttons');
  const progressSection = document.querySelector('.progress-section');

  // Hide question elements
  questionCard.classList.add('hidden');
  feedbackCard.classList.remove('show');
  navButtons.classList.add('hidden');
  progressSection.classList.add('hidden');

  // Show summary
  summaryCard.classList.remove('hidden');

  // Derive the score from the recorded answers, so it can never exceed the
  // number of questions no matter how the learner navigated to get here.
  const score = getScore();
  const percentage = Math.round((score / quizQuestions.length) * 100);

  // Update score
  document.getElementById('summary-score').textContent = `${score}/${quizQuestions.length}`;

  // Set icon and message based on score
  const summaryIcon = document.getElementById('summary-icon');
  const summaryMessage = document.getElementById('summary-message');

  if (percentage >= 80) {
    summaryIcon.innerHTML = '<i data-lucide="star" class="icon"></i>';
    summaryMessage.textContent = "Outstanding! You have strong cybersecurity awareness. Keep up the excellent work and stay vigilant!";
  } else if (percentage >= 60) {
    summaryIcon.innerHTML = '<i data-lucide="thumbs-up" class="icon"></i>';
    summaryMessage.textContent = "Good job! You have a solid foundation, but there's room for improvement. Review the areas below to strengthen your security knowledge.";
  } else if (percentage >= 40) {
    summaryIcon.innerHTML = '<i data-lucide="book-open" class="icon"></i>';
    summaryMessage.textContent = "You're on the right track, but there are some important gaps in your knowledge. Focus on the areas below to improve your security awareness.";
  } else {
    summaryIcon.innerHTML = '<i data-lucide="triangle-alert" class="icon"></i>';
    summaryMessage.textContent = "Your security awareness needs improvement. Don't worry - everyone starts somewhere! Review the feedback carefully and consider retaking the quiz.";
  }
  if (typeof lucide !== 'undefined') lucide.createIcons({ els: summaryIcon.querySelectorAll('[data-lucide]') });

  window.JFPAnalytics?.trackModuleComplete('security_awareness_quiz', {
    correct: score,
    total: quizQuestions.length,
    percentage,
  });

  // Show knowledge areas
  displayKnowledgeAreas();

  // Create celebration animation
  if (percentage >= 80) {
    createCelebration();
  }

  try {
    const progress = JSON.parse(localStorage.getItem('phishing-training-progress') || '{}');
    progress.securityAwarenessQuiz = {
      completed: true,
      score,
      total: quizQuestions.length,
      percentage,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem('phishing-training-progress', JSON.stringify(progress));
  } catch (_e) {}
}

// Display knowledge areas breakdown
function displayKnowledgeAreas() {
  const container = document.getElementById('knowledge-areas-list');
  container.innerHTML = '';

  const categoryIcons = {
    "Phishing Detection": '<i data-lucide="fish" class="icon icon--xl"></i>',
    "Multi-Factor Authentication (MFA)": '<i data-lucide="lock-keyhole" class="icon icon--xl"></i>',
    "Password Security": '<i data-lucide="key" class="icon icon--xl"></i>',
    "Social Engineering": '<i data-lucide="users" class="icon icon--xl"></i>',
    "Safe Browsing": '<i data-lucide="globe" class="icon icon--xl"></i>'
  };

  const categoryScores = getCategoryScores();

  Object.keys(categoryScores).forEach(category => {
    const data = categoryScores[category];
    if (data.total === 0) return; // Skip categories not in this quiz

    const isStrong = data.correct === data.total;

    const areaItem = document.createElement('div');
    areaItem.className = `area-item ${isStrong ? 'strong' : 'needs-work'}`;

    const icon = document.createElement('div');
    icon.className = 'area-icon';
    icon.innerHTML = categoryIcons[category] || '<i data-lucide="clipboard-list" class="icon icon--xl"></i>';
    if (typeof lucide !== 'undefined') lucide.createIcons({ els: icon.querySelectorAll('[data-lucide]') });

    const content = document.createElement('div');
    content.className = 'area-content';

    const name = document.createElement('div');
    name.className = 'area-name';
    name.textContent = category;

    const status = document.createElement('div');
    status.className = 'area-status';

    if (isStrong) {
      status.textContent = `✓ Strong understanding (${data.correct}/${data.total} correct)`;
    } else {
      status.textContent = `⚠ Needs improvement (${data.correct}/${data.total} correct) - Review this topic`;
    }

    content.appendChild(name);
    content.appendChild(status);
    areaItem.appendChild(icon);
    areaItem.appendChild(content);
    container.appendChild(areaItem);
  });
}

// Retake quiz
function retakeQuiz() {
  const summaryCard = document.getElementById('summary-card');
  const navButtons = document.querySelector('.nav-buttons');
  const progressSection = document.querySelector('.progress-section');

  summaryCard.classList.add('hidden');
  navButtons.classList.remove('hidden');
  progressSection.classList.remove('hidden');

  initQuiz();
}

// Motion here is decorative — an emoji per question and a burst on a good
// score. Neither is reachable by the CSS reduced-motion block, so check
// directly.
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Create falling apple animation (subtle)
function createFallingApple() {
  if (prefersReducedMotion()) return;

  const apple = document.createElement('div');
  apple.textContent = '🍎';
  apple.style.position = 'fixed';
  apple.style.fontSize = '24px';
  apple.style.opacity = '0.3';
  apple.style.pointerEvents = 'none';
  apple.style.zIndex = '1';
  apple.style.left = Math.random() * window.innerWidth + 'px';
  apple.style.top = '-50px';
  apple.style.transition = 'all 3s ease-in';

  document.body.appendChild(apple);

  setTimeout(() => {
    apple.style.top = window.innerHeight + 50 + 'px';
    apple.style.transform = `rotate(${Math.random() * 360}deg)`;
  }, 100);

  setTimeout(() => {
    apple.remove();
  }, 3100);
}

// Create celebration animation
function createCelebration() {
  if (prefersReducedMotion()) return;

  const emojis = ['🍎', '🎉', '⭐', '✨', '🌟'];

  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const emoji = document.createElement('div');
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.position = 'fixed';
      emoji.style.fontSize = '32px';
      emoji.style.pointerEvents = 'none';
      emoji.style.zIndex = '9999';
      emoji.style.left = Math.random() * window.innerWidth + 'px';
      emoji.style.top = window.innerHeight + 'px';
      emoji.style.transition = 'all 2s ease-out';

      document.body.appendChild(emoji);

      setTimeout(() => {
        emoji.style.top = '-100px';
        emoji.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 720}deg)`;
        emoji.style.opacity = '0';
      }, 100);

      setTimeout(() => {
        emoji.remove();
      }, 2100);
    }, i * 100);
  }
}

// Initialize quiz on page load. The nav buttons used to carry onclick
// attributes in the markup; wiring them here is what lets the
// Content-Security-Policy drop 'unsafe-inline'.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('prev-btn')?.addEventListener('click', previousQuestion);
  document.getElementById('next-btn')?.addEventListener('click', nextQuestion);
  document.getElementById('retake-btn')?.addEventListener('click', retakeQuiz);
  initQuiz();
});
