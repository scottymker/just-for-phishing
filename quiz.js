// Quiz Questions — loaded from data/quiz-questions.js (window.QUIZ_QUESTIONS)
const quizQuestions = window.QUIZ_QUESTIONS;

// Quiz State
let currentQuestionIndex = 0;
let score = 0;
let answers = [];
let selectedAnswer = null;

// Category tracking for personalized feedback
const categoryScores = {
  "Phishing Detection": { correct: 0, total: 0 },
  "Multi-Factor Authentication (MFA)": { correct: 0, total: 0 },
  "Password Security": { correct: 0, total: 0 },
  "Social Engineering": { correct: 0, total: 0 },
  "Safe Browsing": { correct: 0, total: 0 }
};

// Initialize quiz
function initQuiz() {
  window.JFPAnalytics?.trackModuleStart('security_awareness_quiz');
  currentQuestionIndex = 0;
  score = 0;
  answers = [];
  selectedAnswer = null;

  // Reset category scores
  Object.keys(categoryScores).forEach(cat => {
    categoryScores[cat] = { correct: 0, total: 0 };
  });

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
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.onclick = () => selectAnswer(index);
    optionElement.dataset.index = index;
    optionsContainer.appendChild(optionElement);
  });

  // Reset selected answer
  selectedAnswer = null;
  nextBtn.disabled = true;
  nextBtn.textContent = currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz →' : 'Next Question →';

  // Show/hide previous button
  if (currentQuestionIndex > 0) {
    prevBtn.classList.remove('hidden');
  } else {
    prevBtn.classList.add('hidden');
  }

  // Add apple animation
  createFallingApple();
}

// Select answer
function selectAnswer(index) {
  const question = quizQuestions[currentQuestionIndex];
  const options = document.querySelectorAll('.option');

  // If already answered, don't allow change
  if (selectedAnswer !== null) return;

  selectedAnswer = index;
  const isCorrect = index === question.correctIndex;

  // Disable all options
  options.forEach(opt => opt.classList.add('disabled'));

  // Show correct/incorrect styling
  options[index].classList.add('selected');

  setTimeout(() => {
    if (isCorrect) {
      options[index].classList.add('correct');
      score++;
      categoryScores[question.category].correct++;
    } else {
      options[index].classList.add('incorrect');
      // Also show the correct answer
      options[question.correctIndex].classList.add('correct');
    }

    categoryScores[question.category].total++;

    // Store answer
    answers.push({
      questionIndex: currentQuestionIndex,
      selectedIndex: index,
      correct: isCorrect
    });

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
  if (selectedAnswer === null) return;

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

    // If this question was already answered, show the previous answer
    const previousAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
    if (previousAnswer) {
      const options = document.querySelectorAll('.option');
      options.forEach(opt => opt.classList.add('disabled'));
      options[previousAnswer.selectedIndex].classList.add('selected');

      if (previousAnswer.correct) {
        options[previousAnswer.selectedIndex].classList.add('correct');
      } else {
        options[previousAnswer.selectedIndex].classList.add('incorrect');
        options[quizQuestions[currentQuestionIndex].correctIndex].classList.add('correct');
      }

      showFeedback(previousAnswer.correct, quizQuestions[currentQuestionIndex]);
      document.getElementById('next-btn').disabled = false;
      selectedAnswer = previousAnswer.selectedIndex;
    }
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

  // Calculate percentage
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

  Object.keys(categoryScores).forEach(category => {
    const data = categoryScores[category];
    if (data.total === 0) return; // Skip categories not in this quiz

    const isStrong = data.correct === data.total;
    const needsWork = data.correct < data.total;

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

// Create falling apple animation (subtle)
function createFallingApple() {
  const container = document.querySelector('.quiz-container');
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

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', initQuiz);
