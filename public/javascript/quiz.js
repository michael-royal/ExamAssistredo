// Quiz Logic and Timer Management
class Quiz {
  constructor() {
    this.questions = [];
    this.currentQuestion = 0;
    this.answers = [];
    this.timeLimit = 15; // minutes
    this.timeRemaining = 0;
    this.timer = null;
    this.startTime = null;
    
    this.init();
  }

  init() {
    this.addEventListeners();
    this.generateSampleQuestions();
  }

  addEventListeners() {
    const setupForm = document.getElementById('setupForm');
    if (setupForm) {
      setupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.startQuiz();
      });
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevQuestion());
    }

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.submitQuiz());
    }

  }
generateSampleQuestions() {
  return fetch('/json/quizquestion.json')
    .then(res => res.json())
    .then(data => {
      this.questionBank = data;
      console.log('Questions loaded:', this.questionBank);
    })
    .catch(err => {
      console.error('Failed to load questions:', err);
      alert('Could not load quiz questions. Please refresh the page.');
    });
}


  startQuiz() {
console.log('first one',this.questionBank)
    if (!this.questionBank) {
  alert('Questions not loaded yet. Please wait a moment and try again.');
  return;
}

    const course = document.getElementById('courseSelect').value;
    const questionCount = parseInt(document.getElementById('questionCount').value);
    this.timeLimit = parseInt(document.getElementById('timeLimit').value);
console.log('second one',this.questionBank)


    if (!course) {
      alert('Please select a course ');
      return;
    }
console.log('third one',this.questionBank)
    

    // Get questions for the selected course
    const availableQuestions = this.questionBank[course] || this.questionBank['Bio101']
    console.log(this.questionBank, availableQuestions)

    console.log(availableQuestions)
    
    // Shuffle and select questions
    this.questions = this.shuffleArray([...availableQuestions]).slice(0, questionCount);
    this.answers = new Array(this.questions.length).fill(null);
    this.currentQuestion = 0;
    
    // Set up timer
    this.timeRemaining = this.timeLimit * 60; // convert to seconds
    this.startTime = Date.now();
    
    // // Show quiz interface
    document.getElementById('quizSetup').classList.add('d-none');
    document.getElementById('quizInterface').classList.remove('d-none');
    
    // Start timer and load first question
    this.startTimer();
    this.loadQuestion();
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateTimerDisplay();
      
      if (this.timeRemaining <= 0) {
        this.submitQuiz();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timeRemaining').textContent = timeString;
    
    // Change color when time is running low
    const timerElement = document.getElementById('timer');
    if (this.timeRemaining <= 120) { // 2 minutes
      timerElement.classList.add('warning');
    }
    if (this.timeRemaining <= 60) { // 1 minute
      timerElement.classList.remove('warning');
      timerElement.style.color = '#dc3545';
    }
  }

  loadQuestion() {
    const question = this.questions[this.currentQuestion];
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    
    // Update question text
    questionText.textContent = `${this.currentQuestion + 1}. ${question.question}`;
    
    // Update progress
    progressText.textContent = `${this.currentQuestion + 1} of ${this.questions.length}`;
    const progressPercent = ((this.currentQuestion + 1) / this.questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Load answer options
    answerOptions.innerHTML = question.options.map((option, index) => `
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="answer" id="option${index}" value="${index}" ${this.answers[this.currentQuestion] === index ? 'checked' : ''}>
        <label class="form-check-label" for="option${index}">
          ${option}
        </label>
      </div>
    `).join('');
    
    // Add event listeners to options
    const radioButtons = answerOptions.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.answers[this.currentQuestion] = parseInt(e.target.value);
      });
    });
    
    // Update navigation buttons
    this.updateNavigationButtons();
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    prevBtn.disabled = this.currentQuestion === 0;
    
    if (this.currentQuestion === this.questions.length - 1) {
      nextBtn.classList.add('d-none');
      submitBtn.classList.remove('d-none');
    } else {
      nextBtn.classList.remove('d-none');
      submitBtn.classList.add('d-none');
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
      this.loadQuestion();
    }
  }

  prevQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.loadQuestion();
    }
  }

  submitQuiz() {
    clearInterval(this.timer);
    
    // Calculate results
    let correctAnswers = 0;
    this.questions.forEach((question, index) => {
      if (this.answers[index] === question.answer) {
        correctAnswers++;
      }
    });
    
    const totalQuestions = this.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeUsed = this.timeLimit * 60 - this.timeRemaining;
    const timeUsedString = `${Math.floor(timeUsed / 60)}:${(timeUsed % 60).toString().padStart(2, '0')}`;
    
    // Save result
    const result = {
      course: document.getElementById('courseSelect').selectedOptions[0].text,
      score: score,
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      timeUsed: timeUsedString,
      timestamp: new Date().toISOString()
    };
    
    
    // Show results
    this.showResults(score, correctAnswers, totalQuestions, timeUsedString);
  }

  showResults(score, correct, total, timeUsed) {
    document.getElementById('quizInterface').classList.add('d-none');
    document.getElementById('quizResults').classList.remove('d-none');
    
    document.getElementById('finalScore').textContent = `${score}%`;
    document.getElementById('correctAnswers').textContent = correct;
    document.getElementById('wrongAnswers').textContent = total - correct;
    document.getElementById('timeUsed').textContent = timeUsed;
    
    // Update score description
    const scoreDescription = document.getElementById('scoreDescription');
    if (score >= 90) {
      scoreDescription.textContent = "Excellent! Outstanding performance!";
      scoreDescription.className = "lead text-success";
    } else if (score >= 80) {
      scoreDescription.textContent = "Great job! Very good score!";
      scoreDescription.className = "lead text-primary";
    } else if (score >= 70) {
      scoreDescription.textContent = "Good work! Room for improvement.";
      scoreDescription.className = "lead text-warning";
    } else {
      scoreDescription.textContent = "Keep practicing! You can do better!";
      scoreDescription.className = "lead text-danger";
    }
  }
}


    const restartBtn = document.getElementById('restartQuiz');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => startNewQuiz());
    }
function startNewQuiz() {
  // Reset the quiz
  document.getElementById('quizResults').classList.add('d-none');
  document.getElementById('quizSetup').classList.remove('d-none');
  
  // Reset form
  document.getElementById('setupForm').reset();
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

  
  window.quiz = new Quiz();
});